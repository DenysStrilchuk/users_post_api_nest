import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from './schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async findAll(search?: string) {
    if (search) {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);
      if (isObjectId) {
        const userById = await this.userModel.findById(search).exec();
        return userById ? [userById] : [];
      } else {
        return this.userModel.find({ email: new RegExp(search, 'i') }).exec();
      }
    }
    return this.userModel.find().exec();
  }

  async updateUser(userId: string, updateData: Partial<{ email: string; password: string }>) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {message: 'User deleted successfully'};
  }
}
