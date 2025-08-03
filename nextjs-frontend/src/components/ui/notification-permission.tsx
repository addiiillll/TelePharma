'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, X, Check } from 'lucide-react';
import { pushNotificationService } from '@/lib/push-notifications';

export function NotificationPermissionBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const currentPermission = pushNotificationService.getPermissionStatus();
    setPermission(currentPermission);
    
    // Show banner if permission is default (not asked yet)
    if (currentPermission === 'default') {
      setShowBanner(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await pushNotificationService.requestPermission();
    setPermission(granted ? 'granted' : 'denied');
    setShowBanner(false);
    
    if (granted) {
      // Test notification
      pushNotificationService.showNotification('Notifications Enabled!', {
        body: 'You will now receive real-time session notifications.',
        icon: '/favicon.ico'
      });
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner || permission !== 'default') {
    return null;
  }

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Bell className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Enable Push Notifications</strong>
          <p className="text-sm mt-1">
            Get instant notifications when patients request consultations or when sessions are updated.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button size="sm" onClick={handleEnableNotifications}>
            <Check className="h-4 w-4 mr-1" />
            Enable
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}