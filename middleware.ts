import authConfig from './auth.config';
import NextAuth from 'next-auth';

const { auth } = NextAuth(authConfig);
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from './routes';
export default auth((req) => {
  const { nextUrl } = req;
  const userLoggedIn = !!req.auth;
  const apiMemberAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const currentApiPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const currentApiAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (apiMemberAuthRoute) return null;

  if (currentApiAuthRoute) {
    if (userLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
  }

  if (!currentApiPublicRoute && !userLoggedIn) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  return null;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
