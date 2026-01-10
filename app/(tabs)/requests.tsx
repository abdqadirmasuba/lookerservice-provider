// File: app/(tabs)/requests.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from 'react-native-heroicons/outline';

type TabType = 'incoming' | 'service-requests';

export default function RequestsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('incoming');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const incomingRequests = [
    {
      id: '1',
      clientName: 'Alice Nambi',
      service: 'Pipe Repair',
      location: 'Kampala, Nakawa',
      date: '2025-01-10',
      time: '10:00 AM',
      description: 'Leaking pipe in kitchen needs urgent repair',
      budget: 150000,
      timestamp: '15 mins ago',
    },
    {
      id: '2',
      clientName: 'Bob Okello',
      service: 'Bathroom Installation',
      location: 'Entebbe',
      date: '2025-01-12',
      time: '2:00 PM',
      description: 'Complete bathroom renovation with modern fixtures',
      budget: 800000,
      timestamp: '1 hour ago',
    },
  ];

  const serviceRequests = [
    {
      id: '1',
      title: 'Water Heater Installation',
      location: 'Kampala, Kololo',
      category: 'Plumbing',
      budget: 500000,
      deadline: '2025-01-15',
      description: 'Need to install new electric water heater in 2-bedroom apartment',
      bidsCount: 12,
      status: 'verified',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      title: 'Commercial Pipe System Overhaul',
      location: 'Jinja',
      category: 'Plumbing',
      budget: 2500000,
      deadline: '2025-01-20',
      description: 'Complete pipe system replacement for 3-story office building',
      bidsCount: 8,
      status: 'verified',
      timestamp: '5 hours ago',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Requests
        </Text>
        <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">
          Manage booking and service requests
        </Text>
      </View>

      {/* Tab Toggle */}
      <View className="px-6 mb-4">
        <View className="flex-row bg-white dark:bg-[#1E293B] rounded-full p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('incoming')}
            className={`flex-1 py-3 rounded-full ${
              activeTab === 'incoming' ? 'bg-primary-500' : ''
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'incoming' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Incoming ({incomingRequests.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('service-requests')}
            className={`flex-1 py-3 rounded-full ${
              activeTab === 'service-requests' ? 'bg-primary-500' : ''
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'service-requests' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Service Requests ({serviceRequests.length})
            </Text>
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
        {activeTab === 'incoming' ? (
          <View className="px-6 pb-6">
            {incomingRequests.map((request) => (
              <TouchableOpacity
                key={request.id}
                onPress={() => router.push(`/(bookings)/request/${request.id}`)}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 shadow-sm"
              >
                {/* Header */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mr-3">
                      <Text className="text-primary-500 font-bold text-lg">
                        {request.clientName.charAt(0)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-gray-900 dark:text-white">
                        {request.clientName}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {request.timestamp}
                      </Text>
                    </View>
                  </View>
                  <View className="px-2 py-1 bg-orange-100 rounded-full">
                    <ClockIcon size={16} color="#F59E0B" />
                  </View>
                </View>

                {/* Service */}
                <Text className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {request.service}
                </Text>

                {/* Description */}
                <Text className="text-sm mb-3 text-gray-600 dark:text-gray-400">
                  {request.description}
                </Text>

                {/* Details */}
                <View className="space-y-2 mb-4">
                  <View className="flex-row items-center">
                    <MapPinIcon size={16} color="#6B7280" />
                    <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                      {request.location}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <CalendarIcon size={16} color="#6B7280" />
                    <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                      {request.date} at {request.time}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <CurrencyDollarIcon size={16} color="#6B7280" />
                    <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                      Budget: {formatCurrency(request.budget)}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => router.push(`/(bookings)/accept?id=${request.id}`)}
                    className="flex-1 bg-primary-500 py-3 rounded-xl flex-row items-center justify-center"
                  >
                    <CheckIcon size={20} color="#FFFFFF" />
                    <Text className="text-white font-bold ml-2">Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push(`/(bookings)/reject?id=${request.id}`)}
                    className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-3 rounded-xl flex-row items-center justify-center"
                  >
                    <XMarkIcon size={20} color="#6B7280" />
                    <Text className="font-bold ml-2 text-gray-600 dark:text-gray-400">
                      Decline
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="px-6 pb-6">
            {serviceRequests.map((request) => (
              <TouchableOpacity
                key={request.id}
                onPress={() => router.push(`/(bids)/${request.id}`)}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 shadow-sm"
              >
                {/* Header */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View className="px-2 py-1 bg-green-100 rounded-full mr-2">
                        <Text className="text-green-600 text-xs font-bold">Verified</Text>
                      </View>
                      <View className="px-2 py-1 bg-blue-100 rounded-full">
                        <Text className="text-blue-600 text-xs font-bold">{request.category}</Text>
                      </View>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-500">
                    {request.timestamp}
                  </Text>
                </View>

                {/* Title */}
                <Text className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  {request.title}
                </Text>

                {/* Description */}
                <Text className="text-sm mb-3 text-gray-600 dark:text-gray-400">
                  {request.description}
                </Text>

                {/* Details */}
                <View className="space-y-2 mb-4">
                  <View className="flex-row items-center">
                    <MapPinIcon size={16} color="#6B7280" />
                    <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                      {request.location}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <CurrencyDollarIcon size={16} color="#6B7280" />
                      <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                        Budget: {formatCurrency(request.budget)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <CalendarIcon size={16} color="#6B7280" />
                      <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                        Due: {request.deadline}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Footer */}
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-200 dark:border-[#334155]">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {request.bidsCount} bids submitted
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push(`/(bids)/submit?requestId=${request.id}`)}
                    className="bg-primary-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-bold text-sm">Submit Bid</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}