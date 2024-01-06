import { auth, signOut } from '@/auth';

const SettingsPage = async () => {
  const session = await auth();
  console.log({ session });
  return (
    <div>
      <h1>Settings</h1>

      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <button type="submit" className="bg-neutral-400 px-4 py-2">
          Sign out
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
