'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getArticlesForAdmin } from '@/lib/api';
import styles from './AdminNav.module.scss';

export default function AdminNav() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Проверяем аутентификацию попыткой получить админские данные
      await getArticlesForAdmin();
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
    }
  };

  if (!isAuth) {
    return null;
  }

  return (
    <Link href="/admin/dashboard" className={styles.navLink}>
      Админ-панель
    </Link>
  );
}
