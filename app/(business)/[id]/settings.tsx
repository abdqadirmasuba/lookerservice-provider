// File: app/(business)/[id]/settings.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ShieldCheckIcon,
  ClockIcon,
  PhotoIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/outline';

export default function BusinessSettingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAcceptBookings, setAutoAcceptBookings] = useState(false);
  const [isBusinessVisible, setIsBusinessVisible] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleDeleteBusiness = () => {
    Alert.alert(
      'Delete Business',
      'Are you sure you want to delete this business? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Delete business API call
            Alert.alert('Success', 'Business deleted successfully', [
              {
                text: 'OK',
                onPress: () => router.replace('/(business)/list'),
              },
            ]);
          },
        },
      ]
    );
  };

  const handleDeactivateBusiness = () => {
    Alert.alert(
      'Deactivate Business',
      'Your business will be hidden from clients. You can reactivate it anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => {
            setIsBusinessVisible(false);
            Alert.alert('Success', 'Business deactivated successfully');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeftIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Business Settings
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6">
          {/* Visibility */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Visibility
            </Text>

            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                {isBusinessVisible ? (
                  <EyeIcon size={24} color="#10B981" />
                ) : (
                  <EyeSlashIcon size={24} color="#EF4444" />
                )}
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-900 dark:text-white">
                    Business Visibility
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {isBusinessVisible ? 'Visible to clients' : 'Hidden from clients'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isBusinessVisible}
                onValueChange={setIsBusinessVisible}
                trackColor={{ false: '#D1D5DB', true: '#F57C1F' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Booking Preferences */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Booking Preferences
            </Text>

            <View className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-[#334155]">
              <View className="flex-row items-center flex-1">
                <ShieldCheckIcon size={24} color="#2DA9E9" />
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-900 dark:text-white">
                    Auto-Accept Bookings
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Automatically accept all booking requests
                  </Text>
                </View>
              </View>
              <Switch
                value={autoAcceptBookings}
                onValueChange={setAutoAcceptBookings}
                trackColor={{ false: '#D1D5DB', true: '#F57C1F' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <ClockIcon size={24} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-900 dark:text-white">
                    Business Hours
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Set your availability schedule
                  </Text>
                </View>
              </View>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Notifications
            </Text>

            <View className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-[#334155]">
              <View className="flex-row items-center flex-1">
                <BellIcon size={24} color="#F57C1F" />
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-900 dark:text-white">
                    Push Notifications
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Receive notifications in the app
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#F57C1F' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-[#334155]">
              <View className="flex-1">
                <Text className="font-bold text-gray-900 dark:text-white">
                  Email Notifications
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  Receive notifications via email
                </Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#D1D5DB', true: '#F57C1F' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row items-center justify-between py-3">
              <View className="flex-1">
                <Text className="font-bold text-gray-900 dark:text-white">
                  SMS Notifications
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  Receive notifications via SMS
                </Text>
              </View>
              <Switch
                value={smsNotifications}
                onValueChange={setSmsNotifications}
                trackColor={{ false: '#D1D5DB', true: '#F57C1F' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Media */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Media
            </Text>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <PhotoIcon size={24} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-900 dark:text-white">
                    Manage Photos
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Add, edit, or remove business photos
                  </Text>
                </View>
              </View>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border-2 border-red-200 dark:border-red-900/30">
            <Text className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
              Danger Zone
            </Text>

            <TouchableOpacity
              onPress={handleDeactivateBusiness}
              className="flex-row items-center py-3 border-b border-red-200 dark:border-red-900/30"
            >
              <EyeSlashIcon size={24} color="#EF4444" />
              <View className="ml-3 flex-1">
                <Text className="font-bold text-red-600 dark:text-red-400">
                  Deactivate Business
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  Hide your business from clients temporarily
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteBusiness}
              className="flex-row items-center py-3"
            >
              <TrashIcon size={24} color="#EF4444" />
              <View className="ml-3 flex-1">
                <Text className="font-bold text-red-600 dark:text-red-400">
                  Delete Business
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  Permanently delete this business
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <Text className="text-blue-700 dark:text-blue-400 text-sm">
              💡 Need help with settings? Contact our support team for assistance.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}