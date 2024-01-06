'use server';

import { signIn } from '@/auth';
import { serverAction } from '@/lib/action';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
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
      throw new Error(message);
    }

    throw e;
  }
});
