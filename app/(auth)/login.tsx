import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
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
} from 'react-native-heroicons/outline';
import KeyboardAvoidingWrapper from '@/src/components/common/KeyboardAvoidingWrapper';
import {
  showErrorAlert,
  showValidationError,
  showRequiredFieldAlert,
} from '@/src/utils/alerts';
import {apiRequests} from '@/src/utils/apiRequest';
import axios from 'axios';

type TabType = 'email' | 'phone';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (activeTab === 'email') {
      if (!email.trim()) {
        showRequiredFieldAlert('Email address');
        return;
      }
      if (!password) {
        showRequiredFieldAlert('Password');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showValidationError('Please enter a valid email address');
        return;
      }
    }
    if (activeTab === 'phone') {
      if (!phone.trim()) {
        showRequiredFieldAlert('Phone number');
        return;
      }
      if (!password) {
        showRequiredFieldAlert('Password');
        return;
      }
    }

    dispatch(loginStart());
    try {
      const response = await apiRequests.post('/auth/login', {
        email,
        phone,
        password,
      });
      const res = response.data;
      console.log('Login response:', res);
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
        dispatch(loginFailure(res.message || 'Login failed'));
        showErrorAlert('Login Failed', res.message || 'Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error );
      dispatch(loginFailure(error?.message || 'Login failed'));
      showErrorAlert('Login Failed', 'Invalid credentials. Please try again.');
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
            
            {/* Tab Toggle */}
            <View className="flex-row bg-gray-100 dark:bg-[#0F172A] rounded-full p-1 mb-6">
              <TouchableOpacity
                onPress={() => setActiveTab('email')}
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
                onPress={() => setActiveTab('phone')}
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
            <TouchableOpacity onPress={handleLogin}>
              <LinearGradient
                colors={['#F57C1F', '#E06A0F']}
                className="py-4 rounded-full items-center shadow-lg"
              >
                <Text className="text-white font-bold text-lg">Login</Text>
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