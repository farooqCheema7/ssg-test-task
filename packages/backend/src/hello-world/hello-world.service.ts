import { Injectable } from '@nestjs/common';
import { DBService } from '@/db/db.service';

@Injectable()
export class HelloWorldService {
  constructor(private readonly dbService: DBService) {}

  async getUsers() {
    const sql = this.dbService.sql;

    const users = await sql`
      SELECT
        *
      FROM
        users
      LIMIT
        10;
    `;
    return users;
  }
}
