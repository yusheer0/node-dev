import Link from 'next/link'
import styles from './Header.module.scss'
import commonStyles from '@/app/styles/common.module.scss'
import AdminNav from '@/components/AdminNav/AdminNav'
import { SquareLibrary } from 'lucide-react';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={commonStyles.blockContainer}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.titleLink}>
            <h1 className={styles.title}>node.dev</h1>
          </Link>
          <nav className={styles.nav}>
            <Link href="/about" className={styles.navLink}><SquareLibrary height={28} width={28} strokeWidth={1.5} /></Link>
            <AdminNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
