'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

import { FileText, LucideIcon, MessageSquareText } from 'lucide-react';

interface ProjectItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const projects: ProjectItem[] = [
  { name: 'Posts', href: '/admin', icon: FileText },
  { name: 'Comments', href: '/admin/comment', icon: MessageSquareText },
];

export function SidebarLinks() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="px-5">
      {projects.map((project) => {
        const isActive = pathname === project.href;
        const Icon = project.icon;

        return (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild className="h-10">
              <Link
                href={project.href}
                className={`
                  flex items-center gap-2 rounded-md px-3 py-2
                  transition-colors duration-150
                  ${
                    isActive
                      ? 'bg-[#1E293B] text-white pointer-events-none'
                      : 'text-gray-600 hover:bg-slate-800/10 hover:text-slate-900'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{project.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
