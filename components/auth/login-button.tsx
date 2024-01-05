'use client';

import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  mode = 'redirect',
  children,
}) => {
  const router = useRouter();
  const onClick = () => {
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return <span>Todo implement modal</span>;
  }
  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};
