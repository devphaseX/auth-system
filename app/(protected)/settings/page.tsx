import { auth } from '@/auth';

const SettingsPage = async () => {
  const session = await auth();
  console.log({ session });
  return <div>Settings Page</div>;
};

export default SettingsPage;
