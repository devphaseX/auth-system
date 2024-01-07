import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z
    .string()
    .min(8, { message: 'Password is required to be a minimium 8 characters' }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  name: z.string().min(1, { message: 'Name isrequired' }),
  password: z.string().min(8, { message: 'Minimum 8 characters required' }),
});

export const NewPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, { message: 'Minimum 8 characters required' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Minimum 8 characters required' }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Password not same',
    path: ['confirmPassword'],
  });
