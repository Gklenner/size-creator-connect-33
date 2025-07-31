import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface NotificationState {
  notifications: Notification[];
}

interface NotificationStore extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(newNotification.id);
    }, 5000);
  },
  
  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),
  
  clearAll: () => set({ notifications: [] }),
}));