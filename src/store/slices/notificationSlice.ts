import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationData {
  client_id?: string;
  request_id?: string;
  provider_id?: string;
  request_number?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  source: string;
  source_id: string;
  title: string;
  message: string;
  data: NotificationData;
  is_read: boolean;
  created_at: string;
}

interface NotificationState {
  unreadCount: number;
  notifications: Notification[];
  isLoading: boolean;
  expoPushToken: string | null;
}

const initialState: NotificationState = {
  unreadCount: 0,
  notifications: [],
  isLoading: false,
  expoPushToken: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    markOneRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.is_read) {
        notif.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead: (state) => {
      state.notifications.forEach((n) => {
        n.is_read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.is_read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearAll: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setExpoPushToken: (state, action: PayloadAction<string | null>) => {
      state.expoPushToken = action.payload;
    },
  },
});

export const {
  setUnreadCount,
  setNotifications,
  setLoading,
  markOneRead,
  markAllRead,
  removeNotification,
  clearAll,
  setExpoPushToken,
} = notificationSlice.actions;

export default notificationSlice.reducer;
