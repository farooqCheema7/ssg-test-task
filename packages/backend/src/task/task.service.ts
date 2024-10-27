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
      let tasks;
      if (userId) {
        console.log('Fetching tasks for userId:', userId);
        tasks = await this.sql`
          SELECT t.id, t.description, t.completed, t.created_at, t.updated_at,
                 json_agg(json_build_object('id', u.id, 'name', u.name)) AS owners
          FROM tasks t
          JOIN task_owners task_owners_rel ON t.id = task_owners_rel.task_id
          JOIN users u ON u.id = task_owners_rel.user_id
          WHERE task_owners_rel.user_id = ${userId}
          GROUP BY t.id
        `;
      } else {
        console.log('Fetching all tasks');
        tasks = await this.sql`
          SELECT t.id, t.description, t.completed, t.created_at, t.updated_at,
                 json_agg(json_build_object('id', u.id, 'name', u.name)) AS owners
          FROM tasks t
          JOIN task_owners task_owners_rel ON t.id = task_owners_rel.task_id
          JOIN users u ON u.id = task_owners_rel.user_id
          GROUP BY t.id
        `;
      }
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
      // Insert the new task into the tasks table
      const [newTask] = await this.sql`
        INSERT INTO tasks (description, completed)
        VALUES (${description}, false)
        RETURNING *
      `;

      // Insert owners for this task into the task_owners table
      await Promise.all(
        ownerIds.map(
          (ownerId) =>
            this.sql`
            INSERT INTO task_owners (task_id, user_id)
            VALUES (${newTask.id}, ${ownerId})
          `,
        ),
      );

      // Fetch the new task along with its owners to return in the response
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

  // Update the completion status of a task by ID and return the updated task
  async updateTaskStatus(
    taskId: number,
    userId: number, // will update this with jwt token user id
    completed: boolean,
  ): Promise<{ message: string }> {
    try {
      // Check if the user is an owner of the task
      const ownerCheck = await this.sql`
        SELECT * FROM task_owners
        WHERE task_id = ${taskId} AND user_id = ${userId}
      `;

      if (ownerCheck.length === 0) {
        // User is not an owner, so deny the update
        throw new Error('User is not authorized to update this task');
      }

      // Update the task's completed status
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

  // Delete a task by ID and return the deleted task
  async deleteTask(
    taskId: number,
    userId: number, // will update this with jwt token user id
  ): Promise<{ message: string }> {
    try {
      // Check if the user is an owner of the task
      const ownerCheck = await this.sql`
        SELECT * FROM task_owners
        WHERE task_id = ${taskId} AND user_id = ${userId}
      `;

      if (ownerCheck.length === 0) {
        // User is not an owner, so deny deletion
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
