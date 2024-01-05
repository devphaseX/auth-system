import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z
    .string()
    .min(8, { message: 'Password is required to be a minimium 8 characters' }),
});

export const RegitserSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  name: z.string().min(1, { message: 'Name isrequired' }),
  password: z.string().min(8, { message: 'Minimum 8 characters required' }),
});
