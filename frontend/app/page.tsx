import { getTopArticles, getArticles, getCategories, Article, Category } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import commonStyles from './common.module.scss';
import homeStyles from './home.module.scss';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';

export default async function Home() {
  let topArticles: Article[] = [];
  let recentArticles: Article[] = [];
  let categories: Category[] = [];

  try {
    // Загружаем топ-статей
    const topData = await getTopArticles(3);
    topArticles = topData.articles || [];

    // Загружаем последние статьи (кроме топовых)
    const recentData = await getArticles();
    recentArticles = (recentData.articles || []).filter(
      article => !topArticles.some(top => top.id === article.id)
    );

    // Загружаем категории
    categories = await getCategories();
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    topArticles = [];
    recentArticles = [];
    categories = [];
  }

  return (
    <div className={commonStyles.page}>
      {/* Топ статей */}
      {topArticles.length > 0 && (
        <div className={homeStyles.blockContainerArticles}>
          <section className={homeStyles.topArticles}>
            <div className={homeStyles.topArticlesGrid}>
              {topArticles.map((article) => (
                <ArticleCard key={article.id} article={article} isTop={true} />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Категории */}
      {categories.length > 0 && (
        <div className={homeStyles.blockContainerCategories}>
          <section className={homeStyles.categories}>
            <div className={homeStyles.categoriesGrid}>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className={homeStyles.categoryCard}
                >
                  <h3 className={homeStyles.categoryName}>{category.name}</h3>
                  {category.description && (
                    <p className={homeStyles.categoryDescription}>{category.description}</p>
                  )}
                  <span className={homeStyles.categoryCount}>
                    {category.articles?.length || 0} статей
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Остальные статьи */}
      {recentArticles.length > 0 && (
        <section className={homeStyles.recentArticles}>
          <h2 className={homeStyles.sectionTitle}>Последние статьи</h2>
          <div className={homeStyles.articlesList}>
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {topArticles.length === 0 && recentArticles.length === 0 && (
        <div className={homeStyles.emptyState}>
          Пока нет статей
        </div>
      )}
    </div>
  );
}