'use client';

import { useState } from 'react';
import styles from './ShareButtons.module.scss';

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export default function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description || '')}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className={styles.shareButtons}>
      <span className={styles.shareLabel}>Поделиться:</span>
      <div className={styles.buttons}>
        <a
          href={shareLinks.vk}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.shareButton} ${styles.vk}`}
          title="Поделиться ВКонтакте"
        >
          VK
        </a>

        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.shareButton} ${styles.telegram}`}
          title="Поделиться в Telegram"
        >
          TG
        </a>

        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.shareButton} ${styles.twitter}`}
          title="Поделиться в Twitter"
        >
          TW
        </a>

        <button
          onClick={handleCopyLink}
          className={`${styles.shareButton} ${styles.copy} ${copied ? styles.copied : ''}`}
          title="Копировать ссылку"
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
    </div>
  );
}
