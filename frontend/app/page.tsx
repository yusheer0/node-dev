import { getTopArticles, getArticles, getCategories, Article, Category } from '@/lib/api';
import TopArticles from '@/components/TopArticles/TopArticles';
import Categories from '@/components/Categories/Categories';
import commonStyles from '@/app/styles/common.module.scss';
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
      <div className={commonStyles.blockContainer}>
        <div className={homeStyles.blockWrapper}>
          <TopArticles articles={topArticles} />
        </div>
      </div>

      {/* Категории */}
      <div className={commonStyles.blockContainer}>
        <div className={homeStyles.blockWrapper}>
          <Categories categories={categories} />
        </div>
      </div>
    </div>
  );
}