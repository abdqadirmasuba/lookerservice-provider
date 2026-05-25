import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { apiRequests } from './apiRequest';

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    if (!projectId) {
      console.warn('Expo push project ID not found in app config');
      return null;
    }

    const pushTokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
    return pushTokenResponse.data;
  } catch (error) {
    console.error('Failed to register for push notifications:', error);
    return null;
  }
}

export async function registerInstallationPushToken(
  installationId: string,
  appType = 'provider',
): Promise<void> {
  if (!installationId) {
    return;
  }

  try {
    const token = await registerForPushNotificationsAsync();
    if (!token) {
      console.warn('Push token not available; skipping installation push-token patch.');
      return;
    }

    console.log('Expo push token fetched:', token);

    await apiRequests.patch(`/installations/${installationId}/push-tokens`, {
      push_token: token,
      app_type: appType,
    });
  } catch (error) {
    console.error('Push token registration failed:', error);
  }
}
