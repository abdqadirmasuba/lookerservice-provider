import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animate logo
    scale.value = withSpring(1, { damping: 10 });
    opacity.value = withTiming(1, { duration: 600 });

    // Check auth and navigate
    const timer = setTimeout(() => {
      // TODO: Check if user is logged in
      const isLoggedIn = false; // Replace with actual auth check
      
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      <StatusBar style="light" />
      
      <Animated.View style={animatedStyle} className="items-center">
        {/* Logo Container */}
        <View className="w-32 h-32 bg-white/20 rounded-3xl items-center justify-center mb-6 backdrop-blur-lg">
          <View className="w-28 h-28 bg-white rounded-2xl items-center justify-center">
            <Text className="text-primary-500 text-5xl font-bold">LS</Text>
          </View>
        </View>

        {/* App Name */}
        <Text className="text-white text-3xl font-bold mb-2">LookerService</Text>
        <Text className="text-white/80 text-lg">Provider</Text>
        <Text className="text-white/60 text-sm mt-2">Grow Your Service Business</Text>
      </Animated.View>

      {/* Loading Indicator */}
      <View className="absolute bottom-20">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-white/60 text-xs mt-4 text-center">v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}