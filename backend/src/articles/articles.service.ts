import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private commentsService: CommentsService,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ articles: Article[]; total: number }> {
    const [articles, total] = await this.articlesRepository.findAndCount({
      where: { published: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { articles, total };
  }

  async findTopArticles(limit: number = 3): Promise<Article[]> {
    const articles = await this.articlesRepository.find({
      where: { published: true },
      relations: ['comments'],
      order: { createdAt: 'DESC' },
      take: 100, // Берем больше статей для сортировки по популярности
    });

    // Сортируем по комбинированному рейтингу: просмотры + комментарии * 10
    const sortedArticles = articles
      .map(article => ({
        ...article,
        popularityScore: article.views + (article.comments?.length || 0) * 10
      }))
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit);

    return sortedArticles;
  }

  async findByCategory(categoryId: number, page: number = 1, limit: number = 10): Promise<{ articles: Article[]; total: number }> {
    const [articles, total] = await this.articlesRepository.findAndCount({
      where: {
        published: true,
        categoryId: categoryId
      },
      relations: ['comments'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { articles, total };
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { slug },
      relations: ['comments'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articlesRepository.create(createArticleDto);
    return await this.articlesRepository.save(article);
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    await this.articlesRepository.update(id, updateArticleDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.articlesRepository.delete(id);
  }

  async clearAll(): Promise<void> {
    // Сначала удаляем все комментарии
    await this.commentsService.clearAll();
    // Затем удаляем все статьи
    await this.articlesRepository.delete({});
  }

  async findAllForAdmin(page: number = 1, limit: number = 10): Promise<{ articles: Article[]; total: number }> {
    const [articles, total] = await this.articlesRepository.findAndCount({
      where: {}, // Получаем все статьи, включая неопубликованные
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['comments'],
    });

    return { articles, total };
  }

  async findOneForAdmin(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async incrementViews(id: number): Promise<void> {
    await this.articlesRepository.increment({ id }, 'views', 1);
  }
}