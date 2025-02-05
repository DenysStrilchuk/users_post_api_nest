import {Controller, Get, Patch, Delete, UseGuards, Req, Query, Body} from '@nestjs/common';
import {UsersService} from './users.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

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
