import type { Metadata } from 'next'
import { Golos_Text } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import styles from '@/styles/components/layout.module.scss'
import AdminNav from '@/components/AdminNav'

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
          <div className={styles.headerContent}>
            <Link href="/" className={styles.titleLink}>
              <h1 className={styles.title}>node.dev</h1>
            </Link>
            <nav className={styles.nav}>
              <Link href="/about" className={styles.navLink}>О проекте</Link>
              <AdminNav />
            </nav>
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.container}>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}