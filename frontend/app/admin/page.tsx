import LoginForm from '@/components/LoginForm';
import commonStyles from '../common.module.scss';
import adminStyles from './admin.module.scss';

export default function AdminLoginPage() {
  return (
    <div className={commonStyles.page}>
      <div className={adminStyles.container}>
        <h1 className={adminStyles.pageTitle}>Админ-панель</h1>
        <LoginForm />
      </div>
    </div>
  );
}
