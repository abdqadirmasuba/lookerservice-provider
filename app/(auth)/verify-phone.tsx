import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PhoneIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from 'react-native-heroicons/outline';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { useTheme } from '@/src/hooks/useTheme';
import axios from 'axios';
import { config } from '@/src/utils/apiConfig';

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark, colors } = useTheme();
  
  const address = (params.address as string) || '+256701234567';
  const tempToken = useSelector((state: RootState) => state.auth.tempToken);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRefs = useRef<Array<TextInput | null>>([]);

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

  useEffect(() => {
    if (otp.every((digit) => digit !== '') && !isVerifying) {
      handleVerify();
    }
  }, [otp]);

  const handleChangeText = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if digit entered
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit code');
      return;
    }
    if (!tempToken) {
      setErrorMessage('Session expired. Please register again.');
      return;
    }
    setIsVerifying(true);
    setErrorMessage('');
    try {
      const response = await axios.post(
        `${config.domain_url}/auth/verify-otp`,
        { code },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );
      const data = response.data;
      if (data?.success) {
        router.replace({
          pathname: '/(auth)/login',
          params: { successMessage: data.message || 'Your account has been verified. You can now log in.' },
        });
      } else {
        setErrorMessage(data?.message || 'Verification failed. Please try again.');
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        'Verification failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setErrorMessage('');
    // TODO: call resend OTP endpoint when available
    inputRefs.current[0]?.focus();
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 mb-8">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-6"
          >
            <ArrowLeftIcon size={24} color={isDark ? '#FFF' : '#000'} />
            <Text className={`ml-2 text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Back
            </Text>
          </TouchableOpacity>

          <View className="items-center">
            <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
              <PhoneIcon size={40} color="#F57C1F" />
            </View>
            <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Enter Verification Code
            </Text>
            <Text className={`text-center text-sm px-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              We sent a 6-digit code to
            </Text>
            <Text className="text-primary-500 font-bold mt-1">{address}</Text>
          </View>
        </View>

        {/* OTP Input */}
        <View className="px-6">
          {/* Error Badge */}
          {!!errorMessage && (
            <View className={`flex-row items-start rounded-xl px-4 py-3 mb-5 border ${
              isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
            }`}>
              <ExclamationCircleIcon size={18} color="#EF4444" />
              <View className="flex-1 ml-2">
                <Text className={`text-sm leading-5 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                  {errorMessage}
                </Text>
                <Text className={`text-xs mt-1 ${isDark ? 'text-red-400' : 'text-red-500'}`}>
                  Need help? Contact support.
                </Text>
              </View>
            </View>
          )}

          <View className="flex-row justify-between mb-8">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                className={`w-14 h-16 rounded-xl text-center text-2xl font-bold ${
                  digit
                    ? 'bg-primary-50 border-2 border-primary-500'
                    : isDark
                    ? 'bg-dark-card border border-dark-border'
                    : 'bg-gray-100 border border-gray-300'
                } ${isDark ? 'text-white' : 'text-gray-900'}`}
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={isVerifying || otp.some((d) => !d)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isVerifying || otp.some((d) => !d)
                  ? ['#9CA3AF', '#6B7280']
                  : ['#F57C1F', '#E06A0F']
              }
              className="py-4 rounded-full items-center shadow-lg"
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Verify Code
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Resend */}
          <View className="items-center mt-6">
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Didn't receive the code?
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
                {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Change Number */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center mt-8"
          >
            <Text className="text-primary-500 font-bold">Change Phone Number</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}