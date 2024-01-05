import type { NextAuthConfig } from 'next-auth';
import { AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from './schemas';
import { db } from './db/setup';
import { accounts, users } from './db/schema';
import { eq } from 'drizzle-orm';
import { confirmPassword } from './lib/auth';

export default {
  providers: [
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
              `Invalid auth, User should auth using ${account.type}`
            );
          }

          const passwordMatched = await confirmPassword(existingUser, password);

          if (passwordMatched) {
            return existingUser;
          }

          if (!existingUser) {
            throw new Error('User credential not a match');
          }

          return existingUser;
        }
        throw new Error(
          'Invalid credentials.Check your email or password format'
        );
      },
    }),
  ],
} satisfies NextAuthConfig;
