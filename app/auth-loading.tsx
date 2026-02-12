// File: app/auth-loading.tsx

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '@/src/store/slices/authSlice';
import { setUser } from '@/src/store/slices/userSlice';
import { REFRESH_TOKEN_KEY } from '@/src/utils/refreshTokenStorage';

import { LinearGradient } from 'expo-linear-gradient';

const ONBOARDING_KEY = '@hasSeenOnboarding';
import { config } from '@/src/utils/apiConfig';
const API_BASE_URL = config.domain_url;

export default function AuthLoadingScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuthStatus();
  }, []);

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
      }));
      dispatch(setUser({
        id: res.data.user.id,
        fullName: res.data.user.full_name,
        email: res.data.user.email,
        phone: res.data.user.phone,
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
    <LinearGradient
      colors={['#F57C1F', '#E06A0F']}
      className="flex-1 items-center justify-center"
    >
      <View className="items-center">
        {/* Logo */}
        <View className="w-32 h-32 bg-white/20 rounded-3xl items-center justify-center mb-6">
          <Text className="text-white text-5xl font-bold">LS</Text>
        </View>

        {/* App Name */}
        <Text className="text-white text-3xl font-bold mb-2">LookerService</Text>
        <Text className="text-white/80 text-lg mb-8">Provider</Text>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-white/60 text-sm mt-4">Loading...</Text>
      </View>
    </LinearGradient>
  );
}