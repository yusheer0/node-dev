'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getArticlesForAdmin, deleteArticle, logout, Article } from '@/lib/api';
import styles from '@/styles/components/articleCard.module.scss';
import commonStyles from '@/app/common.module.scss';
import homeStyles from '../app/home.module.scss';
import dashboardStyles from './AdminDashboard.module.scss';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticlesForAdmin();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error loading articles:', error);
      setError('Ошибка при загрузке статей');
      // Если ошибка аутентификации, перенаправляем на страницу входа
      if (error instanceof Error && error.message.includes('401')) {
        router.push('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) {
      return;
    }

    try {
      await deleteArticle(id);
      setArticles(articles.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      if (error instanceof Error && error.message.includes('401')) {
        alert('Сессия истекла. Пожалуйста, войдите снова.');
        router.push('/admin');
      } else {
        alert(`Ошибка при удалении статьи: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className={commonStyles.page}>
        <div className={dashboardStyles.container}>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={commonStyles.page}>
        <div className={dashboardStyles.container}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={commonStyles.page}>
      <div className={dashboardStyles.container}>
        <div className={dashboardStyles.header}>
          <h1 className={dashboardStyles.pageTitle}>Админ-панель</h1>
          <div>
            <Link href="/create">
              <button className={dashboardStyles.buttonPrimary}>
                Создать статью
              </button>
            </Link>
            <Link href="/admin/categories">
              <button className={dashboardStyles.buttonSuccess}>
                Управление категориями
              </button>
            </Link>
            <Link href="/admin/comments">
              <button className={dashboardStyles.buttonInfo}>
                Модерация комментариев
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className={dashboardStyles.buttonDanger}
            >
              Выйти
            </button>
          </div>
        </div>

        <div className={homeStyles.articlesList}>
          {articles.map((article) => (
            <article key={article.id} className={`${styles.articleCard} ${dashboardStyles.articleCard}`}>
              <div className={dashboardStyles.articleActions}>
                <Link href={`/admin/edit/${article.id}`}>
                  <button className={dashboardStyles.articleButtonEdit}>
                    ✏️
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(article.id)}
                  className={dashboardStyles.articleButtonDelete}
                >
                  🗑️
                </button>
              </div>

              <Link href={`/articles/${article.slug}`} className={styles.articleLink}>
                <h2 className={styles.title}>
                  {article.title}
                  {!article.published && (
                    <span className={dashboardStyles.draftIndicator}>
                      (Не опубликовано)
                    </span>
                  )}
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
          ))}

          {articles.length === 0 && (
            <div className={homeStyles.emptyState}>
              Пока нет статей
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
