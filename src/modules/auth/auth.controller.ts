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
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto.email, loginDto.password, res);
    return res.status(200).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken || !refreshToken) {
      return res.status(401).json({ message: 'Tokens not provided' });
    }

    await this.authService.logout(accessToken, refreshToken);
    res.clearCookie('refresh_token');
    res.json({ message: 'Successfully logged out' });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return res.status(401).json({message: 'Refresh token is required'});
      }
      const newTokens = await this.authService.refreshToken(refreshToken);
      return res.json(newTokens);
    } catch (error) {
      return res.status(401).json({message: error.message});
    }
  }
}
