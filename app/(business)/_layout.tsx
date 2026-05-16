import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function BusinessLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
        },
      }}
    >
      <Stack.Screen name="list" />
      <Stack.Screen name="register/step1" />
      <Stack.Screen name="register/step2" />
      <Stack.Screen name="register/step3" />
      <Stack.Screen name="register/step4" />
      <Stack.Screen name="[id]/profile" />
      <Stack.Screen name="[id]/edit" />
      <Stack.Screen name="[id]/services" />
      <Stack.Screen name="[id]/analytics" />
      <Stack.Screen name="[id]/settings" />
    </Stack>
  );
}