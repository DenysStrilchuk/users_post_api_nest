import {Controller, Post, Body, UseGuards, Req, Res} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {Request, Response} from 'express';
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.body.refresh_token; // Отримуємо refreshToken з body

    if (!accessToken || !refreshToken) {
      return res.status(401).json({ message: 'Tokens not provided' });
    }

    await this.authService.logout(accessToken, refreshToken);
    res.json({ message: 'Successfully logged out' });
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string, @Res() res: Response) {
    try {
      const newTokens = await this.authService.refreshToken(refreshToken);
      res.json(newTokens);
    } catch (error) {
      res.status(401).json({message: error.message});
    }
  }
}
