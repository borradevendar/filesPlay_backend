// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.model';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // Find or create user after Google profile arrives
  async validateOAuthUser(profile: any) {
    const oauthId = profile.id;
    let user = await this.userModel.findOne({ where: { oauthId } });

    if (!user) {
      user = await this.userModel.create({
        oauthProvider: 'google',
        oauthId: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
      });
    } else {
      // optional: update profile fields
      await user.update({
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
      });
    }

    return user;
  }

  // Generate both tokens
  async getTokens(user: { id: number; email: string }) {
  const payload = { sub: user.id, email: user.email };

  const accessToken = await this.jwtService.signAsync(payload, {
    secret: this.config.get<string>('JWT_ACCESS_SECRET')!,
    expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES') || '15m',
  } as any);  // <-- FIX

  const refreshToken = await this.jwtService.signAsync(
    { sub: user.id },
    {
      secret: this.config.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES') || '7d',
    } as any,  // <-- FIX
  );

  return { accessToken, refreshToken };
}


  // Hash and save refresh token to DB
  async saveRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userModel.update({ refreshToken: hashed }, { where: { id: userId } });
  }

  // Clears refresh token (logout)
  async removeRefreshToken(userId: number) {
    await this.userModel.update({ refreshToken: null }, { where: { id: userId } });
  }

  // Validate refresh token and issue new tokens
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userModel.findByPk(userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException('Invalid refresh token');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.getTokens({ id: user.id, email: user.email });
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
