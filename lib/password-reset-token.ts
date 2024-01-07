import { passwordTokens, verificationTokens } from '@/db/schema';
import { db } from '@/db/setup';
import { eq } from 'drizzle-orm';
import { v4 as uuid4 } from 'uuid';
import { addHours } from 'date-fns';

export const generateResetPasswordToken = async (email: string) => {
  const [existingToken] = await db
    .select()
    .from(passwordTokens)
    .where(eq(passwordTokens.identifier, email));

  if (existingToken) {
    await db
      .delete(passwordTokens)
      .where(eq(passwordTokens.identifier, existingToken.identifier));
  }
  const token = uuid4();
  const expires = addHours(new Date(), 1);

  const [resetPasswordToken] = await db
    .insert(passwordTokens)
    .values({ identifier: email, expires, token })
    .returning();

  return resetPasswordToken;
};
