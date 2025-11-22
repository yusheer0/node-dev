import CategoriesManagement from '@/components/CategoriesManagement';
import commonStyles from '../../common.module.scss';
import adminStyles from '../admin.module.scss';

export default function CategoriesAdminPage() {
  return (
    <div className={commonStyles.page}>
      <div className={adminStyles.container}>
        <h1 className={adminStyles.pageTitle}>Управление категориями</h1>
        <CategoriesManagement />
      </div>
    </div>
  );
}

