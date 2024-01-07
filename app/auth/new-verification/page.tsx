import { CardWrapper } from '@/components/auth/card-wrapper';
import { ClientBeatSpinner } from '@/components/client-loader';
import { users, verificationTokens } from '@/db/schema';
import { db } from '@/db/setup';
import { eq } from 'drizzle-orm';
import { Suspense } from 'react';
import { object, string } from 'zod';
import { isPast } from 'date-fns';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

export const dynamic = 'force-dynamic';
const NewVerificationPage = async ({
  searchParams,
}: {
  searchParams: { token?: string };
}) => {
  const result = object({ token: string().uuid() }).safeParse(searchParams);
  const { token } = searchParams;

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        <Suspense fallback={<ClientBeatSpinner />}>
          <VerificationResult
            token={token!}
            tokenInvalid={result.success === false}
            missingToken={typeof searchParams.token === 'undefined'}
          />
        </Suspense>
      </div>
    </CardWrapper>
  );
};

async function VerificationResult({
  token,
  missingToken,
  tokenInvalid,
}: {
  token?: string;
  tokenInvalid?: boolean;
  missingToken?: boolean;
}) {
  if (token && !tokenInvalid) {
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token));

    if (!verificationToken) {
      return <FormError message="Invalid token" />;
    }

    if (isPast(verificationToken.expires)) {
      return <FormError message="Token has expired" />;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, verificationToken.identifier));

    if (!user) {
      return <FormError message="Not a valid user" />;
    }

    if (user.emailVerified) {
      return <FormError message="User already verified" />;
    }

    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, user.id))
      .returning();

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return <FormSuccess message="Email verification complete" />;
  }

  if (missingToken) {
    return <FormError message="Token is missing" />;
  }

  if (tokenInvalid) {
    return <FormError message="Invalid token " />;
  }
}

export default NewVerificationPage;
