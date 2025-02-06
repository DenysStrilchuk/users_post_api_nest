import {Injectable, UnauthorizedException, BadRequestException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from '../users/schema/user.schema';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {RedisService} from '../redis/redis.service';
import {RegisterDto} from "./dto/register.dto";


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const {email, password} = registerDto;
    const existingUser = await this.userModel.findOne({email}).exec();
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({email, password: hashedPassword});
    await newUser.save();

    return {message: 'User registered successfully'};
  }

  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({email}).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    await this.userModel.updateOne({_id: user._id}, {isOnline: true});
    const payload = {sub: user._id, email: user.email};
    return {access_token: this.jwtService.sign(payload)};
  }

  async logout(token: string) {
    const decoded = this.jwtService.decode(token) as { sub: string } | null;
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }
    await this.userModel.updateOne({_id: decoded.sub}, {isOnline: false});
    await this.redisService.set(`blacklist:${token}`, 'blacklisted', 3600);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const isBlacklisted = await this.redisService.get(`blacklist:${token}`);
    return isBlacklisted !== null;
  }
}
