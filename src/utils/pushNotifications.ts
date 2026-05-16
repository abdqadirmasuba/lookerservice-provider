import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { config } from './apiConfig';
import api from './apiRequest';

export function handleRegistrationError(errorMessage: string): never {
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    handleRegistrationError('Must use a physical device for push notifications');
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted to get push token for push notification!');
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    handleRegistrationError('Project ID not found');
  }

  const pushTokenString = (
    await Notifications.getExpoPushTokenAsync({ projectId })
  ).data;

  return pushTokenString;
}

export async function sendPushNotification(expoPushToken: string): Promise<void> {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function registerDeviceToken(accessToken: string): Promise<void> {
  try {
    const token = await registerForPushNotificationsAsync();
    if (!token) return;

    console.log('Expo Push Token:', token);

    const body = {
      token,
      device_name: Device.deviceName ?? 'Unknown Device',
      app_version: Constants.expoConfig?.version ?? 'unknown',
    };

    // Use the axios instance so the request interceptor automatically injects
    // both the Authorization and X-Installation-ID headers.
    await api.post('/notifications/device-token', body);
  } catch {
    // Fail silently — token registration is best-effort
  }
}
