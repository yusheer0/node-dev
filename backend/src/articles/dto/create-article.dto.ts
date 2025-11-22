import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsInt } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsNumber()
  @IsOptional()
  views?: number;

  @IsInt()
  @IsOptional()
  categoryId?: number;
}