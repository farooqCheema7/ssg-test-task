import { Injectable, InternalServerErrorException } from '@nestjs/common';
import postgres from 'postgres';
import { Task, TaskWithOwners } from './task.types';

@Injectable()
export class TaskService {
  private sql;

  constructor() {
    this.sql = postgres({
      host: 'localhost',
      port: 5432,
      database: 'ssg',
      username: 'postgres',
      password: 'postgres',
    });
  }

  // Retrieve tasks, optionally filtering by userId
  async getTasks(userId?: number): Promise<TaskWithOwners[]> {
    try {
      const tasks = await this.sql<TaskWithOwners[]>`
        SELECT t.id, t.description, t.completed, t.created_at, t.updated_at,
               json_agg(json_build_object('id', u.id, 'name', u.name)) AS owners
        FROM tasks t
        JOIN task_owners task_owners_rel ON t.id = task_owners_rel.task_id
        JOIN users u ON u.id = task_owners_rel.user_id
        ${userId ? this.sql`WHERE task_owners_rel.user_id = ${userId}` : this.sql``}
        GROUP BY t.id
      `;
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new InternalServerErrorException('Could not fetch tasks');
    }
  }

  // Create a new task with a description and return the created task
  async createTask(
    description: string,
    ownerIds: number[],
  ): Promise<TaskWithOwners> {
    try {
      const [newTask] = await this.sql`
        INSERT INTO tasks (description, completed)
        VALUES (${description}, false)
        RETURNING *
      `;

      await Promise.all(
        ownerIds.map(
          (ownerId) =>
            this.sql`
            INSERT INTO task_owners (task_id, user_id)
            VALUES (${newTask.id}, ${ownerId})
          `,
        ),
      );

      const [taskWithOwners] = await this.sql`
        SELECT t.id, t.description, t.completed, t.created_at, t.updated_at,
               json_agg(json_build_object('id', u.id, 'name', u.name)) AS owners
        FROM tasks t
        JOIN task_owners task_owners_rel ON t.id = task_owners_rel.task_id
        JOIN users u ON u.id = task_owners_rel.user_id
        WHERE t.id = ${newTask.id}
        GROUP BY t.id
      `;
      return taskWithOwners;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new InternalServerErrorException('Could not create task');
    }
  }

  // Update the completion status of a task by ID
  async updateTaskStatus(
    taskId: number,
    userId: number,
    completed: boolean,
  ): Promise<{ message: string }> {
    try {
      const ownerCheck = await this.sql`
        SELECT * FROM task_owners
        WHERE task_id = ${taskId} AND user_id = ${userId}
      `;

      if (ownerCheck.length === 0) {
        throw new Error('User is not authorized to update this task');
      }

      await this.sql`
        UPDATE tasks
        SET completed = ${completed}
        WHERE id = ${taskId}
      `;

      return { message: 'Task updated successfully' };
    } catch (error: any) {
      console.error('Error updating task status:', error);
      throw new InternalServerErrorException(
        error.message || 'Could not update task status',
      );
    }
  }

  // Delete a task by ID
  async deleteTask(
    taskId: number,
    userId: number,
  ): Promise<{ message: string }> {
    try {
      console.log('Deleting task with ID:', taskId, 'for user ID:', userId); // Add this line to log values

      // Check if the user is an owner of the task
      const ownerCheck = await this.sql`
        SELECT * FROM task_owners
        WHERE task_id = ${taskId} AND user_id = ${userId}
      `;

      if (ownerCheck.length === 0) {
        throw new Error('User is not authorized to delete this task');
      }

      // Delete the task from tasks table if the user is authorized
      await this.sql`
        DELETE FROM tasks
        WHERE id = ${taskId}
      `;

      return { message: 'Task deleted successfully' };
    } catch (error: any) {
      console.error('Error deleting task:', error);
      throw new InternalServerErrorException(
        error.message || 'Could not delete task',
      );
    }
  }
}
