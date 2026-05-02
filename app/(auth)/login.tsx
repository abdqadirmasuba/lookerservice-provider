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
import { registerDeviceToken } from '@/src/utils/pushNotifications';
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
import Svg, { Path, Circle } from 'react-native-svg';

function SplashLogo() {
  return (
    <Svg width={44} height={60} viewBox="0 0 377 513" fill="none">
      <Path d="M376 478.507C376 497.561 291.83 513.007 188 513.007C84.1705 513.007 0 497.561 0 478.507C0 459.453 84.1705 444.007 188 444.007C291.83 444.007 376 459.453 376 478.507Z" fill="rgba(255,255,255,0.25)" />
      <Path d="M366.5 252.007C376.329 222.112 378.543 189.386 373.258 158.331C368.014 127.507 357.5 98.0068 337 73.0068C317 48.5068 292.434 28.6768 264 16.0068C235.566 3.33685 204.063 -1.89016 173.107 0.60645C142.15 3.10306 112.284 13.3431 86.179 30.4115C60.0735 47.48 38.541 70.8454 23.5052 98.42C8.46949 125.995 0.384451 156.994 0 188.507C0.48558 238.581 10 259.007 20 279.007L80 234.007L78 229.007L76 223.007L75 219.007L74 215.507L73.5 212.507L72 204.507L71.5 199.507L71 189.507L72.5 172.507L76 157.507L80 145.007L82 140.007L86 132.007L89 127.007L93 121.007L96 117.007L102 110.007L106 106.007L109 103.007L116 97.0068L123 92.0068L131 87.0068L139 83.0068L143 81.0068L151 78.0068L158 76.0068L167 74.0068L173 73.0068L186 72.0068H189L203 73.0068L209 74.0068L214 75.0068L218 76.0068L227 79.0068L230 80.0068L235 82.0068L243 86.0068L250 90.0068L253 92.0068L260 97.0068L266 102.007L270 106.007L272 108.007L273 109.007L275 111.007L280 117.007L288 129.007L292 136.007L296 145.007L298 150.007L300 156.007L302.5 166.507L304 175.007L304.5 180.007L305 190.007L304.5 199.007L304 203.007L303 209.007L302 215.007L299.5 224.507L366.5 252.007Z" fill="white" />
      <Circle cx="188" cy="189.007" r="70" stroke="white" strokeWidth="35" />
      <Path d="M296 234.507L363 262.007L360 270.007L356 279.007L350 291.007L342 306.007L335.5 317.007L325 333.007L320 340.007L310 353.507L296 371.007L286.5 382.007L277 392.507L261 410.007L237 434.007L234 437.007L224.5 446.007L216 454.007L210 459.507L205 464.007L196 472.007L188 479.007L180 472.007L171 464.007L160 454.007L146 441.007L143 438.007L126.5 422.007L112 407.007L102.5 397.007L91 384.007L80 371.007L71 360.007L64 351.007L56 340.007L51.5 334.007L112.5 279.007L116 282.007L120 285.007L123 287.007L126 289.007L131 292.007L137 295.007L141 297.007L156 302.507L162 304.007L173 306.007L186 307.007H190L202 306.007L209 305.007L214 304.007L221 302.007L226 300.507L235 297.007L241.5 294.007L247 291.007L250 289.007L256 285.007L260 282.007L266 277.007L276 267.007L280 262.007L283 258.007L290 247.007L296 234.507Z" fill="white" />
      <Path d="M17.6056 311.178C13.2837 305.445 14.4278 297.294 20.161 292.972L83.2449 245.417L104.915 274.164L41.8314 321.719C36.0982 326.041 27.947 324.897 23.6251 319.163L17.6056 311.178Z" fill="white" />
    </Svg>
  );
}

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
            <View className="items-center justify-center mb-4">
              <SplashLogo />
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