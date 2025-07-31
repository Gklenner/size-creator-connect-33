import React from 'react';
import { Toaster } from 'sonner';
import { useNotificationStore } from '@/shared/store/notificationStore';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications } = useNotificationStore();

  React.useEffect(() => {
    // Auto-display notifications
    notifications.forEach((notification) => {
      // TODO: Implement toast display logic if needed
      // The sonner toaster should handle this automatically
    });
  }, [notifications]);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
    </>
  );
};