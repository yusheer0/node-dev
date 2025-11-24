import CategoriesManagement from '@/components/CategoriesManagement/CategoriesManagement';
import commonStyles from '@/app/styles/common.module.scss';
import categoriesStyles from './CategoriesAdmin.module.scss';

export default function CategoriesAdminPage() {
  return (
    <div className={commonStyles.page}>
      <div className={categoriesStyles.container}>
        <h1 className={categoriesStyles.pageTitle}>Управление категориями</h1>
        <CategoriesManagement />
      </div>
    </div>
  );
}

