// File: app/auth-loading.tsx

import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '@/src/store/slices/authSlice';
import { setUser } from '@/src/store/slices/userSlice';
import { REFRESH_TOKEN_KEY } from '@/src/utils/refreshTokenStorage';
import { registerDeviceToken } from '@/src/utils/pushNotifications';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const ONBOARDING_KEY = '@hasSeenOnboarding';
import { config } from '@/src/utils/apiConfig';
const API_BASE_URL = config.domain_url;

export default function AuthLoadingScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const logoScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.94, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    checkAuthStatus();
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const checkAuthStatus = async () => {
    try {
      // Step 1: Check if user has seen onboarding
      const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);      
      if (!hasSeenOnboarding) {
        // First time user - show onboarding
        setTimeout(() => {
          router.replace('/(onboarding)/intro');
        }, 10000); // Small delay for splash effect
        return;
      }

      // Step 2: Check for refresh token
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 1000);
        return;
      }
      // Step 3: Try to refresh authentication
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });
      if (!response.ok) {
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 500);
        return;
      }
      const res = await response.json();
      if (!res.success || !res.data) {
        throw new Error('Invalid response structure');
      }
      // Step 4: Update AsyncStorage with new refresh token
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh_token);
      // Step 5: Update Redux with access token and user data
      dispatch(loginSuccess({
        token: res.data.access_token,
        refreshToken: res.data.refresh_token,
        providerBusinesses: res.data.provider_businesses || [],
      }));
      registerDeviceToken(res.data.access_token); // fire-and-forget
      dispatch(setUser({
        id: res.data.user.id,
        fullName: res.data.user.full_name,
        email: res.data.user.email,
        phone: res.data.user.phone,
        profileImage: res.data.user.profile_picture_url ?? undefined,
        isEmailVerified: res.data.user.email_verified,
        isPhoneVerified: res.data.user.phone_verified,
        createdAt: res.data.user.created_at,
      }));
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
      
    } catch (error: any) {
      console.error('Auth check failed:', error);
      dispatch(loginFailure(error?.message || 'Auth check failed'));
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 500);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-500 items-center justify-center">
      <StatusBar style="light" />
      <Animated.View style={logoStyle}>
        <Image
          source={require('../assets/splash-icon.png')}
          style={{ width: 160, height: 160 }}
          resizeMode="contain"
        />
      </Animated.View>
    </SafeAreaView>
  );
}