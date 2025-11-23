import type { Metadata } from 'next'
import { Golos_Text } from 'next/font/google'
import './styles/reset.css'
import Link from 'next/link'
import styles from '@/app/styles/layout.module.scss'
import commonStyles from '@/app/styles/common.module.scss'
import AdminNav from '@/components/AdminNav/AdminNav'

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'node.dev | Разработка на Node',
  description: 'Блог о разработке на Node.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${golos.className} ${styles.layout}`}>
        <header className={styles.header}>
          <div className={commonStyles.blockContainer}>
            <div className={styles.headerContent}>
              <Link href="/" className={styles.titleLink}>
                <h1 className={styles.title}>node.dev</h1>
              </Link>
              <nav className={styles.nav}>
                <Link href="/about" className={styles.navLink}>О проекте</Link>
                <AdminNav />
              </nav>
            </div>
          </div>
        </header>
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  )
}