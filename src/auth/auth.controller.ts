// src/auth/auth.controller.ts
import { Controller, Get, Req, UseGuards, Post, Body, HttpCode, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirect handled by GoogleStrategy
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;

    // Generate tokens
    const tokens = await this.authService.getTokens({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });

    // Save hashed refresh token in DB
    await this.authService.saveRefreshToken(user.id, tokens.refreshToken);

    // Redirect user to frontend callback with tokens in URL
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback` +
      `?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;

    return res.redirect(redirectUrl);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Body() body: { userId: number }) {
    await this.authService.removeRefreshToken(body.userId);
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return req.user;
  }
}
