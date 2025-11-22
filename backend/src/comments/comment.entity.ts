import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { Article } from '../articles/article.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorName: string;

  @Column()
  @Index()
  authorEmail: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  approved: boolean;

  @Column({ default: false })
  isSpam: boolean;

  @Column({ nullable: true })
  userIp: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Article, article => article.comments)
  article: Article;
}