'use client';

import { AppSidebar } from '@/components/admin/dashboard/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const pageName = segments[segments.length - 1];
    
    switch (pageName) {
      case 'dashboard': return 'Overview';
      case 'doctors': return 'Doctors';
      case 'sessions': return 'Sessions';
      case 'pharmacies': return 'Pharmacies';
      default: return 'Dashboard';
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset suppressHydrationWarning>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12" suppressHydrationWarning>
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" suppressHydrationWarning />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumbs()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}