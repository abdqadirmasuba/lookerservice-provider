import { useState } from 'react';

export function usePushNotifications() {
  const [expoPushToken] = useState('');
  return { expoPushToken, notification: undefined };
}
