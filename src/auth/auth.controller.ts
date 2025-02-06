import {Controller, Post, Body, UseGuards, Req, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {Request, Response} from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.register(email, password);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    await this.authService.logout(token);
    res.json({ message: 'Successfully logged out' });
  }
}
