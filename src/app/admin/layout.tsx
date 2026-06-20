import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/common/Sidebar';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Blog Admin',
  description: 'Blog Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
