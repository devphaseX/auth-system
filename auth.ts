import NextAuth from 'next-auth';
import authOption from '@/auth.config';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db/setup';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authOption,
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' },
});
