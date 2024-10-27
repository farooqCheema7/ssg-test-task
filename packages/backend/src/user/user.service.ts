// user.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import postgres from 'postgres';
import { User } from './user.types';

@Injectable()
export class UserService {
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

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.sql`
        SELECT id, name, email FROM users
      `;
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Could not fetch users');
    }
  }
}
