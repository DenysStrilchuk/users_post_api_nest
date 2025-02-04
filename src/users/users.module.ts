import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from './schema/user.schema';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {JwtModule} from '@nestjs/jwt';
import * as process from "process";

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? (() => { throw new Error('JWT_SECRET is not defined'); })(),
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
}
