'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle, getCategories, Category } from '@/lib/api';
import Input from '@/components/shared/Input/Input';
import Textarea from '@/components/shared/Textarea/Textarea';
import Button from '@/components/shared/Button/Button';
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
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Заголовок статьи *</label>
          <Input
            type="text"
            name="title"
            placeholder="Введите заголовок статьи"
            value={formData.title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>URL статьи (slug) *</label>
          <Input
            type="text"
            name="slug"
            placeholder="url-stati"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Краткое описание</label>
          <Input
            type="text"
            name="excerpt"
            placeholder="Краткое описание статьи (опционально)"
            value={formData.excerpt}
            onChange={handleChange}
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
            className={styles.select}
          >
            <option value="">Без категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Содержимое статьи *</label>
        <Textarea
          name="content"
          placeholder="Введите содержимое статьи в HTML формате"
          value={formData.content}
          onChange={handleChange}
          required
          rows={15}
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

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        loadingText="Создание..."
      >
        Создать статью
      </Button>
    </form>
  );
}
