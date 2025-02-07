import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as process from 'process';
import { AuthController } from "./auth/auth.controller";
import { AuthService } from './auth/services/auth.service';
import { RedisModule } from "./redis/redis.module";
import {AuthModule} from "./auth/auth.module";
import {PostsModule} from "./posts/posts.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    MongooseModule.forRoot(process.env.MONGO_URI ?? (() => {
      throw new Error('MONGO_URI is not defined');
    })()),
    UsersModule,
    AuthModule,
    RedisModule,
    PostsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? (() => {
        throw new Error('JWT_SECRET is not defined');
      })(),
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    AuthService,
    JwtModule,
    JwtStrategy,
    PassportModule,
    RedisModule,
  ],
})
export class AppModule {}
