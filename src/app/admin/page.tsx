import { PageHeader } from '@/components/common/PageHeader';

export default async function AdminDashboard() {
  return (
    <>
      <PageHeader title="จัดการ Blog " />
      <main className="p-4">
        <h1 className="text-3xl font-bold mb-4">หน้า Admin</h1>
      </main>
    </>
  );
}
