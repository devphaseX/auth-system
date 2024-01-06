import type { NextAuthConfig } from 'next-auth';
import { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { env } from './env/parsed-env';
import { LoginSchema } from './schemas';
import { db } from './db/setup';
import { accounts, users } from './db/schema';
import { eq } from 'drizzle-orm';
import { confirmPassword } from './lib/auth';

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const validateFormDataFields = LoginSchema.safeParse(credentials);

        if (validateFormDataFields.success) {
          const { email, password } = validateFormDataFields.data;

          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

          if (!existingUser) {
            throw new Error('User credential not a match');
          }

          if (!existingUser.passwordHashed) {
            const [account] = await db
              .select()
              .from(accounts)
              .where(eq(accounts.userId, existingUser.id));

            throw new Error(
              `Invalid auth, User should auth using ${account.provider}`
            );
          }
          ``;

          const passwordMatched = await confirmPassword(existingUser, password);

          if (!passwordMatched) {
            throw new Error('User credential not a match');
          }

          // if(!existingUser.emailVerified) {
          //   return
          // }

          return existingUser;
        }
        throw new Error(
          'Invalid credentials.Check your email or password format'
        );
      },
    }),
  ],
} satisfies NextAuthConfig;
