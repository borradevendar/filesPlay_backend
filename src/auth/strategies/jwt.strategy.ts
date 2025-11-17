// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_ACCESS_SECRET');

    // Force secret to always be string (fixes the TS error)
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not set in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret as string,   // <--- FIX: ensures type is correct
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
