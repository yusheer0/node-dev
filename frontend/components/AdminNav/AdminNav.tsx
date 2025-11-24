'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getArticlesForAdmin } from '@/lib/api';
import styles from './AdminNav.module.scss';
import { UserStar } from 'lucide-react';

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
      <UserStar height={28} width={28} strokeWidth={1.5} />
    </Link>
  );
}
