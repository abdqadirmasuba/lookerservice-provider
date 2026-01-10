import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from 'react-native-heroicons/outline';
import { useTheme } from '@/src/hooks/useTheme';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark, colors } = useTheme();
  const email = params.email as string || 'your@email.com';
  
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResend = async () => {
    if (!canResend) return;

    // TODO: Implement resend verification email
    console.log('Resending verification email to:', email);
    
    setResendTimer(60);
    setCanResend(false);
    
    Alert.alert('Email Sent', 'Verification email has been resent');
  };

  const handleOpenEmail = () => {
    // Open default email app
    Alert.alert('Open Email', 'Opening your email app...');
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View className="flex-1 px-6 justify-center">
        {/* Icon */}
        <View className="items-center mb-8">
          <View className="w-32 h-32 bg-primary-100 rounded-full items-center justify-center mb-6">
            <EnvelopeIcon size={64} color="#F57C1F" />
            <View className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full items-center justify-center border-4 border-white">
              <CheckCircleIcon size={24} color="#FFFFFF" />
            </View>
          </View>

          <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Verify Your Email
          </Text>
          <Text className={`text-center text-sm px-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            We've sent a verification link to
          </Text>
          <Text className="text-primary-500 font-bold mt-2">{email}</Text>
        </View>

        {/* Instructions */}
        <View className={`${isDark ? 'bg-dark-card' : 'bg-gray-50'} rounded-2xl p-6 mb-6`}>
          <Text className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Next Steps:
          </Text>
          <View className="space-y-3">
            <StepItem
              number="1"
              text="Check your email inbox"
              isDark={isDark}
            />
            <StepItem
              number="2"
              text="Click the verification link in the email"
              isDark={isDark}
            />
            <StepItem
              number="3"
              text="You'll be redirected to login"
              isDark={isDark}
            />
          </View>
        </View>

        {/* Open Email Button */}
        <TouchableOpacity onPress={handleOpenEmail} activeOpacity={0.8}>
          <LinearGradient
            colors={['#F57C1F', '#E06A0F']}
            className="py-4 rounded-full items-center shadow-lg mb-4"
          >
            <Text className="text-white font-bold text-base">Open Email App</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Resend Link */}
        <View className="items-center">
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            Didn't receive the email?
          </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend}
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <ArrowPathIcon
              size={16}
              color={canResend ? '#F57C1F' : colors.textSecondary}
            />
            <Text
              className={`ml-2 font-bold ${
                canResend ? 'text-primary-500' : isDark ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              {canResend ? 'Resend Email' : `Resend in ${resendTimer}s`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back to Login */}
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          className="items-center mt-8"
        >
          <Text className="text-primary-500 font-bold">Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper Component
function StepItem({ number, text, isDark }: { number: string; text: string; isDark: boolean }) {
  return (
    <View className="flex-row items-center">
      <View className="w-6 h-6 bg-primary-500 rounded-full items-center justify-center mr-3">
        <Text className="text-white text-xs font-bold">{number}</Text>
      </View>
      <Text className={`flex-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {text}
      </Text>
    </View>
  );
}