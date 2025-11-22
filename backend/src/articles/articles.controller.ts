import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /** Получение всех статей **/
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.articlesService.findAll(page, limit);
  }

  /** Получение топ статей (по просмотрам и комментариям) **/
  @Get('top')
  async findTopArticles(@Query('limit') limit: number = 3) {
    const articles = await this.articlesService.findTopArticles(limit);
    return { articles };
  }

  /** Получение статей по категории **/
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const categoryIdNum = parseInt(categoryId, 10);
    if (isNaN(categoryIdNum)) {
      throw new Error('Invalid category ID');
    }
    return await this.articlesService.findByCategory(categoryIdNum, page, limit);
  }

  /** Получение статьи по ID **/
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const articleId = parseInt(id, 10);
    if (isNaN(articleId)) {
      throw new Error('Invalid article ID');
    }
    return await this.articlesService.findOne(articleId);
  }

  /** Получение статьи по slug **/
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const article = await this.articlesService.findBySlug(slug);
    // Инкрементируем просмотры при просмотре статьи
    await this.articlesService.incrementViews(article.id);
    return article;
  }

  /** Создание статьи (защищено) **/
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create(createArticleDto);
  }

  /** Обновление статьи (защищено) **/
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    const articleId = parseInt(id, 10);
    if (isNaN(articleId)) {
      throw new Error('Invalid article ID');
    }
    return await this.articlesService.update(articleId, updateArticleDto);
  }

  /** Удаление статьи (защищено) **/
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const articleId = parseInt(id, 10);
    if (isNaN(articleId)) {
      throw new Error('Invalid article ID');
    }
    return await this.articlesService.remove(articleId);
  }

  /** Получение всех статей для админа (включая неопубликованные, защищено) **/
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async findAllForAdmin(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.articlesService.findAllForAdmin(page, limit);
  }

  /** Получение статьи по ID для админа (защищено) **/
  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async findOneForAdmin(@Param('id') id: string) {
    const articleId = parseInt(id, 10);
    if (isNaN(articleId)) {
      throw new Error('Invalid article ID');
    }
    return await this.articlesService.findOneForAdmin(articleId);
  }

  /** Очистка всех статей (защищено) **/
  @UseGuards(JwtAuthGuard)
  @Delete('clear/all')
  async clearAll() {
    await this.articlesService.clearAll();
    return { message: 'Все статьи успешно удалены' };
  }
}