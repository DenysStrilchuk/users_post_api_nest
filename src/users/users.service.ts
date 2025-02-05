import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import * as mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {
  }

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({email, password: hashedPassword});
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({email}).exec();
  }

  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {sub: user._id, email: user.email};
    const token = this.jwtService.sign(payload);

    return {access_token: token};
  }

  async findAll(search?: string) {
    if (search) {
      const isObjectId = mongoose.Types.ObjectId.isValid(search);

      return this.userModel.find({
        $or: [
          { email: new RegExp(search, 'i') },
          ...(isObjectId ? [{ _id: new mongoose.Types.ObjectId(search) }] : [])
        ],
      }).exec();
    }
    return this.userModel.find().exec();
  }
}
