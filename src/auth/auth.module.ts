// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/user.model';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    SequelizeModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule is global but keep safe
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
  const secret = config.get<string>('JWT_ACCESS_SECRET');
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET missing');
  }

  return {
    secret,
    signOptions: {
      expiresIn: config.get<string>('JWT_ACCESS_EXPIRES') || '15m',
    },
  } as any; // <--- FIX
},

    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
