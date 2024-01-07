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
import { RegisterSchema } from '@/schemas';
import type { TypeOf } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { useAction } from 'next-safe-action/hook';
import { registerAction } from '@/actions/register';
import { useEffect } from 'react';
export const RegisterForm = () => {
  const form = useForm<TypeOf<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { execute, status, result, reset } = useAction(registerAction);

  const onSubmitSignIn = (formData: TypeOf<typeof RegisterSchema>) => {
    execute(formData);
  };

  const signingUser = status === 'executing';
  const error =
    result.fetchError ??
    result.serverError ??
    (result.validationError && 'Invalid inputted form data');
  const success = result?.data?.message ?? null;

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FullName</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ayomide Lawal"
                      disabled={signingUser}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success ?? ''} />
          <Button type="submit" className="w-full" disabled={signingUser}>
            Create an account
            {signingUser && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
