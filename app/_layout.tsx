import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import '../global.css';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth-loading" />
        <Stack.Screen name="(onboarding)/intro" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(business)" />
        <Stack.Screen name="(bookings)" />
        <Stack.Screen name="(bids)" />
        <Stack.Screen name="(earnings)" />
        <Stack.Screen name="(messages)" />
        <Stack.Screen name="(services)" />
        <Stack.Screen name="(settings)" />
        <Stack.Screen name="(notifications)" />
        <Stack.Screen name="(service-requests)" />
      </Stack>
    </Provider>
  );
}