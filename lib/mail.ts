import { headers } from 'next/dist/client/components/headers';
import { env } from '@/env/parsed-env';
import { Resend } from 'resend';
const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  let baseUrl = headers().get('referer') ?? 'http://localhost:3000';
  baseUrl = new URL(baseUrl).origin;
  const confirmLink = `${baseUrl}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  let baseUrl = headers().get('referer') ?? 'http://localhost:3000';
  baseUrl = new URL(baseUrl).origin;
  const confirmLink = `${baseUrl}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${confirmLink}">here</a> to reset your password.</p>`,
  });
};
