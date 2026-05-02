import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon as CheckCircleSolid } from 'react-native-heroicons/solid';
import { useTheme } from '@/src/hooks/useTheme';
import { useDispatch } from 'react-redux';
import { setTempToken } from '@/src/store/slices/authSlice';
import { apiRequests } from '@/src/utils/apiRequest';
import KeyboardAvoidingWrapper from '@/src/components/common/KeyboardAvoidingWrapper';
import Svg, { Path, Circle } from 'react-native-svg';

function SplashLogo() {
  return (
    <Svg width={38} height={52} viewBox="0 0 377 513" fill="none">
      <Path d="M376 478.507C376 497.561 291.83 513.007 188 513.007C84.1705 513.007 0 497.561 0 478.507C0 459.453 84.1705 444.007 188 444.007C291.83 444.007 376 459.453 376 478.507Z" fill="rgba(255,255,255,0.25)" />
      <Path d="M366.5 252.007C376.329 222.112 378.543 189.386 373.258 158.331C368.014 127.507 357.5 98.0068 337 73.0068C317 48.5068 292.434 28.6768 264 16.0068C235.566 3.33685 204.063 -1.89016 173.107 0.60645C142.15 3.10306 112.284 13.3431 86.179 30.4115C60.0735 47.48 38.541 70.8454 23.5052 98.42C8.46949 125.995 0.384451 156.994 0 188.507C0.48558 238.581 10 259.007 20 279.007L80 234.007L78 229.007L76 223.007L75 219.007L74 215.507L73.5 212.507L72 204.507L71.5 199.507L71 189.507L72.5 172.507L76 157.507L80 145.007L82 140.007L86 132.007L89 127.007L93 121.007L96 117.007L102 110.007L106 106.007L109 103.007L116 97.0068L123 92.0068L131 87.0068L139 83.0068L143 81.0068L151 78.0068L158 76.0068L167 74.0068L173 73.0068L186 72.0068H189L203 73.0068L209 74.0068L214 75.0068L218 76.0068L227 79.0068L230 80.0068L235 82.0068L243 86.0068L250 90.0068L253 92.0068L260 97.0068L266 102.007L270 106.007L272 108.007L273 109.007L275 111.007L280 117.007L288 129.007L292 136.007L296 145.007L298 150.007L300 156.007L302.5 166.507L304 175.007L304.5 180.007L305 190.007L304.5 199.007L304 203.007L303 209.007L302 215.007L299.5 224.507L366.5 252.007Z" fill="white" />
      <Circle cx="188" cy="189.007" r="70" stroke="white" strokeWidth="35" />
      <Path d="M296 234.507L363 262.007L360 270.007L356 279.007L350 291.007L342 306.007L335.5 317.007L325 333.007L320 340.007L310 353.507L296 371.007L286.5 382.007L277 392.507L261 410.007L237 434.007L234 437.007L224.5 446.007L216 454.007L210 459.507L205 464.007L196 472.007L188 479.007L180 472.007L171 464.007L160 454.007L146 441.007L143 438.007L126.5 422.007L112 407.007L102.5 397.007L91 384.007L80 371.007L71 360.007L64 351.007L56 340.007L51.5 334.007L112.5 279.007L116 282.007L120 285.007L123 287.007L126 289.007L131 292.007L137 295.007L141 297.007L156 302.507L162 304.007L173 306.007L186 307.007H190L202 306.007L209 305.007L214 304.007L221 302.007L226 300.507L235 297.007L241.5 294.007L247 291.007L250 289.007L256 285.007L260 282.007L266 277.007L276 267.007L280 262.007L283 258.007L290 247.007L296 234.507Z" fill="white" />
      <Path d="M17.6056 311.178C13.2837 305.445 14.4278 297.294 20.161 292.972L83.2449 245.417L104.915 274.164L41.8314 321.719C36.0982 326.041 27.947 324.897 23.6251 319.163L17.6056 311.178Z" fill="white" />
    </Svg>
  );
}

