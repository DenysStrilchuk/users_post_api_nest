import {Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards} from '@nestjs/common';
import {PostsService} from './posts.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @Get(':userId')
  getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getUserPosts(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Req() req, @Body('text') text: string) {
    return this.postsService.createPost(req.user.userId, text);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  updatePost(@Param('postId') postId: string, @Req() req, @Body('text') text: string) {
    return this.postsService.updatePost(postId, req.user.userId, text);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  deletePost(@Param('postId') postId: string, @Req() req) {
    return this.postsService.deletePost(postId, req.user.userId);
  }
}
