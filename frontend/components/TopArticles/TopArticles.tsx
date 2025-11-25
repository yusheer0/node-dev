import { Article } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import styles from './TopArticles.module.scss';

interface TopArticlesProps {
  articles: Article[];
}

export default function TopArticles({ articles }: TopArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className={styles.topArticles}>
      <div className={styles.topArticlesGrid}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} isTop={true} />
        ))}
      </div>
    </section>
  );
}




