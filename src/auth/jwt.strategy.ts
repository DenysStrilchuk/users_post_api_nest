import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from '../users/schema/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'secretKey'),
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.sub).exec();

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return {userId: user._id, email: user.email};
  }
}
