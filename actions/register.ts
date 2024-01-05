'use server';

import { users } from '@/db/schema';
import { db } from '@/db/setup';
import { serverAction } from '@/lib/action';
import { hashedPassword } from '@/lib/auth';
import { RegitserSchema } from '@/schemas';
import { NeonDbError } from '@neondatabase/serverless';
import { getTableColumns } from 'drizzle-orm';

export const registerAction = serverAction(RegitserSchema, async (formData) => {
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

    return newUser;
  } catch (e) {
    if (e instanceof NeonDbError) {
      if (e.code === '23505') {
        throw new Error('Email already in use.');
      }
    }
  }

  throw new Error('An error occurred while registering.');
});
