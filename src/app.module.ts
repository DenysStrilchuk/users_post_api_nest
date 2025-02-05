import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import * as process from "process";
import {UsersModule} from './users/users.module';
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017'),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
