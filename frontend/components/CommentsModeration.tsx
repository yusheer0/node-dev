'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getPendingComments,
  getSpamComments,
  getCommentsStats,
  approveComment,
  markCommentAsSpam,
  deleteComment,
  Comment
} from '@/lib/api';
import styles from '@/styles/components/commentsModeration.module.scss';

export default function CommentsModeration() {
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [spamComments, setSpamComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<{ total: number; approved: number; pending: number; spam: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'spam'>('pending');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pending, spam, statsData] = await Promise.all([
        getPendingComments(),
        getSpamComments(),
        getCommentsStats()
      ]);
      setPendingComments(pending);
      setSpamComments(spam);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      if (error instanceof Error && error.message.includes('401')) {
        router.push('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commentId: number) => {
    try {
      await approveComment(commentId);
      setPendingComments(pendingComments.filter(c => c.id !== commentId));
      loadData(); // Обновляем статистику
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Ошибка при одобрении комментария');
    }
  };

  const handleMarkAsSpam = async (commentId: number) => {
    try {
      await markCommentAsSpam(commentId);
      setPendingComments(pendingComments.filter(c => c.id !== commentId));
      loadData(); // Обновляем статистику
    } catch (error) {
      console.error('Error marking comment as spam:', error);
      alert('Ошибка при пометке комментария как спам');
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      setPendingComments(pendingComments.filter(c => c.id !== commentId));
      setSpamComments(spamComments.filter(c => c.id !== commentId));
      loadData(); // Обновляем статистику
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Ошибка при удалении комментария');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка комментариев...</div>;
  }

  return (
    <div className={styles.commentsModeration}>
      {/* Статистика */}
      {stats && (
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Всего:</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Одобрено:</span>
            <span className={styles.statValue}>{stats.approved}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Ожидают:</span>
            <span className={styles.statValue}>{stats.pending}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Спам:</span>
            <span className={styles.statValue}>{stats.spam}</span>
          </div>
        </div>
      )}

      {/* Табы */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Ожидают модерации ({pendingComments.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'spam' ? styles.active : ''}`}
          onClick={() => setActiveTab('spam')}
        >
          Спам ({spamComments.length})
        </button>
      </div>

      {/* Список комментариев */}
      <div className={styles.commentsList}>
        {activeTab === 'pending' && pendingComments.length === 0 && (
          <div className={styles.emptyState}>
            Нет комментариев ожидающих модерации
          </div>
        )}

        {activeTab === 'spam' && spamComments.length === 0 && (
          <div className={styles.emptyState}>
            Нет спам комментариев
          </div>
        )}

        {(activeTab === 'pending' ? pendingComments : spamComments).map((comment) => (
          <div key={comment.id} className={styles.commentCard}>
            <div className={styles.commentHeader}>
              <div className={styles.authorInfo}>
                <strong>{comment.authorName}</strong>
                <span className={styles.authorEmail}>{comment.authorEmail}</span>
              </div>
              <div className={styles.commentMeta}>
                <time className={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
                {comment.article && (
                  <span className={styles.articleTitle}>
                    Статья: {comment.article.title || 'Без названия'}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.commentContent}>
              {comment.content}
            </div>

            <div className={styles.commentActions}>
              {activeTab === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(comment.id)}
                    className={`${styles.actionButton} ${styles.approve}`}
                  >
                    ✓ Одобрить
                  </button>
                  <button
                    onClick={() => handleMarkAsSpam(comment.id)}
                    className={`${styles.actionButton} ${styles.spam}`}
                  >
                    🚫 Спам
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(comment.id)}
                className={`${styles.actionButton} ${styles.delete}`}
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}







