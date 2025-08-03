'use client';
import { useEffect } from 'react';
import { pushNotificationService } from '@/lib/push-notifications';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Request notification permission as soon as the app loads
    const requestPermission = async () => {
      const permission = pushNotificationService.getPermissionStatus();
      
      if (permission === 'default') {
        // Auto-request permission on app load
        await pushNotificationService.requestPermission();
      }
    };

    requestPermission();
  }, []);

  return <>{children}</>;
}