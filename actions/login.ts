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
    console.log(e);
    if (e instanceof AuthError) {
      switch (e.type) {
        case 'CredentialsSignin': {
          throw new Error(e.message);
        }

        default:
          throw new Error('Something went wrong');
      }
    }

    throw e;
  }
});
