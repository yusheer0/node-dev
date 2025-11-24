'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category
} from '@/lib/api';
import styles from './CategoriesManagement.module.scss';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    order: 0
  });
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      if (error instanceof Error && error.message.includes('401')) {
        router.push('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      order: 0
    });
    setEditingCategory(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }

      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Ошибка при сохранении категории');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      order: category.order || 0
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Ошибка при удалении категории');
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-zа-я0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : generateSlug(name)
    }));
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка категорий...</div>;
  }

  return (
    <div className={styles.categoriesManagement}>
      <div className={styles.header}>
        <h2>Управление категориями</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className={styles.createButton}
        >
          + Создать категорию
        </button>
      </div>

      {showCreateForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{editingCategory ? 'Редактировать категорию' : 'Создать категорию'}</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Название *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="slug">Slug *</label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Описание</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="order">Порядок сортировки</label>
                <input
                  type="number"
                  id="order"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className={styles.input}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  {editingCategory ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.categoriesList}>
        {categories.length === 0 ? (
          <div className={styles.emptyState}>
            Категорий пока нет. Создайте первую категорию!
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className={styles.categoryCard}>
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categorySlug}>/{category.slug}</p>
                {category.description && (
                  <p className={styles.categoryDescription}>{category.description}</p>
                )}
                <div className={styles.categoryMeta}>
                  <span className={styles.order}>Порядок: {category.order}</span>
                  <span className={styles.articlesCount}>
                    {category.articles?.length || 0} статей
                  </span>
                </div>
              </div>

              <div className={styles.categoryActions}>
                <button
                  onClick={() => handleEdit(category)}
                  className={styles.editButton}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className={styles.deleteButton}
                  disabled={(category.articles?.length || 0) > 0}
                  title={(category.articles?.length || 0) > 0 ? 'Нельзя удалить категорию со статьями' : 'Удалить категорию'}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}







