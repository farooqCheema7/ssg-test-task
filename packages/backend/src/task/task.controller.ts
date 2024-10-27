// task.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  InternalServerErrorException,
  Query,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TaskService } from './task.service';
import { Request } from 'express';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserIdFromToken(req: Request): number {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    const decoded = this.jwtService.decode(token) as { id: number };
    return decoded.id;
  }

  @Get()
  async getTasks(@Req() req: Request, @Query('ownedOnly') ownedOnly: string) {
    const userId = this.extractUserIdFromToken(req);
    const fetchOwnedOnly = ownedOnly === 'true';
    return this.taskService.getTasks(userId, fetchOwnedOnly);
  }

  @Post()
  async createTask(
    @Body() body: { description: string; ownerIds: number[] },
    @Req() req: Request,
  ) {
    const userId = this.extractUserIdFromToken(req);
    if (!body.ownerIds.includes(userId)) {
      body.ownerIds.push(userId); // Ensure the user is one of the task owners
    }
    return this.taskService.createTask(body.description, body.ownerIds);
  }

  @Patch(':id')
  async updateTaskStatus(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: { completed: boolean },
  ) {
    const userId = this.extractUserIdFromToken(req);
    return this.taskService.updateTaskStatus(
      parseInt(id, 10),
      userId,
      body.completed,
    );
  }

  @Delete(':id') // Ensure :id is specified here
  async deleteTask(@Param('id') id: string, @Req() req: Request) {
    const userId = this.extractUserIdFromToken(req);
    const taskId = parseInt(id, 10); // Parse the ID as an integer
    if (isNaN(taskId)) {
      throw new BadRequestException('Invalid task ID'); // Optional: Handle invalid ID
    }
    return this.taskService.deleteTask(taskId, userId);
  }
}
