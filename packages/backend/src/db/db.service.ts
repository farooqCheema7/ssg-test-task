import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { DATABASE_URL } from '@/utils/constants';

@Injectable()
export class DBService {
  private postgresClient: ReturnType<typeof postgres>;

  onModuleInit() {
    const connectionString = DATABASE_URL;
    this.postgresClient = postgres(connectionString);
  }

  get sql() {
    return this.postgresClient;
  }
}
