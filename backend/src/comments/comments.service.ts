import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Article } from '../articles/article.entity';

@Injectable()
export class CommentsService {
  private spamKeywords = [
    'http://', 'https://', '[url]', '[/url]', 
    'купить', 'заказать', 'цена', 'дешево', 'скидка',
    'cheap', 'buy now', 'discount', 'order now', 'click here',
    'viagra', 'casino', 'loan', 'insurance'
  ];

  private trustedKeywords = [
    'спасибо', 'интересно', 'полезно', 'отлично', 'хорошо',
    'thanks', 'interesting', 'helpful', 'great', 'good'
  ];

  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(
    articleId: number, 
    createCommentDto: CreateCommentDto,
    userIp: string,
    userAgent: string
  ): Promise<Comment> {
    const article = await this.articlesRepository.findOne({
      where: { id: articleId }
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Убрали проверку CAPTCHA

    await this.checkRateLimit(userIp);
    await this.checkForDuplicates(createCommentDto.content, userIp);

    const spamAnalysis = this.analyzeContent(createCommentDto.content);
    const approved = this.shouldAutoApprove(spamAnalysis, userIp);

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      approved,
      isSpam: spamAnalysis.isSpam,
      userIp,
      userAgent,
      article: { id: articleId }
    });

    return await this.commentsRepository.save(comment);
  }

  private async checkRateLimit(userIp: string): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentCommentsCount = await this.commentsRepository.count({
      where: {
        userIp,
        createdAt: MoreThan(oneHourAgo)
      }
    });

    if (recentCommentsCount >= 10) { // Увеличили лимит до 10 в час
      throw new ForbiddenException('Rate limit exceeded. Please try again later.');
    }
  }

  private async checkForDuplicates(content: string, userIp: string): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const similarComments = await this.commentsRepository.find({
      where: {
        userIp,
        createdAt: MoreThan(oneDayAgo),
        content
      }
    });

    if (similarComments.length > 0) {
      throw new ForbiddenException('Duplicate comment detected.');
    }
  }

  private analyzeContent(content: string): { isSpam: boolean; score: number; reasons: string[] } {
    const lowerContent = content.toLowerCase();
    let score = 0;
    const reasons: string[] = [];

    this.spamKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword.toLowerCase())) {
        score += 2;
        reasons.push(`Contains spam keyword: ${keyword}`);
      }
    });

    const urlRegex = /(http|https|www|\.com|\.ru|\.net)/gi;
    const urlMatches = lowerContent.match(urlRegex);
    if (urlMatches) {
      score += urlMatches.length * 3;
      reasons.push(`Contains ${urlMatches.length} URL(s)`);
    }

    if (content.length < 20) {
      score += 1;
      reasons.push('Comment too short');
    }

    if (content.length > 500) {
      score += 1;
      reasons.push('Comment too long');
    }

    const repeatingChars = /(.)\1{5,}/gi;
    if (repeatingChars.test(content)) {
      score += 2;
      reasons.push('Repeating characters detected');
    }

    this.trustedKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword.toLowerCase())) {
        score -= 1;
      }
    });

    return {
      isSpam: score >= 3,
      score,
      reasons
    };
  }

  private shouldAutoApprove(analysis: { isSpam: boolean; score: number }, userIp: string): boolean {
    if (analysis.isSpam) {
      return false;
    }
    return analysis.score <= 1;
  }

  async findApprovedByArticle(articleId: number): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { 
        article: { id: articleId },
        approved: true,
        isSpam: false
      },
      order: { createdAt: 'DESC' }
    });
  }

  async getPendingModeration(): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { approved: false, isSpam: false },
      relations: ['article'],
      order: { createdAt: 'DESC' }
    });
  }

  async getSpamComments(): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { isSpam: true },
      relations: ['article'],
      order: { createdAt: 'DESC' }
    });
  }

  async approveComment(id: number): Promise<Comment> {
    await this.commentsRepository.update(id, { 
      approved: true,
      isSpam: false 
    });
    const comment = await this.commentsRepository.findOne({ 
      where: { id },
      relations: ['article']
    });
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    
    return comment;
  }

  async markAsSpam(id: number): Promise<Comment> {
    await this.commentsRepository.update(id, { 
      isSpam: true,
      approved: false 
    });
    const comment = await this.commentsRepository.findOne({ 
      where: { id },
      relations: ['article']
    });
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    
    return comment;
  }

  async remove(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }

  async getStats() {
    const total = await this.commentsRepository.count();
    const approved = await this.commentsRepository.count({ where: { approved: true } });
    const pending = await this.commentsRepository.count({ where: { approved: false, isSpam: false } });
    const spam = await this.commentsRepository.count({ where: { isSpam: true } });

    return { total, approved, pending, spam };
  }

  async clearAll(): Promise<void> {
    await this.commentsRepository.delete({});
  }
}