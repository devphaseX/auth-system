'use server';

import bcrypt from 'bcryptjs';
import { users } from '@/db/schema';

export async function hashedPassword(password: string, saltRound = 10) {
  const salt = bcrypt.genSaltSync(saltRound);

  const passwordHashed = await bcrypt.hash(password, salt);

  return {
    salt,
    passwordHashed,
  };
}

export const confirmPassword = async (
  user: typeof users.$inferSelect,
  enteredPassword: string
) => {
  if (!user.passwordHashed) {
    throw new TypeError('Missing hashedPassword field');
  }

  return bcrypt.compare(user.passwordHashed, enteredPassword);
};
