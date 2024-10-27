import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import postgres from 'postgres';

@Injectable()
export class AuthService {
  private sql;

  constructor(private readonly jwtService: JwtService) {
    this.sql = postgres({
      host: 'localhost',
      port: 5432, 
      database: 'ssg',
      username: 'postgres',
      password: 'postgres',
    });
  }

  async validateUser(email: string, password: string): Promise<string | null> {
    // Query the database for the user by email
    const users = await this.sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    
    // Check if user exists and verify password directly (no hashing)
    const user = users[0];
    if (user && password === user.password) { // Plaintext password comparison
      const payload = { email: user.email, sub: user.id, name: user.name };
      return this.jwtService.sign(payload);
    }
    
    return null;
  }
}
