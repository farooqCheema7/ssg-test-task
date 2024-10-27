import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskWithOwners } from './task.types';

@Controller('tasks') // Base route for tasks
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks(@Query('userId') userId?: number) {
    return await this.taskService.getTasks(userId ? Number(userId) : undefined);
  }

  @Post()
  async createTask(
    @Body('description') description: string,
    @Body('ownerIds') ownerIds: number[],
  ): Promise<TaskWithOwners> {
    return await this.taskService.createTask(description, ownerIds);
  }

  @Patch(':id')
  async updateTaskStatus(
    @Param('id') taskId: number,
    @Query('userId') userId: number, // will update this with jwt token user id
    @Body('completed') completed: boolean, // Get new completed status from request body
  ) {
    try {
      return await this.taskService.updateTaskStatus(taskId, userId, completed);
    } catch (error: any) {
      if (error.message === 'User is not authorized to update this task') {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async deleteTask(
    @Param('id') taskId: number, // will update this with jwt token user id
    @Query('userId') userId: number,
  ) {
    // Call the deleteTask method in TaskService and handle unauthorized cases
    try {
      return await this.taskService.deleteTask(taskId, userId);
    } catch (error: any) {
      if (error.message === 'User is not authorized to delete this task') {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
