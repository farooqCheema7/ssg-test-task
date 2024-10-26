import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    console.log('Login request received:', loginDto); // Log incoming request

    const token = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!token) {
      console.log('Invalid credentials'); // Log if authentication fails
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('Token generated successfully'); // Log if successful
    return { access_token: token };
  }
}
