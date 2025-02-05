import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import {UsersModule} from "../users/users.module";

@Module({
  imports: [ConfigModule, PassportModule, UsersModule],
  providers: [JwtStrategy],
})
export class AuthModule {}
