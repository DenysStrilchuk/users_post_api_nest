import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';

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
        return this.userModel.find({email: new RegExp(search, 'i')}).exec();
      }
    }
    return this.userModel.find().exec();
  }

  async updateUser(
    userId: string,
    updateData: Partial<{ email: string; password: string }>,
  ) {
    if (updateData.email) {
      if (!validator.isEmail(updateData.email)) {
        throw new BadRequestException('Invalid email format');
      }
      const existingUser = await this.userModel.findOne({ email: updateData.email }).exec();
      if (existingUser) {
        throw new BadRequestException('Email is already in use');
      }
    }
    if (updateData.password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(updateData.password)) {
        throw new BadRequestException(
          'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number',
        );
      }
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
