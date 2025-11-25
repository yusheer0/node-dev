import { getTopArticles, getCategories, Article, Category } from '@/lib/api';
import TopArticles from '@/components/TopArticles/TopArticles';
import Categories from '@/components/Categories/Categories';
import commonStyles from '@/app/styles/common.module.scss';
import homeStyles from './home.module.scss';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';

export default async function Home() {
  let topArticles: Article[] = [];
  let categories: Category[] = [];

  try {
    // Загружаем топ-статей
    const topData = await getTopArticles(3);
    topArticles = topData.articles || [];

    // Загружаем категории
    categories = await getCategories();
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    topArticles = [];
    categories = [];
  }

  return (
    <div className={commonStyles.page}>
      {topArticles && (
        <TopArticles articles={topArticles} />
      )}

      {categories.length > 0 && (
        <Categories categories={categories} />
      )}

      {(categories.length === 0 && topArticles.length === 0) && (
        <div className={commonStyles.blockContainer}>
          <div className={homeStyles.emptyPage}>Нет данных</div>
        </div>
      )}
    </div>
  );
}