// File: app/(business)/list.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  ClockIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from 'react-native-heroicons/outline';

export default function BusinessListScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const businesses = [
    {
      id: '1',
      name: 'Doe Plumbing Services',
      category: 'Plumbing',
      location: 'Kampala, Uganda',
      status: 'active',
      rating: 4.8,
      totalBookings: 127,
      servicesCount: 12,
      image: null,
      verifiedAt: '2024-12-01',
    },
    {
      id: '2',
      name: 'Emergency Repairs Ltd',
      category: 'Repairs',
      location: 'Entebbe, Uganda',
      status: 'pending',
      rating: 0,
      totalBookings: 0,
      servicesCount: 5,
      image: null,
      submittedAt: '2025-01-08',
    },
    {
      id: '3',
      name: 'Quick Fix Solutions',
      category: 'Maintenance',
      location: 'Jinja, Uganda',
      status: 'suspended',
      rating: 4.2,
      totalBookings: 45,
      servicesCount: 8,
      image: null,
      suspendedReason: 'Pending commission payment',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-green-100 dark:bg-green-900/20',
          text: 'text-green-600 dark:text-green-400',
          icon: <CheckBadgeIcon size={14} color="#10B981" />,
          label: 'Active',
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/20',
          text: 'text-yellow-600 dark:text-yellow-400',
          icon: <ClockIcon size={14} color="#F59E0B" />,
          label: 'Pending Approval',
        };
      case 'suspended':
        return {
          bg: 'bg-red-100 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          icon: <ExclamationTriangleIcon size={14} color="#EF4444" />,
          label: 'Suspended',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-600 dark:text-gray-400',
          icon: null,
          label: status,
        };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4"
            >
              <ArrowLeftIcon size={24} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                My Businesses
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {businesses.length} registered
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(business)/register/step1')}
            className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center"
          >
            <PlusCircleIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
        className="flex-1"
      >
        <View className="px-6 py-6">
          {businesses.map((business) => {
            const statusBadge = getStatusBadge(business.status);
            
            return (
              <TouchableOpacity
                key={business.id}
                onPress={() => router.push(`/(business)/${business.id}/profile`)}
                className="bg-white dark:bg-[#1E293B] rounded-2xl mb-4 shadow-sm overflow-hidden"
              >
                {/* Business Header */}
                <View className="p-4">
                  <View className="flex-row items-start mb-3">
                    {/* Business Image/Icon */}
                    <View className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-xl items-center justify-center mr-4">
                      {business.image ? (
                        <Image source={{ uri: business.image }} className="w-full h-full rounded-xl" />
                      ) : (
                        <BuildingStorefrontIcon size={32} color="#F57C1F" />
                      )}
                    </View>

                    {/* Business Info */}
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between mb-1">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white flex-1 mr-2">
                          {business.name}
                        </Text>
                        <View className={`${statusBadge.bg} px-2 py-1 rounded-full flex-row items-center`}>
                          {statusBadge.icon}
                          <Text className={`${statusBadge.text} text-xs font-bold ml-1`}>
                            {statusBadge.label}
                          </Text>
                        </View>
                      </View>
                      
                      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {business.category}
                      </Text>

                      <View className="flex-row items-center">
                        <MapPinIcon size={14} color="#6B7280" />
                        <Text className="text-xs text-gray-500 ml-1">
                          {business.location}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Stats */}
                  {business.status === 'active' && (
                    <View className="flex-row items-center justify-around py-3 bg-gray-50 dark:bg-[#0F172A] rounded-xl">
                      <View className="items-center">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">
                          {business.rating}
                        </Text>
                        <Text className="text-xs text-gray-500">Rating</Text>
                      </View>
                      <View className="w-px h-8 bg-gray-300 dark:bg-[#334155]" />
                      <View className="items-center">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">
                          {business.totalBookings}
                        </Text>
                        <Text className="text-xs text-gray-500">Bookings</Text>
                      </View>
                      <View className="w-px h-8 bg-gray-300 dark:bg-[#334155]" />
                      <View className="items-center">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">
                          {business.servicesCount}
                        </Text>
                        <Text className="text-xs text-gray-500">Services</Text>
                      </View>
                    </View>
                  )}

                  {/* Pending Notice */}
                  {business.status === 'pending' && (
                    <View className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl">
                      <Text className="text-yellow-700 dark:text-yellow-400 text-sm">
                        Your business is under review. You'll be notified once approved.
                      </Text>
                      <Text className="text-yellow-600 dark:text-yellow-500 text-xs mt-1">
                        Submitted on {business.submittedAt}
                      </Text>
                    </View>
                  )}

                  {/* Suspended Notice */}
                  {business.status === 'suspended' && (
                    <View className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl">
                      <Text className="text-red-700 dark:text-red-400 text-sm font-semibold">
                        Business Suspended
                      </Text>
                      <Text className="text-red-600 dark:text-red-500 text-xs mt-1">
                        {business.suspendedReason}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Quick Actions */}
                {business.status === 'active' && (
                  <View className="flex-row border-t border-gray-200 dark:border-[#334155]">
                    <TouchableOpacity
                      onPress={() => router.push(`/(business)/${business.id}/analytics`)}
                      className="flex-1 flex-row items-center justify-center py-3 border-r border-gray-200 dark:border-[#334155]"
                    >
                      <ChartBarIcon size={18} color="#6B7280" />
                      <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">Analytics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push(`/(business)/${business.id}/settings`)}
                      className="flex-1 flex-row items-center justify-center py-3"
                    >
                      <Cog6ToothIcon size={18} color="#6B7280" />
                      <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">Settings</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Empty State */}
          {businesses.length === 0 && (
            <View className="items-center justify-center py-20">
              <View className="w-24 h-24 bg-gray-100 dark:bg-[#1E293B] rounded-full items-center justify-center mb-4">
                <BuildingStorefrontIcon size={48} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No Businesses Yet
              </Text>
              <Text className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6 px-8">
                Register your first business to start receiving bookings
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(business)/register/step1')}
                className="bg-primary-500 px-6 py-3 rounded-xl flex-row items-center"
              >
                <PlusCircleIcon size={20} color="#FFFFFF" />
                <Text className="text-white font-bold ml-2">Register Business</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}