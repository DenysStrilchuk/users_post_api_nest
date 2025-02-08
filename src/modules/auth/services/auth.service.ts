import {Injectable, UnauthorizedException, BadRequestException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from '../../users/schema/user.schema';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {RedisService} from '../../redis/redis.service';
import {RegisterDto} from "../dto/register.dto";
import {TokenService} from "./token.service";
import {Response} from 'express'


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
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

  async login(email: string, password: string, res: Response): Promise<{ access_token: string;}> {
    const user = await this.userModel.findOne({email}).exec();
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    const accessToken = this.tokenService.generateAccessToken(user._id, user.email);
    const refreshToken = this.tokenService.generateRefreshToken(user._id);

    await this.userModel.updateOne({ _id: user._id }, { isOnline: true });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: accessToken };
  }

  async logout(accessToken: string, refreshToken: string) {
    const decodedAccess = this.tokenService.verifyAccessToken(accessToken);
    const decodedRefresh = this.tokenService.verifyRefreshToken(refreshToken);
    if (!decodedAccess || !decodedRefresh) {
      throw new UnauthorizedException('Invalid token');
    }
    await this.userModel.updateOne({_id: decodedAccess.sub}, {isOnline: false});
    await this.redisService.set(`blacklist:access:${accessToken}`, 'blacklisted', 3600);
    await this.redisService.set(`blacklist:refresh:${refreshToken}`, 'blacklisted', 604800);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const accessBlacklisted = await this.redisService.get(`blacklist:access:${token}`);
    const refreshBlacklisted = await this.redisService.get(`blacklist:refresh:${token}`);
    return accessBlacklisted !== null || refreshBlacklisted !== null;
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const isBlacklisted = await this.redisService.get(`blacklist:refresh:${refreshToken}`);
    if (isBlacklisted) {
      throw new UnauthorizedException('Refresh token is blacklisted');
    }
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);
    if (!decoded) throw new UnauthorizedException('Invalid refresh token');
    const newAccessToken = this.tokenService.generateAccessToken(decoded.sub, decoded.email ?? '');
    return {access_token: newAccessToken};
  }
}
