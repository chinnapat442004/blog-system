'use client';

import { useActionState, useState } from 'react';
import { authenticate } from '@/src/app/actions/auth';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  ToastNotification,
  useToastNotification,
} from '@/src/components/ui/toast-notification';

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  );

  const [showError, setShowError] = useToastNotification(
    errorMessage,
    isPending,
  );

  const [email, setEmail] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm shadow-lg rounded-sm">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-xl">Admin Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={dispatch}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  className="rounded-sm placeholder:text-gray-400"
                  name="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  className="rounded-sm placeholder:text-gray-400"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid gap-2">
                <Button
                  type="submit"
                  className="w-full rounded-sm bg-[#1E293B]"
                  disabled={isPending}
                  onClick={() => {
                    console.log(errorMessage);
                    console.log(showError);
                  }}
                >
                  {isPending ? 'กำลังตรวจสอบข้อมูล...' : 'เข้าสู่ระบบ'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground text-center">
            สำหรับ Admin เท่านั้น
          </p>
        </CardFooter>
      </Card>
      {showError && errorMessage && (
        <ToastNotification
          type="error"
          title="เกิดข้อผิดพลาด"
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
