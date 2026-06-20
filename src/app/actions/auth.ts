'use server';

import { signIn } from '@/src/app/auth';
import { AuthError } from 'next-auth';

// จะถูกเรียกใช้งานจากฟอร์มหน้า Login
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // login ผ่าน Credentials provider ที่เราตั้งไว้ (username password)
    await signIn('credentials', {
      redirectTo: '/admin',
      ...Object.fromEntries(formData),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
        default:
          return 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      }
    }
    throw error;
  }
}
