// File: app/(business)/switch-business.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store';
import { setActiveBusiness } from '@/src/store/slices/authSlice';
import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon as CheckCircleSolid } from 'react-native-heroicons/solid';
import apiRequests from '@/src/utils/apiRequest';
import { showErrorAlert, showSuccessAlert } from '@/src/utils/alerts';

export default function SwitchBusinessScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  
  const providerBusinesses = useSelector((state: RootState) => state.auth.providerBusinesses);
  const activeBusinessId = useSelector((state: RootState) => state.auth.activeBusinessId);
  const userId = useSelector((state: RootState) => state.user.user?.id);

  const handleSwitchBusiness = async (businessId: string) => {
    if (businessId === activeBusinessId) {
      router.back();
      return;
    }

    setSwitchingId(businessId);
    setIsLoading(true);

    try {
      const response = await apiRequests.post(`/provider/businesses/${businessId}/switch`);
      
      if (response.data.success) {
        // Update Redux state
        dispatch(setActiveBusiness(businessId));
        showSuccessAlert('Success', 'Business switched successfully');
        router.back();
      } else {
        showErrorAlert('Error', response.data.message || 'Failed to switch business');
      }
    } catch (error: any) {
      console.error('Switch business error:', error);
      showErrorAlert('Error', 'Failed to switch business. Please try again.');
    } finally {
      setIsLoading(false);
      setSwitchingId(null);
    }
  };

  const getActiveBusiness = () => {
    return providerBusinesses.find(b => b.id === activeBusinessId);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <LinearGradient
        colors={['#F57C1F', '#E06A0F']}
        className="px-6 pt-4 pb-6"
      >
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
          >
            <ArrowLeftIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Switch Business</Text>
            <Text className="text-white/80 text-sm mt-1">Select which business to manage</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6">
          {/* Current Business Card */}
          <View className="mb-6">
            <Text className="text-xs font-bold mb-3 text-gray-500 dark:text-gray-400 uppercase">
              Active Business
            </Text>
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 shadow-sm border-2 border-primary-500">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center mr-4">
                  <BuildingStorefrontIcon size={24} color="#F57C1F" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base text-gray-900 dark:text-white mb-1">
                    {getActiveBusiness()?.business_name || 'No business selected'}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Currently managing
                  </Text>
                </View>
                <CheckCircleSolid size={28} color="#F57C1F" />
              </View>
            </View>
          </View>

          {/* Available Businesses */}
          {providerBusinesses.filter(b => b.id !== activeBusinessId).length > 0 && (
            <>
              <Text className="text-xs font-bold mb-3 text-gray-500 dark:text-gray-400 uppercase">
                Available Businesses ({providerBusinesses.filter(b => b.id !== activeBusinessId).length})
              </Text>
              <View className="space-y-3">
                {providerBusinesses
                  .filter(b => b.id !== activeBusinessId)
                  .map((business) => (
                    <TouchableOpacity
                      key={business.id}
                      onPress={() => handleSwitchBusiness(business.id)}
                      disabled={isLoading}
                      className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 shadow-sm active:scale-98"
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full items-center justify-center mr-4">
                          <BuildingStorefrontIcon size={24} color="#9CA3AF" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-base text-gray-900 dark:text-white mb-1">
                            {business.business_name}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            Tap to switch
                          </Text>
                        </View>
                        {switchingId === business.id && isLoading ? (
                          <ActivityIndicator size="small" color="#F57C1F" />
                        ) : (
                          <CheckCircleIcon size={28} color="#D1D5DB" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </>
          )}

          {/* Info Card */}
          <View className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
            <Text className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Quick Tip
            </Text>
            <Text className="text-xs text-blue-700 dark:text-blue-200">
              Switching businesses will update the dashboard and all data to reflect the selected business. 
              You can switch between businesses anytime from here or the dashboard.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
