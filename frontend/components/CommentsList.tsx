import { Comment } from '@/lib/api';
import styles from '@/styles/components/commentsList.module.scss';

interface CommentsListProps {
  comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className={styles.noComments}>
        Пока нет комментариев. Будьте первым!
      </div>
    );
  }

  return (
    <div className={styles.commentsList}>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.comment}>
          <div className={styles.commentHeader}>
            <div className={styles.authorInfo}>
              <h4 className={styles.authorName}>{comment.authorName}</h4>
              <p className={styles.authorEmail}>{comment.authorEmail}</p>
            </div>
            <time className={styles.commentDate}>
              {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
            </time>
          </div>
          <p className={styles.commentContent}>
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}