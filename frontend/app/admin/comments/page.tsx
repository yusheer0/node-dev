import CommentsModeration from '@/components/CommentsModeration/CommentsModeration';
import commonStyles from '@app/styles/common.module.scss';
import commentsStyles from './CommentsAdmin.module.scss';

export default function CommentsAdminPage() {
  return (
    <div className={commonStyles.page}>
      <div className={commentsStyles.container}>
        <h1 className={commentsStyles.pageTitle}>Модерация комментариев</h1>
        <CommentsModeration />
      </div>
    </div>
  );
}


