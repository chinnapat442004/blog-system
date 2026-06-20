import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // ตรวจสอบสิทธิ์การเข้าหน้าต่างๆ
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    // จัดการข้อมูล JWT Token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    // นำข้อมูล JWT ใส่ไปใน Session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig;
