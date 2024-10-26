import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks') // Base route for tasks
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks() {
    return await this.taskService.getTasks();
  }

  @Post()
  async createTask(@Body('description') description: string) {
    return await this.taskService.createTask(description);
  }

  @Patch(':id')
  async updateTaskStatus(
    @Param('id') id: number,
    @Body('completed') completed: boolean,
  ) {
    return await this.taskService.updateTaskStatus(id, completed);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number) {
    return await this.taskService.deleteTask(id);
  }
}
