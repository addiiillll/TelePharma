'use client';

export class PushNotificationService {
  private static instance: PushNotificationService;
  private permission: NotificationPermission = 'default';

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    
    return permission === 'granted';
  }

  async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    const hasPermission = await this.requestPermission();
    
    if (!hasPermission) {
      console.warn('Notification permission denied');
      return;
    }

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return new Promise((resolve) => {
      notification.onshow = () => resolve();
      notification.onerror = () => resolve();
    });
  }

  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }
}

export const pushNotificationService = PushNotificationService.getInstance();