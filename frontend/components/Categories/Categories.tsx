import { Category } from '@/lib/api';
import Link from 'next/link';
import styles from './Categories.module.scss';

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={styles.blockContainerCategories}>
      <section className={styles.categories}>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={styles.categoryCard}
            >
              <h3 className={styles.categoryName}>{category.name}</h3>
              {category.description && (
                <p className={styles.categoryDescription}>{category.description}</p>
              )}
              <span className={styles.categoryCount}>
                {category.articles?.length || 0} статей
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
