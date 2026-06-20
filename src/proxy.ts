import NextAuth from 'next-auth';
import { authConfig } from '@/app/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const pathname = req.nextUrl.pathname;

  const isLoginPage = pathname === '/login';
  const isAdminPage = pathname.startsWith('/admin');

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (!isLoggedIn && isAdminPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
