import { auth, signOut } from '@/src/app/auth';

export default async function AdminDashboard() {
  // ดึง Session current user จาก Server
  const session = await auth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">หน้า Admin</h1>
      <p className="mb-4">
        <span className="font-semibold">{session?.user?.email}</span>
      </p>

      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/login' });
        }}
      >
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          ออกจากระบบ
        </button>
      </form>
    </div>
  );
}
