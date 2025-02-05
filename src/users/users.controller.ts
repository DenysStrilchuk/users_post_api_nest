import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UseGuards,
  Req,
  Query,
  Delete,
  Patch
} from '@nestjs/common';
import {UsersService} from './users.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUsers(@Query('search') search: string) {
    return this.usersService.findAll(search);
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

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() req, @Body() updateData: Partial<{ email: string; password: string }>) {
    return this.usersService.updateUser(req.user.userId, updateData);
  }


  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req) {
    return this.usersService.deleteUser(req.user.userId);
  }
}
