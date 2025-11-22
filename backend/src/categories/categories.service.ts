import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find({
      order: { order: 'ASC', name: 'ASC' },
      relations: ['articles'],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['articles'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['articles'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Проверяем, не существует ли уже категория с таким именем или slug
    const existingCategory = await this.categoriesRepository.findOne({
      where: [
        { name: createCategoryDto.name },
        { slug: createCategoryDto.slug },
      ],
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name or slug already exists');
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // Проверяем уникальность name и slug при обновлении
    if (updateCategoryDto.name || updateCategoryDto.slug) {
      const whereConditions: any[] = [];
      if (updateCategoryDto.name) {
        whereConditions.push({ name: updateCategoryDto.name });
      }
      if (updateCategoryDto.slug) {
        whereConditions.push({ slug: updateCategoryDto.slug });
      }

      const existingCategory = await this.categoriesRepository.findOne({
        where: whereConditions,
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category with this name or slug already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // Проверяем, есть ли статьи в этой категории
    if (category.articles && category.articles.length > 0) {
      throw new ConflictException('Cannot delete category with articles. Move articles to another category first.');
    }

    await this.categoriesRepository.remove(category);
  }

  async getArticlesCount(id: number): Promise<number> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['articles'],
    });

    return category?.articles?.length || 0;
  }
}
