'use server';

import { NewPasswordSchema, ResetSchema } from '@/schemas';
import { serverAction } from '@/lib/action';
import { db } from '@/db/setup';
import { passwordTokens, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateResetPasswordToken } from '@/lib/password-reset-token';
import { sendResetPasswordEmail } from '@/lib/mail';
import { isPast } from 'date-fns';
import { hashedPassword } from '@/lib/auth';

export const resetPasswordLinkAction = serverAction(
  ResetSchema,
  async (formData) => {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, formData.email));

    if (!existingUser) {
      throw new Error('User not exist');
    }

    const { token } = await generateResetPasswordToken(existingUser.email);
    await sendResetPasswordEmail(existingUser.email, token);

    return { message: 'Reset password link sent to this email' };
  }
);

export const resetUserPasswordAction = serverAction(
  NewPasswordSchema,
  async (formData) => {
    const [passwordResetToken] = await db
      .select()
      .from(passwordTokens)
      .where(eq(passwordTokens.token, formData.token));

    if (!passwordResetToken) {
      throw new Error('Invalid password token');
    }

    if (isPast(passwordResetToken.expires)) {
      throw new Error('Password reset token expired.');
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, passwordResetToken.identifier));

    if (!user) {
      throw new Error('User not exist');
    }

    const { passwordHashed, salt } = await hashedPassword(formData.password);
    await db.update(users).set({
      passwordHashed,
      passwordSalt: salt,
    });

    return { message: 'User password reset successfully' };
  }
);
