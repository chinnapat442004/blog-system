import { SidebarTrigger } from '@/components/ui/sidebar';

type PageHeaderProps = {
  title: string;
};

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b px-4 bg-[#f8fafc]">
      <SidebarTrigger />

      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}
