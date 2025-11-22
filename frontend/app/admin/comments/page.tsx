import CommentsModeration from '@/components/CommentsModeration';
import commonStyles from '../../common.module.scss';
import adminStyles from '../admin.module.scss';

export default function CommentsAdminPage() {
  return (
    <div className={commonStyles.page}>
      <div className={adminStyles.container}>
        <h1 className={adminStyles.pageTitle}>Модерация комментариев</h1>
        <CommentsModeration />
      </div>
    </div>
  );
}


