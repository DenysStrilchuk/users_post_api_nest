import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from './schema/user.schema';
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async getUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await this.userModel
      .find()
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

  async searchUsers(query: string) {
    if (!query) return [];

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);

    if (isObjectId) {
      const userById = await this.userModel.findById(query).exec();
      return userById ? [userById] : [];
    }

    return this.userModel.find({email: new RegExp(query, 'i')}).exec();
  }

  async filterUsers(filters: Record<string, string>) {
    const query: any = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (key === 'isOnline') {
        query[key] = value === 'true';
      } else if (['createdAt', 'updatedAt'].includes(key)) {
        query[key] = {$gte: new Date(value)};
      } else {
        query[key] = value;
      }
    });

    return this.userModel.find(query).exec();
  }

  async updateUser(userId: string, updateData: UpdateUserDto) {
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
