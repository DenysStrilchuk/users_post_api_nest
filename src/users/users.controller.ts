import {Controller, Post, Body, BadRequestException, Get, UseGuards, Req} from '@nestjs/common';
import {UsersService} from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('register')
  async register(@Body('email') email: string, @Body('password') password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists');
    }
    return this.usersService.register(email, password);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.usersService.login(email, password);
  }
}
