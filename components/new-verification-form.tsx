import { useSearchParams } from 'next/navigation';
import { CardWrapper } from './auth/card-wrapper';
import { BeatLoader } from 'react-spinners';
// import { useCallback, useEffect } from 'react';

export const NewVerificationForm = async ({}: {
  searchParams: { token?: string };
}) => {
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        <BeatLoader />
      </div>
    </CardWrapper>
  );
};
