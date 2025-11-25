'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createComment } from '@/lib/api';
import styles from './СommentForm.module.scss';

interface CommentFormProps {
  articleId: number;
}

export default function CommentForm({ articleId }: CommentFormProps) {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createComment(articleId, formData);
      setFormData({ authorName: '', authorEmail: '', content: '' });

      // Обновляем данные страницы
      router.refresh();

    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Ошибка при отправке комментария');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <h3 className={styles.title}>Добавить комментарий</h3>

      <div className={styles.formGrid}>
        <input
          type="text"
          name="authorName"
          placeholder="Ваше имя *"
          value={formData.authorName}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          type="email"
          name="authorEmail"
          placeholder="Ваш email *"
          value={formData.authorEmail}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <textarea
        name="content"
        placeholder="Ваш комментарий *"
        value={formData.content}
        onChange={handleChange}
        required
        rows={4}
        className={styles.textarea}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Отправка...' : 'Отправить комментарий'}
      </button>
    </form>
  );
}