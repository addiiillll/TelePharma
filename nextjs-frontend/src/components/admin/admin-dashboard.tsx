'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, Activity, Smartphone, BarChart3 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DashboardChart } from '@/components/admin/dashboard-chart';

interface DashboardData {
  stats: {
    onlineDoctors: number;
    activeSessions: number;
    activeDevices: number;
    totalSessions: number;
    completedSessions: number;
  };
  onlineDoctors: Array<{
    name: string;
    specialization: string;
    isAvailable: boolean;
  }>;
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminApi.getDashboard();

      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminApi.logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online Doctors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.onlineDoctors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.activeSessions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.activeDevices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalSessions}</div>
            </CardContent>
          </Card>
        </div>

        <DashboardChart />

        <Card>
          <CardHeader>
            <CardTitle>Online Doctors</CardTitle>
            <CardDescription>Currently available doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.onlineDoctors.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    doctor.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doctor.isAvailable ? 'Available' : 'Busy'}
                  </div>
                </div>
              ))}
              {data.onlineDoctors.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No doctors currently online</p>
              )}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}