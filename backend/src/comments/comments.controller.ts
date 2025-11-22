import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('articles/:articleId/comments')
@UseGuards(ThrottlerGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Param('articleId') articleId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() request: any
  ) {
    const userIp = request.ip;
    const userAgent = request.get('User-Agent') || 'Unknown';

    return await this.commentsService.create(
      articleId, 
      createCommentDto, 
      userIp, 
      userAgent
    );
  }

  @Get()
  async findByArticle(@Param('articleId') articleId: number) {
    return await this.commentsService.findApprovedByArticle(articleId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/pending')
  async getPendingModeration() {
    return await this.commentsService.getPendingModeration();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/spam')
  async getSpamComments() {
    return await this.commentsService.getSpamComments();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/stats')
  async getStats() {
    return await this.commentsService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:id/approve')
  async approveComment(@Param('id') id: number) {
    return await this.commentsService.approveComment(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:id/spam')
  async markAsSpam(@Param('id') id: number) {
    return await this.commentsService.markAsSpam(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  async remove(@Param('id') id: number) {
    return await this.commentsService.remove(id);
  }
}