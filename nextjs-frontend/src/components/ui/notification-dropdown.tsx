'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Loader2 } from 'lucide-react';
import { pushNotificationService } from '@/lib/push-notifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  sessionId: string;
}

interface NotificationDropdownProps {
  userType: 'doctor' | 'device';
  apiKey?: string;
}

export function NotificationDropdown({ userType, apiKey }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Request notification permission on component mount
    pushNotificationService.requestPermission();
    
    fetchNotifications(1, true);
    // Real-time polling every 3 seconds
    const interval = setInterval(() => {
      fetchNotifications(1, true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (pageNum: number = 1, reset: boolean = false) => {
    setLoading(true);
    try {
      const headers: any = {};
      if (userType === 'device' && apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/${userType}?page=${pageNum}&limit=10`,
        {
          credentials: 'include',
          headers
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newNotifications = data.notifications || [];
        
        if (reset) {
          // Check for new notifications and show browser notification
          const currentNotifications = notifications;
          const newUnreadNotifications = newNotifications.filter((n: Notification) => 
            !n.isRead && !currentNotifications.some(existing => existing._id === n._id)
          );
          
          // Show browser notification for new notifications
          newUnreadNotifications.forEach((notification: Notification) => {
            pushNotificationService.showNotification(notification.title, {
              body: notification.message,
              tag: notification._id,
              data: { sessionId: notification.sessionId }
            });
          });
          
          setNotifications(newNotifications);
        } else {
          setNotifications(prev => [...prev, ...newNotifications]);
        }
        
        setUnreadCount(newNotifications.filter((n: Notification) => !n.isRead).length);
        setHasMore(newNotifications.length === 10);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1, false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs animate-pulse"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-hidden">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No notifications yet
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification._id}
                  className={`p-4 cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-medium truncate ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.sessionId && (
                        <p className="text-xs text-muted-foreground mt-1 opacity-70">
                          Session: {notification.sessionId.slice(-8)}
                        </p>
                      )}
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              
              {hasMore && (
                <DropdownMenuItem
                  className="p-2 text-center cursor-pointer"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : (
                    <span className="text-sm text-primary">Load more</span>
                  )}
                </DropdownMenuItem>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}