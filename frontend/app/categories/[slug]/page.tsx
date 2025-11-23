import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getArticlesByCategory, Category, Article } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import commonStyles from '@app/styles/common.module.scss';
import categoryStyles from '../category.module.scss';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  let category: Category | null = null;
  let articles: Article[] = [];
  let totalArticles = 0;

  try {
    // Получаем информацию о категории
    category = await getCategoryBySlug(slug);

    // Получаем статьи категории
    const articlesData = await getArticlesByCategory(category.id);
    articles = articlesData.articles || [];
    totalArticles = articlesData.total || 0;
  } catch (error) {
    console.error('Ошибка при загрузке категории:', error);
    notFound();
  }

  return (
    <div className={commonStyles.page}>
      <div className={categoryStyles.categoryHeader}>
        <h1 className={categoryStyles.categoryTitle}>{category.name}</h1>
        {category.description && (
          <p className={categoryStyles.categoryDescription}>{category.description}</p>
        )}
        <p className={categoryStyles.categoryStats}>
          {totalArticles} {totalArticles === 1 ? 'статья' : totalArticles < 5 ? 'статьи' : 'статей'}
        </p>

        <div className={categoryStyles.breadcrumb}>
          <Link href="/" className={categoryStyles.breadcrumbLink}>Главная</Link>
          <span className={categoryStyles.breadcrumbSeparator}>→</span>
          <span className={categoryStyles.breadcrumbCurrent}>{category.name}</span>
        </div>
      </div>

      <div className={categoryStyles.articlesList}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}

        {articles.length === 0 && (
          <div className={categoryStyles.emptyState}>
            В этой категории пока нет статей
          </div>
        )}
      </div>
    </div>
  );
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;

  try {
    const category = await getCategoryBySlug(slug);
    return {
      title: `${category.name} | node.dev`,
      description: category.description || `Статьи из категории ${category.name}`,
    };
  } catch (error) {
    return {
      title: 'Категория не найдена | node.dev',
    };
  }
}
