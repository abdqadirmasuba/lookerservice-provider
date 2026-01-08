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
import { EnvelopeIcon, PhoneIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useTheme } from '@/src/hooks/useTheme';


type TabType = 'email' | 'phone';

export default function LoginScreen() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // TODO: Implement login logic
    if (activeTab === 'email' && (!email || !password)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (activeTab === 'phone' && (!phone || !password)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simulate login
    console.log('Logging in...', { email, phone, password });
    // router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-dark-bg' : 'bg-white'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerClassName="flex-grow"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <LinearGradient
            colors={['#F57C1F', '#E06A0F']}
            className="pt-8 pb-12 px-6 rounded-b-[40px]"
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
            <View className={`${isDark ? 'bg-dark-card' : 'bg-white'} rounded-3xl p-6 shadow-lg`}>
              
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
                  {/* Email Input */}
                  <View className="mb-4">
                    <Text className={`mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                </View>
              )}

              {/* Phone Tab */}
              {activeTab === 'phone' && (
                <View>
                  {/* Phone Input */}
                  <View className="mb-4">
                    <Text className={`mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </Text>
                    <View className={`flex-row items-center ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border rounded-xl px-4`}>
                      <PhoneIcon size={20} color={colors.textSecondary} />
                      <Text className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>+256</Text>
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
                </View>
              )}

              {/* Password Input */}
              <View className="mb-4">
                <Text className={`mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </Text>
                <View className={`flex-row items-center ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border rounded-xl px-4`}>
                  <LockClosedIcon size={20} color={colors.textSecondary} />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
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
              <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                New provider?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text className="text-primary-500 font-bold">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}