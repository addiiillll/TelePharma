'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeviceRegistration } from '@/components/doctor/device-registration';
import { SessionManagement } from '@/components/doctor/session-management';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { logout } from '@/lib/redux/slices/authSlice';
import { useLogoutDoctorMutation } from '@/lib/redux/slices/apiSlice';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, doctor } = useSelector((state: RootState) => state.auth);
  const [logoutDoctor] = useLogoutDoctorMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logoutDoctor({}).unwrap();
    } catch (error) {
      // Handle error if needed
    } finally {
      dispatch(logout());
      router.push('/login');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome, Dr. {doctor?.name}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions">
          <SessionManagement />
        </TabsContent>
        
        <TabsContent value="devices">
          <DeviceRegistration />
        </TabsContent>
      </Tabs>
    </div>
  );
}