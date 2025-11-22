import EditArticleForm from '@/components/EditArticleForm';
import commonStyles from '../../../common.module.scss';
import adminStyles from '../../../admin/admin.module.scss';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function EditArticlePage({ params }: EditPageProps) {
  const articleId = parseInt(params.id);

  return (
    <div className={commonStyles.page}>
      <div className={adminStyles.container}>
        <h1 className={adminStyles.pageTitle}>Редактировать статью</h1>
        <EditArticleForm articleId={articleId} />
      </div>
    </div>
  );
}
