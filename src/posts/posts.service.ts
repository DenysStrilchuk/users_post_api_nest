import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Post, PostDocument} from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
  }

  async getUserPosts(userId: string) {
    return this.postModel.find({userId});
  }

  async createPost(userId: string, text: string) {
    if (!text.trim()) throw new ForbiddenException('Пост не може бути порожнім');
    return this.postModel.create({userId, text});
  }

  async updatePost(postId: string, userId: string, newText: string) {
    const post = await this.postModel.findById(postId).exec();

    if (!post) throw new NotFoundException('Пост не знайдено');

    if (post.userId !== userId) {
      throw new ForbiddenException('Ви можете редагувати лише свої пости');
    }

    post.text = newText;
    return post.save();
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId).exec();

    if (!post) throw new NotFoundException('Пост не знайдено');

    if (post.userId !== userId) {
      throw new ForbiddenException('Ви можете видаляти лише свої пости');
    }

    return this.postModel.findByIdAndDelete(postId);
  }
}
