'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getArticleByIdForAdmin, updateArticle, getCategories, Article, Category } from '@/lib/api';
import styles from './EditArticleForm.module.scss';

interface EditArticleFormProps {
  articleId: number;
}

export default function EditArticleForm({ articleId }: EditArticleFormProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    published: true,
    categoryId: undefined as number | undefined
  });
  const router = useRouter();

  useEffect(() => {
    loadArticle();
    loadCategories();
  }, [articleId]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadArticle = async () => {
    try {
      const articleData = await getArticleByIdForAdmin(articleId);
      setArticle(articleData);
      setFormData({
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt || '',
        slug: articleData.slug,
        published: articleData.published,
        categoryId: articleData.categoryId
      });
    } catch (error) {
      console.error('Error loading article:', error);
      if (error instanceof Error && error.message.includes('401')) {
        alert('Сессия истекла. Пожалуйста, войдите снова.');
        router.push('/admin');
      } else {
        alert(`Ошибка при загрузке статьи: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        router.push('/admin/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateArticle(articleId, formData);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Ошибка при обновлении статьи');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setFormData(prev => ({
      ...prev,
      title,
      slug
    }));
  };

  if (loading) {
    return (
      <div className={styles.editArticleForm}>
        <div className={styles.loading}>Загрузка статьи...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.editArticleForm}>
      <h3 className={styles.title}>Редактировать статью</h3>

      <div className={styles.formGroup}>
        <label>Заголовок статьи *</label>
        <input
          type="text"
          name="title"
          placeholder="Введите заголовок статьи"
          value={formData.title}
          onChange={handleTitleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label>URL статьи (slug) *</label>
        <input
          type="text"
          name="slug"
          placeholder="url-stati"
          value={formData.slug}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Краткое описание</label>
        <input
          type="text"
          name="excerpt"
          placeholder="Краткое описание статьи (опционально)"
          value={formData.excerpt}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Категория</label>
        <select
          name="categoryId"
          value={formData.categoryId || ''}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            categoryId: e.target.value ? parseInt(e.target.value) : undefined
          }))}
          className={styles.input}
        >
          <option value="">Без категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Содержимое статьи *</label>
        <textarea
          name="content"
          placeholder="Введите содержимое статьи в HTML формате"
          value={formData.content}
          onChange={handleChange}
          required
          rows={15}
          className={styles.textarea}
        />
      </div>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          name="published"
          checked={formData.published}
          onChange={handleChange}
        />
        Опубликовать статью
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
    </form>
  );
}
