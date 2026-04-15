import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900 px-6">
      <Text className="text-6xl font-bold text-orange-500 mb-4">404</Text>
      <Text className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
        Page Not Found
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-center mb-8">
        The page you are looking for does not exist.
      </Text>
      <TouchableOpacity
        onPress={() => router.replace('/')}
        className="bg-orange-500 px-8 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold text-base">Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}
