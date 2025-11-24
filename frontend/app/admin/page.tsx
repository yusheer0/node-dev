import LoginForm from '@/components/LoginForm/LoginForm';
import commonStyles from '@/app/styles/common.module.scss';
import loginStyles from './AdminLogin.module.scss';

export default function AdminLoginPage() {
  return (
    <div className={commonStyles.page}>
      <div className={loginStyles.container}>
        <h1 className={loginStyles.pageTitle}>Админ-панель</h1>
        <LoginForm />
      </div>
    </div>
  );
}
