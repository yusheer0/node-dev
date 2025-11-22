import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Article } from '../articles/article.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => Article, article => article.category)
  articles: Article[];
}
