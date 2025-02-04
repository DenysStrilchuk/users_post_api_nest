import {Controller, Post, Body, BadRequestException} from '@nestjs/common';
import {UsersService} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
