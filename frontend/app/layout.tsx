import type { Metadata } from 'next'
import { Golos_Text } from 'next/font/google'
import './styles/reset.css'
import styles from '@/app/styles/layout.module.scss'
import ParticlesBackground from '@/components/ParticlesBackground/ParticlesBackground'
import Header from '@/components/Header/Header'

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
        <ParticlesBackground />
        <Header />
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  )
}