import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon as CheckCircleSolid } from 'react-native-heroicons/solid';
import { useTheme } from '@/src/hooks/useTheme';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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
    setNewPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return '#EF4444';
    if (passwordStrength <= 3) return '#F59E0B';
    return '#10B981';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      Alert.alert('Weak Password', 'Please use a stronger password');
      return;
    }

    // TODO: Implement password reset API
    console.log('Resetting password...');

    Alert.alert(
      'Success',
      'Your password has been reset successfully!',
      [
        {
          text: 'Login',
          onPress: () => router.replace('/(auth)/login'),
        },
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <LinearGradient
            colors={['#F57C1F', '#E06A0F']}
            className="pt-8 pb-16 px-6 rounded-b-[40px]"
          >
            <View className="items-center mt-4">
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                <LockClosedIcon size={40} color="#FFFFFF" />
              </View>
              <Text className="text-white text-2xl font-bold">Reset Password</Text>
              <Text className="text-white/80 text-sm mt-1">Create a new strong password</Text>
            </View>
          </LinearGradient>

          {/* Form Section */}
          <View className="px-6 -mt-8">
            <View className={`${isDark ? 'bg-dark-card' : 'bg-white'} rounded-3xl p-6 shadow-xl`}>
              
              {/* New Password */}
              <View className="mb-4">
                <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Password
                </Text>
                <View className={`flex-row items-center ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border rounded-xl px-4`}>
                  <LockClosedIcon size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Enter new password"
                    placeholderTextColor={colors.textSecondary}
                    value={newPassword}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showNewPassword}
                    className={`flex-1 py-4 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? (
                      <EyeSlashIcon size={20} color={colors.textSecondary} />
                    ) : (
                      <EyeIcon size={20} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Password Strength */}
                {newPassword.length > 0 && (
                  <View className="mt-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Password Strength
                      </Text>
                      <Text className="text-xs font-bold" style={{ color: getStrengthColor() }}>
                        {getStrengthText()}
                      </Text>
                    </View>
                    
                    <View className={`h-2 ${isDark ? 'bg-dark-bg' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: getStrengthColor(),
                        }}
                      />
                    </View>

                    <View className="mt-3 space-y-2">
                      <RequirementItem met={newPassword.length >= 8} text="At least 8 characters" isDark={isDark} />
                      <RequirementItem met={/[A-Z]/.test(newPassword)} text="One uppercase letter" isDark={isDark} />
                      <RequirementItem met={/[a-z]/.test(newPassword)} text="One lowercase letter" isDark={isDark} />
                      <RequirementItem met={/[0-9]/.test(newPassword)} text="One number" isDark={isDark} />
                    </View>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm New Password
                </Text>
                <View className={`flex-row items-center ${
                  confirmPassword && newPassword !== confirmPassword 
                    ? 'border-red-500' 
                    : isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'
                } border rounded-xl px-4`}>
                  <LockClosedIcon size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Re-enter new password"
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
                {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                  <Text className="text-red-500 text-xs mt-2">Passwords do not match</Text>
                )}
                {confirmPassword.length > 0 && newPassword === confirmPassword && (
                  <View className="flex-row items-center mt-2">
                    <CheckCircleSolid size={14} color="#10B981" />
                    <Text className="text-green-500 text-xs ml-1">Passwords match</Text>
                  </View>
                )}
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={passwordStrength < 3 || newPassword !== confirmPassword}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    passwordStrength >= 3 && newPassword === confirmPassword
                      ? ['#F57C1F', '#E06A0F']
                      : ['#9CA3AF', '#6B7280']
                  }
                  className="py-4 rounded-full items-center shadow-lg"
                >
                  <Text className="text-white font-bold text-base">Reset Password</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Helper Component
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