import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { Category } from '../categories/category.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: '' })
  excerpt: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: true })
  published: boolean;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, category => category.articles, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];
}