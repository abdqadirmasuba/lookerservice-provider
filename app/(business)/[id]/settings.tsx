// File: app/(business)/[id]/settings.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  ClockIcon,
  TagIcon,
  PencilIcon,
  EyeSlashIcon,
  TrashIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from 'react-native-heroicons/outline';
import { getProviderProfile } from '@/src/utils/business';

export default function BusinessSettingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;

  const [businessName, setBusinessName] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deactivateInput, setDeactivateInput] = useState('');
  const [deleteInput, setDeleteInput] = useState('');

  useEffect(() => {
    getProviderProfile(businessId)
      .then((res) => setBusinessName(res.data?.business_name || ''))
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [businessId]);

  const deactivateMatch = deactivateInput.trim() === businessName.trim() && businessName.trim() !== '';
  const deleteMatch = deleteInput.trim() === businessName.trim() && businessName.trim() !== '';

  const handleDeactivateConfirm = () => {
    setDeactivateModalVisible(false);
    setDeactivateInput('');
    // TODO: call deactivate API endpoint
    Alert.alert('Business Deactivated', 'Your business has been deactivated.');
  };

  const handleDeleteConfirm = () => {
    setDeleteModalVisible(false);
    setDeleteInput('');
    // TODO: call delete API endpoint
    Alert.alert('Business Deleted', 'Your business has been permanently deleted.', [
      { text: 'OK', onPress: () => router.replace('/(business)/list' as any) },
    ]);
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6" style={{ gap: 16 }}>

          {/* Profile */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl px-4 border border-gray-200 dark:border-[#334155]">
            <Text className="text-xs font-bold text-gray-400 uppercase pt-4 pb-2 tracking-wide">
              Profile
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/(business)/${businessId}/edit` as any)}
              className="flex-row items-center py-4"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl items-center justify-center mr-4">
                <PencilIcon size={20} color="#F57C1F" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-white">
                  Edit Profile
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Update business info, description & location
                </Text>
              </View>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Preferences */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl px-4 border border-gray-200 dark:border-[#334155]">
            <Text className="text-xs font-bold text-gray-400 uppercase pt-4 pb-2 tracking-wide">
              Preferences
            </Text>

            <TouchableOpacity
              onPress={() => router.push(`/(business)/${businessId}/edit-hours` as any)}
              className="flex-row items-center py-4 border-b border-gray-100 dark:border-[#334155]"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl items-center justify-center mr-4">
                <ClockIcon size={20} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-white">
                  Business Hours
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Set your weekly availability schedule
                </Text>
              </View>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push(`/(business)/${businessId}/categories` as any)}
              className="flex-row items-center py-4"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl items-center justify-center mr-4">
                <TagIcon size={20} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-white">
                  Manage Categories
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Add or review your service categories
                </Text>
              </View>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl px-4 border-2 border-red-200 dark:border-red-900/40">
            <Text className="text-xs font-bold text-red-500 uppercase pt-4 pb-2 tracking-wide">
              Danger Zone
            </Text>

            <TouchableOpacity
              onPress={() => { setDeactivateInput(''); setDeactivateModalVisible(true); }}
              className="flex-row items-center py-4 border-b border-red-100 dark:border-red-900/30"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl items-center justify-center mr-4">
                <EyeSlashIcon size={20} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-red-600 dark:text-red-400">
                  Deactivate Business
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Hide your business from clients temporarily
                </Text>
              </View>
              <ChevronRightIcon size={20} color="#EF4444" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setDeleteInput(''); setDeleteModalVisible(true); }}
              className="flex-row items-center py-4"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl items-center justify-center mr-4">
                <TrashIcon size={20} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-red-600 dark:text-red-400">
                  Delete Business
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Permanently remove this business and all data
                </Text>
              </View>
              <ChevronRightIcon size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Deactivate Confirmation Modal */}
      <Modal
        visible={deactivateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeactivateModalVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
          <View className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full">
            <View className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl items-center justify-center mb-4">
              <ExclamationTriangleIcon size={24} color="#D97706" />
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Deactivate Business
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your business will be hidden from clients. You can reactivate it at any time.{'\n\n'}
              Type{' '}
              <Text className="font-bold text-gray-900 dark:text-white">
                {loadingProfile ? 'your business name' : `"${businessName}"`}
              </Text>{' '}
              to confirm:
            </Text>
            <TextInput
              value={deactivateInput}
              onChangeText={setDeactivateInput}
              placeholder="Type business name here"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm mb-5"
            />
            <View className="flex-row" style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => setDeactivateModalVisible(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#0F172A] items-center"
              >
                <Text className="font-semibold text-gray-700 dark:text-gray-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeactivateConfirm}
                disabled={!deactivateMatch}
                style={{ opacity: deactivateMatch ? 1 : 0.4 }}
                className="flex-1 py-3 rounded-xl bg-amber-500 items-center"
              >
                <Text className="font-semibold text-white">Deactivate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
          <View className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full">
            <View className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl items-center justify-center mb-4">
              <TrashIcon size={24} color="#EF4444" />
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Business
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will permanently delete your business and all associated data. This action{' '}
              <Text className="font-bold text-red-600 dark:text-red-400">cannot be undone</Text>.{'\n\n'}
              Type{' '}
              <Text className="font-bold text-gray-900 dark:text-white">
                {loadingProfile ? 'your business name' : `"${businessName}"`}
              </Text>{' '}
              to confirm:
            </Text>
            <TextInput
              value={deleteInput}
              onChangeText={setDeleteInput}
              placeholder="Type business name here"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm mb-5"
            />
            <View className="flex-row" style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#0F172A] items-center"
              >
                <Text className="font-semibold text-gray-700 dark:text-gray-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteConfirm}
                disabled={!deleteMatch}
                style={{ opacity: deleteMatch ? 1 : 0.4 }}
                className="flex-1 py-3 rounded-xl bg-red-600 items-center"
              >
                <Text className="font-semibold text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
