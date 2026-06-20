import { auth } from '@/app/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { User } from 'lucide-react';
import { SidebarLinks } from './SidebarLinks';
import { LogoutButton } from './LogoutButton';

export const AppSidebar = async () => {
  const session = await auth();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-3 py-2 border-b">
          <h1 className="text-lg font-bold">Blog Admin</h1>
          <p className="text-xs text-muted-foreground">Management System</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarLinks />
      </SidebarContent>

      <SidebarFooter>
        <div className="mt-3 flex items-center gap-2 px-3 py-2 border-t">
          <User className="h-4 w-4" />
          <div className="text-sm">
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
