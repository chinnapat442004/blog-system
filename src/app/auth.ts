import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { prisma } from '@/prisma/index';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        //   Zod ตรวจสอบรูปแบบข้อมูลเบื้องต้น
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          //  ส่ง user ไปทำ JWT ต่อ
          return {
            id: String(user.id),
            email: user.email,
            name: user.username,
          };
        }

        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
