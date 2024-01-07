'use server';

import { signIn } from '@/auth';
import { users } from '@/db/schema';
import { db } from '@/db/setup';
import { serverAction } from '@/lib/action';
import { sendResetPasswordEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/token';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';

export const loginAction = serverAction(LoginSchema, async (formData) => {
  try {
    await signIn('credentials', {
      ...formData,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (e) {
    if (e instanceof AuthError) {
      let message = e.cause?.err?.message ?? e.message;
      message = message.includes('database') ? 'Something went wrong' : message;

      if (/AccessDenied/i.test(message)) {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, formData.email));

        if (!existingUser) {
          throw new Error('Email not exist');
        }

        if (!existingUser.emailVerified) {
          const verificationToken = await generateVerificationToken(
            existingUser.email
          );
          await sendResetPasswordEmail(
            verificationToken.identifier,
            verificationToken.token
          );
          return { message: 'Confirmation Email is sent' };
        }

        return { message: 'User access is denied' };
      }
      throw new Error(message);
    }

    throw e;
  }
});
