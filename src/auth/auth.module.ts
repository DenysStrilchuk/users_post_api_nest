import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './strategies/jwt.strategy';
import {UsersModule} from '../users/users.module';
import {AuthController} from "./auth.controller";
import {AuthService} from './services/auth.service';
import {TokenService} from "./services/token.service";
import {RedisModule} from "../redis/redis.module";

@Module({
  imports: [
    RedisModule,
    ConfigModule,
    PassportModule,
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy],
  exports: [
    AuthService,
    TokenService,
    JwtModule,
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
