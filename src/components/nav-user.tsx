import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserButton } from '@clerk/clerk-react';

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
          asChild
        >
          <div className='flex items-center gap-2'>
            <UserButton showName={true} appearance={{
              elements: {
                userButtonBox: "flex flex-row-reverse",
                userButtonOuterIdentifier: "font-medium"
              }
            }} />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}