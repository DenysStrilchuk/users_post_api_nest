import {Controller, Get, Patch, Delete, UseGuards, Req, Query, Body, Param} from '@nestjs/common';
import {UsersService} from './users.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.usersService.getUsers(page, limit);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Query('query') query: string) {
    return this.usersService.searchUsersByEmail(query);
  }

  @Get('filter')
  @UseGuards(JwtAuthGuard)
  async filterUsers(@Query() filters: Record<string, string>) {
    return this.usersService.filterUsers(filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() req, @Body() updateData: UpdateUserDto) {
    return this.usersService.updateUser(req.user.userId, updateData);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Req() req) {
    return this.usersService.deleteUser(req.user.userId);
  }
}
