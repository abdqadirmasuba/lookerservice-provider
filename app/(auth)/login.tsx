import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '@/src/store/slices/authSlice';
import { setUser } from '@/src/store/slices/userSlice';
import { REFRESH_TOKEN_KEY } from '@/src/utils/refreshTokenStorage';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from 'react-native-heroicons/outline';
import KeyboardAvoidingWrapper from '@/src/components/common/KeyboardAvoidingWrapper';
import {apiRequests} from '@/src/utils/apiRequest';

type TabType = 'email' | 'phone';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const successMessage = (params.successMessage as string) || '';
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');
    if (activeTab === 'email') {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Please enter a valid email address');
        return;
      }
    }
    if (activeTab === 'phone') {
      if (!phone.trim()) {
        setErrorMessage('Please enter your phone number');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password');
        return;
      }
    }

    dispatch(loginStart());
    setIsLoading(true);
    try {
      const response = await apiRequests.post('/auth/login', {
        email,
        phone,
        password,
      });
      const res = response.data;
      if (res.success && res.data) {
        // Store refresh token in AsyncStorage
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh_token);
        // Store access token and user in Redux
        dispatch(loginSuccess({
          token: res.data.access_token,
          refreshToken: res.data.refresh_token,
          providerBusinesses: res.data.provider_businesses || [],
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
        // Redirect to dashboard
        router.replace('/(tabs)');
      } else {
        const msg = res.message || 'Login failed. Please try again.';
        dispatch(loginFailure(msg));
        setErrorMessage(msg);
      }
    } catch (error: any) {

      const msg = error?.response?.data?.error?.details?.error ?? error?.message ?? 'Login failed. Please try again.';
      dispatch(loginFailure(msg));
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Wrap entire content in KeyboardAvoidingWrapper */}
      <KeyboardAvoidingWrapper>
        {/* Header Section */}
        <LinearGradient
          colors={['#F57C1F', '#E06A0F']}
          className="px-6 pt-8 pb-12 rounded-b-[40px]"
        >
          <View className="items-center mt-4">
            <View className="w-20 h-20 bg-white/20 rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-3xl font-bold">LS</Text>
            </View>
            <Text className="text-white text-2xl font-bold">Provider Login</Text>
            <Text className="text-white/80 text-sm mt-1">Welcome back! Login to continue</Text>
          </View>
        </LinearGradient>

        {/* Form Section */}
        <View className="px-6 -mt-6">
          <View className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 shadow-lg">
            
            {/* Success Badge */}
            {!!successMessage && (
              <View className="flex-row items-center bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                <CheckCircleIcon size={18} color="#10B981" />
                <Text className="text-green-700 text-sm ml-2 flex-1">{successMessage}</Text>
              </View>
            )}

            {/* Error Badge */}
            {!!errorMessage && (
              <View className="flex-row items-start bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <ExclamationCircleIcon size={18} color="#EF4444" />
                <View className="flex-1 ml-2">
                  <Text className="text-red-700 text-sm leading-5">{errorMessage}</Text>
                  <Text className="text-red-500 text-xs mt-1">Need help? Contact support.</Text>
                </View>
              </View>
            )}

            {/* Tab Toggle */}
            <View className="flex-row bg-gray-100 dark:bg-[#0F172A] rounded-full p-1 mb-6">
              <TouchableOpacity
                onPress={() => { setActiveTab('email'); setErrorMessage(''); }}
                className={`flex-1 py-3 rounded-full flex-row items-center justify-center ${
                  activeTab === 'email' ? 'bg-primary-500' : ''
                }`}
              >
                <EnvelopeIcon size={18} color={activeTab === 'email' ? '#FFF' : '#6B7280'} />
                <Text className={`ml-2 font-semibold ${
                  activeTab === 'email' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setActiveTab('phone'); setErrorMessage(''); }}
                className={`flex-1 py-3 rounded-full flex-row items-center justify-center ${
                  activeTab === 'phone' ? 'bg-primary-500' : ''
                }`}
              >
                <PhoneIcon size={18} color={activeTab === 'phone' ? '#FFF' : '#6B7280'} />
                <Text className={`ml-2 font-semibold ${
                  activeTab === 'phone' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email Tab */}
            {activeTab === 'email' && (
              <View>
                <View className="mb-4">
                  <Text className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </Text>
                  <View className="flex-row items-center bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4">
                    <EnvelopeIcon size={20} color="#6B7280" />
                    <TextInput
                      placeholder="your@email.com"
                      placeholderTextColor="#6B7280"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      className="flex-1 py-4 ml-3 text-gray-900 dark:text-white"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Phone Tab */}
            {activeTab === 'phone' && (
              <View>
                <View className="mb-4">
                  <Text className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </Text>
                  <View className="flex-row items-center bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4">
                    <PhoneIcon size={20} color="#6B7280" />
                    <Text className="ml-3 text-gray-600 dark:text-gray-400">+256</Text>
                    <TextInput
                      placeholder="701 234 567"
                      placeholderTextColor="#6B7280"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      className="flex-1 py-4 ml-2 text-gray-900 dark:text-white"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Password Input */}
            <View className="mb-4">
              <Text className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                Password
              </Text>
              <View className="flex-row items-center bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4">
                <LockClosedIcon size={20} color="#6B7280" />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#6B7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  className="flex-1 py-4 ml-3 text-gray-900 dark:text-white"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeSlashIcon size={20} color="#6B7280" />
                  ) : (
                    <EyeIcon size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/forgot-password')}
              className="items-end mb-6"
            >
              <Text className="text-primary-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
              <LinearGradient
                colors={['#F57C1F', '#E06A0F']}
                className="py-4 rounded-full items-center shadow-lg"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-lg">Login</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View className="flex-row items-center justify-center mt-6 mb-8">
            <Text className="text-gray-600 dark:text-gray-400">
              New provider?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary-500 font-bold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
}