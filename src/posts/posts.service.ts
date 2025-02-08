import {Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Post, PostDocument} from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
  }

  async getUserPosts(userId: string) {
    const posts = await this.postModel.find({userId});
    return {message: 'User posts retrieved successfully', posts};
  }

  async createPost(userId: string, text: string) {
    if (!text.trim()) throw new ForbiddenException('The post cannot be empty');
    const post = await this.postModel.create({userId, text});
    return {message: 'Post created successfully', post};
  }

  async updatePost(postId: string, userId: string, newText: string) {
    const post = await this.postModel.findById(postId).exec();
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only edit your own posts');
    }
    post.text = newText;
    await post.save();
    return {message: 'Post updated successfully', post};
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postModel.findById(postId).exec();
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You can only delete your posts');
    }
    await this.postModel.findByIdAndDelete(postId);
    return {message: 'Post deleted successfully', postId};
  }
}
