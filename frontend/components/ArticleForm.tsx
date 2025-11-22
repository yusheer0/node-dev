'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle, getCategories, Category } from '@/lib/api';
import styles from '@/styles/components/commentForm.module.scss';

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
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <h3 className={styles.title}>Создать статью</h3>

      <input
        type="text"
        name="title"
        placeholder="Заголовок статьи *"
        value={formData.title}
        onChange={handleTitleChange}
        required
        className={styles.input}
      />

      <input
        type="text"
        name="slug"
        placeholder="URL статьи (slug) *"
        value={formData.slug}
        onChange={handleChange}
        required
        className={styles.input}
      />

      <input
        type="text"
        name="excerpt"
        placeholder="Краткое описание (опционально)"
        value={formData.excerpt}
        onChange={handleChange}
        className={styles.input}
      />

      <textarea
        name="content"
        placeholder="Содержимое статьи в HTML формате *"
        value={formData.content}
        onChange={handleChange}
        required
        rows={15}
        className={styles.textarea}
      />

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
