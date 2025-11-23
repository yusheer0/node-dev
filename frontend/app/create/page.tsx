import ArticleForm from '@/components/ArticleForm/ArticleForm';
import commonStyles from '../common.module.scss';
import createStyles from './CreateArticleAdmin.module.scss';

export default function CreateArticlePage() {
  return (
    <div className={commonStyles.page}>
      <div className={createStyles.container}>
        <h1 className={createStyles.pageTitle}>Создать новую статью</h1>
        <ArticleForm />
      </div>
    </div>
  );
}
