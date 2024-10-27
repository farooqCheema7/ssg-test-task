// auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // Specify 'jwt' as strategy name
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'vwenfoj490vm049jmc20ceo9032jdlsamdl', // Use the same hardcoded secret here
    });
  }

  async validate(payload: any) {
    // Return the user information extracted from the JWT payload
    return { id: payload.id, name: payload.name, email: payload.email };
  }
}
