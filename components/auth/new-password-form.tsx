'use client';
import { useSearchParams } from 'next/navigation';
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
import { NewPasswordSchema } from '@/schemas';
import type { TypeOf } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { useAction } from 'next-safe-action/hook';
import { resetUserPasswordAction } from '@/actions/reset';
export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const form = useForm<TypeOf<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token ?? '',
    },
  });

  const { execute, result, status, reset } = useAction(resetUserPasswordAction);

  const onSubmitChangePassword = (
    formData: TypeOf<typeof NewPasswordSchema>
  ) => {
    execute(formData);
  };

  const resettingUserPassword = status === 'executing';

  const error =
    result.fetchError ??
    result.serverError ??
    (result.validationError && 'Invalid inputted form data') ??
    ((typeof token === 'undefined' && 'Missing password token') || '');
  const success = result.data?.message ?? '';

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitChangePassword)}
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
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} hidden type="text" className="hidden" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={resettingUserPassword}
                      onFocus={() => reset()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={resettingUserPassword}
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
            disabled={resettingUserPassword}
          >
            Change Password
            {resettingUserPassword && (
              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
