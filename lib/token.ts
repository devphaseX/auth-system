import { verificationTokens } from '@/db/schema';
import { db } from '@/db/setup';
import { eq } from 'drizzle-orm';
import { v4 as uuid4 } from 'uuid';
import { addHours } from 'date-fns';

export const generateVerificationToken = async (email: string) => {
  const [existingToken] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.identifier, email));

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, existingToken.identifier));
  }
  const token = uuid4();
  const expires = addHours(new Date(), 1);

  const [activeVerificationToken] = await db
    .insert(verificationTokens)
    .values({ identifier: email, expires, token })
    .returning();

  return activeVerificationToken;
};