type TabType = 'email' | 'phone';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return '#EF4444'; // red
    if (passwordStrength <= 3) return '#F59E0B'; // orange
    return '#10B981'; // green
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const getStrengthWidth = () => {
    return `${(passwordStrength / 5) * 100}%`;
  };

  const handleRegister = async () => {
    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (activeTab === 'email' && !email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (activeTab === 'phone' && !phone.trim()) {
      setErrorMessage('Please enter your phone number');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      setErrorMessage('Please use a stronger password with at least 3 requirements met');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please agree to Terms & Conditions and Privacy Policy');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const payload: Record<string, string> = {
        full_name: fullName,
        password,
        role: 'provider',
      };
      if (activeTab === 'email') {
        payload.email = email.trim();
      } else {
        payload.phone = `+256${phone.trim()}`;
      }

      const response = await apiRequests.post('/auth/register', payload);
      const { data } = response;

      if (data?.success) {
        const channel: string = data.data?.channel ?? activeTab;
        const address: string = data.data?.address ?? (activeTab === 'email' ? email : `+256${phone}`);
        const token: string = data.data?.temp_token ?? '';
        dispatch(setTempToken(token));
        if (channel === 'email') {
          router.push({ pathname: '/(auth)/verify-email', params: { address } });
        } else {
          router.push({ pathname: '/(auth)/verify-phone', params: { address, channel } });
        }
      } else {
        setErrorMessage(data?.message ?? 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        'Registration failed. Please check your connection and try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
    <KeyboardAvoidingWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header */}
          <LinearGradient
            colors={['#F57C1F', '#E06A0F']}
            className="pt-4 pb-12 px-6 rounded-b-[40px]"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center mb-6"
            >
              <ArrowLeftIcon size={24} color="#FFFFFF" />
              <Text className="text-white text-base ml-2 font-medium">Back</Text>
            </TouchableOpacity>

            <View className="items-center mt-2">
              <View className="items-center justify-center mb-3">
                <SplashLogo />
              </View>
              <Text className="text-white text-2xl font-bold">Join as Provider</Text>
              <Text className="text-white/80 text-sm mt-1">Create account to get started</Text>
            </View>
          </LinearGradient>

          {/* Form Section */}
          <View className="px-6 -mt-6 pb-8">
            <View className={`${isDark ? 'bg-dark-card' : 'bg-white'} rounded-3xl p-6 shadow-xl`}>
              
              {/* Error Badge */}
              {!!errorMessage && (
                <View className={`flex-row items-start rounded-xl px-4 py-3 mb-4 border ${
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

              {/* Tab Toggle */}
              <View className={`flex-row ${isDark ? 'bg-dark-bg' : 'bg-gray-100'} rounded-full p-1 mb-6`}>
                <TouchableOpacity
                  onPress={() => { setActiveTab('email'); setErrorMessage(''); }}
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
                  onPress={() => { setActiveTab('phone'); setErrorMessage(''); }}
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

              {/* Full Name */}
              <View className="mb-4">
                <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </Text>
                <View className={`flex-row items-center ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border rounded-xl px-4`}>
                  <UserIcon size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="John Doe"
                    placeholderTextColor={colors.textSecondary}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    className={`flex-1 py-4 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  />
                </View>
              </View>

              {/* Email/Phone */}
              {activeTab === 'email' ? (
                <View className="mb-4">
                  <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address
                  </Text>
                  <View className={`flex-row items-center ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border rounded-xl px-4`}>
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
                </View>
              ) : (
                <View className="mb-4">
                  <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number
                  </Text>
                  <View className={`flex-row items-center ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border rounded-xl px-4`}>
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
                </View>
              )}

              {/* Password */}
              <View className="mb-4">
                <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </Text>
                <View className={`flex-row items-center ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border rounded-xl px-4`}>
                  <LockClosedIcon size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Create a strong password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    className={`flex-1 py-4 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeSlashIcon size={20} color={colors.textSecondary} />
                    ) : (
                      <EyeIcon size={20} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <View className="mt-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Password Strength
                      </Text>
                      <Text className="text-xs font-bold" style={{ color: getStrengthColor() }}>
                        {getStrengthText()}
                      </Text>
                    </View>
                    
                    {/* Strength Bar */}
                    <View className={`h-2 ${isDark ? 'bg-dark-bg' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <View
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: getStrengthWidth() as unknown as any,
                          backgroundColor: getStrengthColor(),
                        }}
                      />
                    </View>

                    {/* Requirements Checklist */}
                    <View className="mt-3 space-y-2">
                      <RequirementItem 
                        met={password.length >= 8} 
                        text="At least 8 characters" 
                        isDark={isDark} 
                      />
                      <RequirementItem 
                        met={/[A-Z]/.test(password)} 
                        text="One uppercase letter" 
                        isDark={isDark} 
                      />
                      <RequirementItem 
                        met={/[a-z]/.test(password)} 
                        text="One lowercase letter" 
                        isDark={isDark} 
                      />
                      <RequirementItem 
                        met={/[0-9]/.test(password)} 
                        text="One number" 
                        isDark={isDark} 
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm Password
                </Text>
                <View className={`flex-row items-center ${
                  confirmPassword && password !== confirmPassword 
                    ? 'border-red-500' 
                    : isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'
                } border rounded-xl px-4`}>
                  <LockClosedIcon size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Re-enter your password"
                    placeholderTextColor={colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    className={`flex-1 py-4 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <EyeSlashIcon size={20} color={colors.textSecondary} />
                    ) : (
                      <EyeIcon size={20} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <View className="flex-row items-center mt-2">
                    <View className="w-1 h-1 rounded-full bg-red-500 mr-2" />
                    <Text className="text-red-500 text-xs">Passwords do not match</Text>
                  </View>
                )}
                {confirmPassword.length > 0 && password === confirmPassword && (
                  <View className="flex-row items-center mt-2">
                    <CheckCircleSolid size={14} color="#10B981" />
                    <Text className="text-green-500 text-xs ml-1">Passwords match</Text>
                  </View>
                )}
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                className="flex-row items-start mb-6"
                activeOpacity={0.7}
              >
                <View className="mr-3 mt-0.5">
                  {agreedToTerms ? (
                    <CheckCircleSolid size={24} color="#F57C1F" />
                  ) : (
                    <View className={`w-6 h-6 rounded-full border-2 ${
                      isDark ? 'border-gray-600' : 'border-gray-300'
                    }`} />
                  )}
                </View>
                <Text className={`flex-1 text-sm leading-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  I agree to the{' '}
                  <Text className="text-primary-500 font-semibold">Terms & Conditions</Text>
                  {' '}and{' '}
                  <Text className="text-primary-500 font-semibold">Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading || !agreedToTerms || passwordStrength < 3 || password !== confirmPassword}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    !isLoading && agreedToTerms && passwordStrength >= 3 && password === confirmPassword
                      ? ['#F57C1F', '#E06A0F']
                      : ['#9CA3AF', '#6B7280']
                  }
                  className="py-4 rounded-full items-center shadow-lg"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-bold text-base">Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="flex-row items-center justify-center mt-6">
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary-500 font-bold text-sm">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
}

// Helper Component for Password Requirements
function RequirementItem({ met, text, isDark }: { met: boolean; text: string; isDark: boolean }) {
  return (
    <View className="flex-row items-center py-1">
      {met ? (
        <CheckCircleSolid size={16} color="#10B981" />
      ) : (
        <View className={`w-4 h-4 rounded-full border-2 ${
          isDark ? 'border-gray-600' : 'border-gray-300'
        }`} />
      )}
      <Text className={`ml-2 text-xs ${
        met ? 'text-green-500 font-medium' : isDark ? 'text-gray-500' : 'text-gray-400'
      }`}>
        {text}
      </Text>
    </View>
  );
}