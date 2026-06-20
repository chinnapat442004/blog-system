'use client';

import { LogOut } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { logoutAction } from '@/app/actions/logout';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <SidebarMenuButton type="submit" className="w-full cursor-pointer">
        <LogOut />
        <span>Logout</span>
      </SidebarMenuButton>
    </form>
  );
}
