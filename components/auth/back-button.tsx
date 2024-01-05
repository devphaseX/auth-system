'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
type BackButtonProps = {
  href: string;
  label: string;
};

export const BackButton: React.FC<BackButtonProps> = ({ label, href }) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};