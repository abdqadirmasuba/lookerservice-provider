import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import '../global.css';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Provider>
  );
}