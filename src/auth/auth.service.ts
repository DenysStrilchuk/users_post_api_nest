import {Injectable, UnauthorizedException, BadRequestException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from '../users/schema/user.schema';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<{ message: string }> {
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
    const payload = {sub: user._id, email: user.email};
    return {access_token: this.jwtService.sign(payload)};
  }
}
