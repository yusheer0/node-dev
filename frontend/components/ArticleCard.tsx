import Link from 'next/link';
import { Article } from '@/lib/api';
import styles from '@/styles/components/articleCard.module.scss';

interface ArticleCardProps {
  article: Article;
  isTop?: boolean;
}

export default function ArticleCard({ article, isTop = false }: ArticleCardProps) {
  return (
    <article className={`${styles.articleCard} ${isTop ? styles.topCard : ''}`}>
      <Link href={`/articles/${article.slug}`} className={styles.articleLink}>
        <h2 className={styles.title}>
          {article.title}
        </h2>

        {article.excerpt && (
          <p className={styles.excerpt}>
            {article.excerpt}
          </p>
        )}

        <div className={styles.meta}>
          <time dateTime={article.createdAt} className={styles.date}>
            {new Date(article.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>

          <div className={styles.stats}>
            <span className={styles.views}>
              {article.views} просмотров
            </span>

            {article.comments && (
              <span className={styles.comments}>
                {article.comments.length} комментариев
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}