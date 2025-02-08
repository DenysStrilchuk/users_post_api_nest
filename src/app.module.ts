import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PassportModule} from '@nestjs/passport';

import configuration from './configs/configuration';
import {JwtConfigModule} from './configs/jwt-config.module';
import {DatabaseModule} from './database/database.module';

import {AuthModule} from './modules/auth/auth.module';
import {UsersModule} from './modules/users/users.module';
import {RedisModule} from './modules/redis/redis.module';
import {PostsModule} from './modules/posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    PassportModule,
    JwtConfigModule,
    UsersModule,
    AuthModule,
    RedisModule,
    PostsModule,
  ],
})
export class AppModule {
}
