'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle, getCategories, Category } from '@/lib/api';
import styles from './ArticleForm.module.scss';

export default function ArticleForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    published: true,
    categoryId: undefined as number | undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createArticle(formData);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        slug: '',
        published: true,
        categoryId: undefined
      });

      // Перенаправляем на главную страницу
      router.push('/');

    } catch (error) {
      console.error('Error creating article:', error);
      alert('Ошибка при создании статьи');
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

  return (
    <form onSubmit={handleSubmit} className={styles.articleForm}>
      <h3 className={styles.title}>Создать статью</h3>

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
        {isSubmitting ? 'Создание...' : 'Создать статью'}
      </button>
    </form>
  );
}
