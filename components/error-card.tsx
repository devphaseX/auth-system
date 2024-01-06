type Props = {};
import { Header } from '@/components/auth/header';
import { BackButton } from './auth/back-button';
import { Card, CardFooter, CardHeader } from './ui/card';
import { CardWrapper } from './auth/card-wrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
export const ErrorCard = (props: Props) => {
  return (
    <CardWrapper
      headerLabel="Oops!, Something went wrong!"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex items-center justify-center">
        <ExclamationTriangleIcon className="text-destructive w-8 h-8" />
      </div>
    </CardWrapper>
  );
};
