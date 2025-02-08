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
  @Post('me')
  createPost(@Req() req, @Body('text') text: string) {
    return this.postsService.createPost(req.user.userId, text);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:postId')
  updatePost(@Req() req, @Param('postId') postId: string, @Body('text') text: string) {
    return this.postsService.updatePost(postId, req.user.userId, text);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:postId')
  deletePost(@Req() req, @Param('postId') postId: string) {
    return this.postsService.deletePost(postId, req.user.userId);
  }
}
