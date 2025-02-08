import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from './schema/user.schema';
import {UpdateUserDto} from "./dto/update-user.dto";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async getUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await this.userModel
      .find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .exec();
    const totalUsers = await this.userModel.countDocuments();
    return {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  }

  async searchUsersByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('The request cannot be empty');
    }

    const users = await this.userModel
      .find({ email: new RegExp(email, 'i') })
      .select('-password')
      .exec();

    if (!users.length) {
      throw new NotFoundException('No user found');
    }

    return users;
  }


  async filterUsers(filters: Record<string, string>) {
    const query: any = {};
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (!value) return;
      if (key === 'isOnline') {
        query[key] = value === 'true';
      } else if (['createdAt', 'updatedAt'].includes(key)) {
        const dates = value.split(',');
        if (dates.length === 2) {
          query[key] = { $gte: new Date(dates[0]), $lte: new Date(dates[1]) };
        } else {
          query[key] = { $gte: new Date(value) };
        }
      } else if (['email', 'name'].includes(key)) {
        query[key] = { $regex: value, $options: 'i' };
      } else {
        query[key] = value;
      }
    });
    const users = await this.userModel.find(query).select('-password').exec();
    if (users.length === 0) {
      throw new NotFoundException('Користувачів за даними фільтрами не знайдено');
    }

    return users;
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: string, updateData: UpdateUserDto) {
    try {
      if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(updateData.password, saltRounds);
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {message: 'User deleted successfully'};
  }
}
