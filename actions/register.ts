'use server';

import { users } from '@/db/schema';
import { db } from '@/db/setup';
import { serverAction } from '@/lib/action';
import { hashedPassword } from '@/lib/auth';
import { sendResetPasswordEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/token';
import { RegisterSchema } from '@/schemas';
import { NeonDbError } from '@neondatabase/serverless';
import { getTableColumns } from 'drizzle-orm';

export const registerAction = serverAction(RegisterSchema, async (formData) => {
  try {
    const { email, name, password } = formData;
    const { passwordHashed, salt } = await hashedPassword(password);

    const {
      passwordHashed: _1,
      passwordSalt: _2,
      ...publicInfo
    } = getTableColumns(users);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHashed,
        passwordSalt: salt,
      })
      .returning({
        ...publicInfo,
      });

    const verificationToken = await generateVerificationToken(newUser.email);
    await sendResetPasswordEmail(
      verificationToken.identifier,
      verificationToken.token
    );
    return { message: 'Confirmation email sent' };
  } catch (e) {
    console.log({ e });
    if (e instanceof NeonDbError) {
      if (e.code === '23505') {
        throw new Error('Email already in use.');
      }
    }
  }

  throw new Error('An error occurred while registering.');
});
