// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register jwt strategy as default
    JwtModule.register({
      secret: 'vwenfoj490vm049jmc20ceo9032jdlsamdl', // Replace with your JWT secret
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy], // Ensure JwtStrategy is listed in providers
  controllers: [AuthController],
  exports: [PassportModule, JwtModule], // Export PassportModule and JwtModule if needed in other modules
})
export class AuthModule {}
