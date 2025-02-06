import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './jwt.strategy';
import {UsersModule} from '../users/users.module';
import * as process from 'process';
import {AuthController} from "./auth.controller";
import {AuthService} from './auth.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? (() => {
        throw new Error('JWT_SECRET is not defined');
      })(),
      signOptions: {expiresIn: '1h'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    AuthService,
    JwtModule,
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
