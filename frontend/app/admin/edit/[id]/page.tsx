import EditArticleForm from '@/components/EditArticleForm/EditArticleForm';
import commonStyles from '@app/styles/common.module.scss';
import editStyles from './EditArticleAdmin.module.scss';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function EditArticlePage({ params }: EditPageProps) {
  const articleId = parseInt(params.id);

  return (
    <div className={commonStyles.page}>
      <div className={editStyles.container}>
        <h1 className={editStyles.pageTitle}>Редактировать статью</h1>
        <EditArticleForm articleId={articleId} />
      </div>
    </div>
  );
}
