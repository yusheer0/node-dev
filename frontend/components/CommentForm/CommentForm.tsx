'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createComment } from '@/lib/api';
import Input from '@/components/shared/Input/Input';
import Textarea from '@/components/shared/Textarea/Textarea';
import Button from '@/components/shared/Button/Button';
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
      <div className={styles.formGrid}>
        <Input
          type="text"
          name="authorName"
          placeholder="Ваше имя *"
          value={formData.authorName}
          onChange={handleChange}
          required
        />

        <Input
          type="email"
          name="authorEmail"
          placeholder="Ваш email *"
          value={formData.authorEmail}
          onChange={handleChange}
          required
        />
      </div>

      <Textarea
        name="content"
        placeholder="Ваш комментарий *"
        value={formData.content}
        onChange={handleChange}
        required
        rows={4}
      />

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        loadingText="Отправка..."
      >
        Отправить комментарий
      </Button>
    </form>
  );
}