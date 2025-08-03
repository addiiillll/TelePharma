"use client"

import * as React from "react"
import {
  Users,
  Activity,
  BarChart3,
  Shield,
  Stethoscope,
  Building2,
  Clock
} from "lucide-react"

import { NavMain } from "@/components/admin/dashboard/nav-main"
import { NavUser } from "@/components/admin/dashboard/nav-user"
import { TeamSwitcher } from "@/components/admin/dashboard/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


const adminData = {
  teams: [
    {
      name: "TelePharma",
      logo: Shield,
      plan: "Admin Panel",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin/dashboard",
        }
      ],
    },
    {
      title: "Doctors",
      url: "/admin/dashboard/doctors",
      icon: Stethoscope,
      items: [
        {
          title: "All Doctors",
          url: "/admin/dashboard/doctors",
        }
      ],
    },
    {
      title: "Sessions",
      url: "/admin/dashboard/sessions",
      icon: Activity,
      items: [
        {
          title: "All Sessions",
          url: "/admin/dashboard/sessions",
        }
      ],
    },
    {
      title: "Pharmacies",
      url: "/admin/dashboard/pharmacies",
      icon: Building2,
      items: [
        {
          title: "All Pharmacies",
          url: "/admin/dashboard/pharmacies",
        }
      ],
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [adminUser, setAdminUser] = React.useState({ 
    name: "Admin", 
    email: "admin@telepharma.com", 
    avatar: "/avatars/admin.jpg" 
  });

  React.useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/profile', {
          credentials: 'include'
        });
        if (response.ok) {
          const admin = await response.json();
          setAdminUser({
            name: admin.name || 'Admin',
            email: admin.email,
            avatar: '/avatars/admin.jpg'
          });
        }
      } catch (error) {
        console.error('Failed to fetch admin profile:', error);
      }
    };
    fetchAdminProfile();
  }, []);

  return (
    <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground" suppressHydrationWarning {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={adminData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}