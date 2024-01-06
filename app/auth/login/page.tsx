import { db } from '@/db/setup';
import { LoginForm } from '../../../components/auth/login-forms';
import { users } from '@/db/schema';

export const dynamic = 'force-dynamic';
const LoginPage = async () => {
  return <LoginForm />;
};

export default LoginPage;
