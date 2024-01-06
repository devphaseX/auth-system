'use client';

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
import { LoginSchema } from '@/schemas';
import type { TypeOf } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { useAction } from 'next-safe-action/hook';
import { loginAction } from '@/actions/login';
import { useEffect } from 'react';
export const LoginForm = () => {
  const form = useForm<TypeOf<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { execute, status, result, reset } = useAction(loginAction);

  const onSubmitSignIn = (formData: TypeOf<typeof LoginSchema>) => {
    reset();
    execute(formData);
  };

  const signingUser = status === 'executing';

  const error =
    result.fetchError ??
    result.serverError ??
    (result.validationError && 'Invalid inputted form data');
  const success = result.data || '';
  const errorOnSignIn = status === 'hasErrored';

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Dont't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitSignIn)}
          className="space-y-6"
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
                      disabled={signingUser}
                      onFocus={() => reset()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      disabled={signingUser}
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
          <Button type="submit" className="w-full" disabled={signingUser}>
            Login
            {signingUser && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
