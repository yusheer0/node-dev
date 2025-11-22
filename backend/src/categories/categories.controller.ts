import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Получить все категории **/
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  /** Получить категорию по ID **/
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      throw new Error('Invalid category ID');
    }
    return await this.categoriesService.findOne(categoryId);
  }

  /** Получить категорию по slug **/
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.categoriesService.findBySlug(slug);
  }

  /** Создать категорию (защищено) **/
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  /** Обновить категорию (защищено) **/
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      throw new Error('Invalid category ID');
    }
    return await this.categoriesService.update(categoryId, updateCategoryDto);
  }

  /** Удалить категорию (защищено) **/
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      throw new Error('Invalid category ID');
    }
    await this.categoriesService.remove(categoryId);
  }

  /** Получить количество статей в категории **/
  @Get(':id/article-count')
  async getArticlesCount(@Param('id') id: string) {
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      throw new Error('Invalid category ID');
    }
    const count = await this.categoriesService.getArticlesCount(categoryId);
    return { count };
  }
}
