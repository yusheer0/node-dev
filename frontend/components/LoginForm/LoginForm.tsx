'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import styles from './LoginForm.module.scss';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(password);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Неверный пароль');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <h3 className={styles.title}>Вход в админ-панель</h3>

      <div className={styles.formGroup}>
        <label>Пароль администратора</label>
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
}
