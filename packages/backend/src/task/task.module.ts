// task/task.module.ts
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
