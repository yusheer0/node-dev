import ArticleForm from '@/components/ArticleForm';
import commonStyles from '../common.module.scss';
import adminStyles from '../admin/admin.module.scss';

export default function CreateArticlePage() {
  return (
    <div className={commonStyles.page}>
      <div className={adminStyles.container}>
        <h1 className={adminStyles.pageTitle}>Создать новую статью</h1>
        <ArticleForm />
      </div>
    </div>
  );
}
