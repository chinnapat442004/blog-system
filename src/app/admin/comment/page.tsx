import { PageHeader } from '@/components/common/PageHeader';

export default async function AdminDashboard() {
  return (
    <div>
      <PageHeader title="จัดการ Comment " />
      <main className="p-4">
        <h1 className="text-3xl font-bold mb-4">หน้า Comment</h1>
      </main>
    </div>
  );
}
