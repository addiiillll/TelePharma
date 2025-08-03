'use client';

import { ReduxProvider } from './redux-provider';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { NotificationHandler } from '@/components/notification-handler';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <NotificationHandler />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}