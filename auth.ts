import { users } from '@/db/schema';
import NextAuth from 'next-auth';
import authOption from '@/auth.config';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db/setup';
import { eq, sql } from 'drizzle-orm';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authOption,
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(
          sql`${users.id} = ${user.id} AND ${users.emailVerified} IS NULL`
        );
    },
  },
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        //@ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (!token?.sub) return token;
      let loggedInUser = user as typeof users.$inferSelect | null;
      if (!loggedInUser) {
        [loggedInUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, token.sub));

        if (!loggedInUser) return null;
      }

      token.role = loggedInUser.role;
      return token;
    },
  },
});
