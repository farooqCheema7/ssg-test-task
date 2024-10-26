import { Injectable, InternalServerErrorException } from '@nestjs/common';
import postgres from 'postgres';

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

  // Method to retrieve all tasks
  async getTasks() {
    try {
      console.log('Attempting to fetch tasks from database...');
      const tasks = await this.sql`
        SELECT * FROM tasks
      `;
      console.log('Tasks fetched successfully:', tasks);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new InternalServerErrorException('Could not fetch tasks');
    }
  }

  // Method to create a new task
  async createTask(description: string) {
    try {
      const [newTask] = await this.sql`
            INSERT INTO tasks (description, completed)
            VALUES (${description}, false)
            RETURNING *
          `;
      return newTask;
    } catch (error) {
      throw new InternalServerErrorException('Could not create task');
    }
  }

  // Method to update task completion status
  async updateTaskStatus(id: number, completed: boolean) {
    try {
      const [updatedTask] = await this.sql`
            UPDATE tasks
            SET completed = ${completed}
            WHERE id = ${id}
            RETURNING *
          `;
      return updatedTask;
    } catch (error) {
      throw new InternalServerErrorException('Could not update task status');
    }
  }

  // Method to delete a task
  async deleteTask(id: number) {
    try {
      const result = await this.sql`
        DELETE FROM tasks
        WHERE id = ${id}
        RETURNING *
      `;
      return result[0];
    } catch (error) {
      throw new InternalServerErrorException('Could not delete task');
    }
  }
}
