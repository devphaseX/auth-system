import { NextAuth, DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  role: 'admin' | 'user';
};
declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}

import { JWT } from 'next-auth/jwt';
declare module '@auth/core/jwt' {
  interface JWT {
    role?: ExtendedUser['role'];
  }
}
