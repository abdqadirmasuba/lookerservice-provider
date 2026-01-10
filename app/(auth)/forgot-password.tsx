import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
} from 'react-native-heroicons/outline';
import { useTheme } from '@/src/hooks/useTheme';

type TabType = 'email' | 'phone';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSendReset = async () => {
    if (activeTab === 'email' && !email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (activeTab === 'phone' && !phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    // TODO: Implement forgot password API call
    console.log('Sending reset...', { email, phone });

    // Show success alert
    Alert.alert(
      'Reset Link Sent',
      activeTab === 'email'
        ? `Password reset link has been sent to ${email}`
        : `Verification code has been sent to +256${phone}`,
      [
        {
          text: 'OK',
          onPress: () => {
            if (activeTab === 'email') {
              router.back();
            } else {
              router.push({
                pathname: '/(auth)/verify-phone',
                params: { phone: `+256${phone}`, flow: 'reset' }
              });
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <LinearGradient
          colors={['#F57C1F', '#E06A0F']}
          className="pt-4 pb-16 px-6 rounded-b-[40px]"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-8"
          >
            <ArrowLeftIcon size={24} color="#FFFFFF" />
            <Text className="text-white text-base ml-2 font-medium">Back</Text>
          </TouchableOpacity>

          <View className="items-center">
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
              <LockClosedIcon size={40} color="#FFFFFF" />
            </View>
            <Text className="text-white text-2xl font-bold">Forgot Password?</Text>
            <Text className="text-white/80 text-sm mt-2 text-center px-4">
              Enter your email or phone to reset your password
            </Text>
          </View>
        </LinearGradient>

        {/* Form Section */}
        <View className="px-6 -mt-8 flex-1">
          <View className={`${isDark ? 'bg-dark-card' : 'bg-white'} rounded-3xl p-6 shadow-xl`}>
            
            {/* Tab Toggle */}
            <View className={`flex-row ${isDark ? 'bg-dark-bg' : 'bg-gray-100'} rounded-full p-1 mb-6`}>
              <TouchableOpacity
                onPress={() => setActiveTab('email')}
                className={`flex-1 py-3 rounded-full flex-row items-center justify-center ${
                  activeTab === 'email' ? 'bg-primary-500' : ''
                }`}
              >
                <EnvelopeIcon size={18} color={activeTab === 'email' ? '#FFF' : colors.textSecondary} />
                <Text className={`ml-2 font-semibold ${
                  activeTab === 'email' ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'
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
                <PhoneIcon size={18} color={activeTab === 'phone' ? '#FFF' : colors.textSecondary} />
                <Text className={`ml-2 font-semibold ${
                  activeTab === 'phone' ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email Tab */}
            {activeTab === 'email' && (
              <View>
                <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </Text>
                <View className={`flex-row items-center ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border rounded-xl px-4 mb-4`}>
                  <EnvelopeIcon size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="your@email.com"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`flex-1 py-4 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  />
                </View>

                {/* Info Box */}
                <View className={`flex-row p-4 rounded-xl ${isDark ? 'bg-secondary-900/20 border-secondary-800' : 'bg-secondary-50 border-secondary-200'} border mb-6`}>
                  <InformationCircleIcon size={20} color="#2DA9E9" className="mt-0.5" />
                  <Text className={`flex-1 ml-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    We'll send a password reset link to your email address
                  </Text>
                </View>
              </View>
            )}

            {/* Phone Tab */}
            {activeTab === 'phone' && (
              <View>
                <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone Number
                </Text>
                <View className={`flex-row items-center ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border rounded-xl px-4 mb-4`}>
                  <PhoneIcon size={20} color={colors.textSecondary} />
                  <Text className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium`}>+256</Text>
                  <TextInput
                    placeholder="701 234 567"
                    placeholderTextColor={colors.textSecondary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    className={`flex-1 py-4 ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  />
                </View>

                {/* Info Box */}
                <View className={`flex-row p-4 rounded-xl ${isDark ? 'bg-secondary-900/20 border-secondary-800' : 'bg-secondary-50 border-secondary-200'} border mb-6`}>
                  <InformationCircleIcon size={20} color="#2DA9E9" className="mt-0.5" />
                  <Text className={`flex-1 ml-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    We'll send a verification code to your phone number
                  </Text>
                </View>
              </View>
            )}

            {/* Send Button */}
            <TouchableOpacity onPress={handleSendReset} activeOpacity={0.8}>
              <LinearGradient
                colors={['#F57C1F', '#E06A0F']}
                className="py-4 rounded-full items-center shadow-lg"
              >
                <Text className="text-white font-bold text-base">
                  {activeTab === 'email' ? 'Send Reset Link' : 'Send Code'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Remember Password Link */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Remember your password?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary-500 font-bold text-sm">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}