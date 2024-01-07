'use client';
import { useRouter } from 'next/navigation';
import { CardWrapper } from './card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ResetSchema } from '@/schemas';
import type { TypeOf } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { useAction } from 'next-safe-action/hook';
import { resetPasswordLinkAction } from '@/actions/reset';
export const ResetForm = () => {
  const form = useForm<TypeOf<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const { execute, result, status, reset } = useAction(resetPasswordLinkAction);

  const onSubmitSignIn = (formData: TypeOf<typeof ResetSchema>) => {
    execute(formData);
  };

  const resetingUserAccount = status === 'executing';

  const error =
    result.fetchError ??
    result.serverError ??
    (result.validationError && 'Invalid inputted form data');
  const success = result.data?.message ?? '';

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitSignIn)}
          className="space-y-6"
          onClick={(event) => {
            if (
              (event.target as HTMLElement).matches('input, button') ||
              (event.target as HTMLElement).closest('input, button')
            ) {
              reset();
            }
          }}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                      disabled={resetingUserAccount}
                      onFocus={() => reset()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={resetingUserAccount}
          >
            Send reset email
            {resetingUserAccount && (
              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
