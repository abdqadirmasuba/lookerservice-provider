import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing fields', 'Please complete all fields before saving.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Password mismatch', 'New password and confirmation do not match.');
      return;
    }
    Alert.alert('Saved', 'Your password has been updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      <LinearGradient colors={['#F57C1F', '#E06A0F']} className="px-6 pt-4 pb-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeftIcon size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Change Password</Text>
        </View>
        <Text className="text-white/80 text-sm">
          Secure your account by setting a stronger password.
        </Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 shadow-sm space-y-4">
          <View>
            <Text className="text-xs text-gray-400 mb-2">Current Password</Text>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor="#94A3B8"
              className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] px-4 py-3 text-gray-900 dark:text-white"
            />
          </View>
          <View>
            <Text className="text-xs text-gray-400 mb-2">New Password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password"
              placeholderTextColor="#94A3B8"
              className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] px-4 py-3 text-gray-900 dark:text-white"
            />
          </View>
          <View>
            <Text className="text-xs text-gray-400 mb-2">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm new password"
              placeholderTextColor="#94A3B8"
              className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] px-4 py-3 text-gray-900 dark:text-white"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary-500 rounded-2xl py-4 items-center mt-6"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base">Save Password</Text>
        </TouchableOpacity>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
