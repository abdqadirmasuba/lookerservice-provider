// File: app/(tabs)/requests.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { apiRequests } from '@/src/utils/apiRequest';
import { showErrorAlert } from '@/src/utils/alerts';
import { ServiceRequest } from '@/src/types/serviceRequest';
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
  const [isLoading, setIsLoading] = useState(false);
  const [directRequests, setDirectRequests] = useState<ServiceRequest[]>([]);
  
  const activeBusinessId = useSelector((state: RootState) => state.auth.activeBusinessId);

  useEffect(() => {
    if (activeBusinessId && activeTab === 'incoming') {
      fetchDirectRequests();
    }
  }, [activeBusinessId, activeTab]);

  const fetchDirectRequests = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequests.get(
        `/provider/${activeBusinessId}/service-requests/direct`
      );
      if (response.data.success) {
        setDirectRequests(response.data.data);
      } else {
        showErrorAlert('Error', response.data.message || 'Failed to fetch service requests');
      }
    } catch (error: any) {
      console.error('Service requests fetch error:', error);
      showErrorAlert('Error', 'Failed to fetch service requests');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for service requests tab (to be implemented later)
  const serviceRequests: any[] = [];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (activeBusinessId && activeTab === 'incoming') {
      fetchDirectRequests().finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  }, [activeBusinessId, activeTab]);

  const formatCurrency = (amount: number) => {
    return `UGX ${amount?.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
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
              Direct Requests ({directRequests.length})
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
              Open Requests (0)
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
            {isLoading ? (
              <View className="py-10 items-center">
                <ActivityIndicator size="large" color="#F57C1F" />
              </View>
            ) : directRequests.length === 0 ? (
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center">
                <Text className="text-gray-500 dark:text-gray-400 text-center">
                  No direct service requests yet
                </Text>
              </View>
            ) : (
              directRequests.map((request) => (
                <TouchableOpacity
                  key={request.id}
                  onPress={() => router.push(`/(service-requests)/${request.id}`)}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 shadow-sm"
                >
                  {/* Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mr-3">
                        <Text className="text-primary-500 font-bold text-lg">
                          {request.client_name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-gray-900 dark:text-white">
                          {request.client_name}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {getTimeAgo(request.created_at)}
                        </Text>
                      </View>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${
                      request.provider_response.provider_response_type === 'pending'
                        ? 'bg-orange-100'
                        : request.provider_response.provider_response_type === 'accepted'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}>
                      {request.provider_response.provider_response_type === 'pending' ? (
                        <ClockIcon size={16} color="#F59E0B" />
                      ) : request.provider_response.provider_response_type === 'accepted' ? (
                        <CheckIcon size={16} color="#10B981" />
                      ) : (
                        <XMarkIcon size={16} color="#EF4444" />
                      )}
                    </View>
                  </View>

                  {/* Request Number */}
                  <Text className="text-xs text-gray-500 mb-2">
                    {request.request_number}
                  </Text>

                  {/* Services */}
                  <View className="mb-3">
                    {request.services.map((service, index) => (
                      <View key={service.id} className="flex-row items-center mb-1">
                        <View className="w-2 h-2 bg-primary-500 rounded-full mr-2" />
                        <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                          {service.service_name}
                        </Text>
                        <Text className="text-xs text-gray-500 ml-2">
                          ({service.category_name})
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Description */}
                  <Text className="text-sm mb-3 text-gray-600 dark:text-gray-400" numberOfLines={2}>
                    {request.description}
                  </Text>

                  {/* Details */}
                  <View className="space-y-2 mb-4">
                    <View className="flex-row items-center">
                      <MapPinIcon size={16} color="#6B7280" />
                      <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                        {request.address}, {request.city}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <CalendarIcon size={16} color="#6B7280" />
                      <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                        {formatDate(request.preferred_date)} at {formatTime(request.preferred_date)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <CurrencyDollarIcon size={16} color="#6B7280" />
                      <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                        Budget: {formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}
                      </Text>
                    </View>
                  </View>

                  {/* Status Message */}
                  {request.provider_response.provider_response_type !== 'pending' && (
                    <View className={`px-3 py-2 rounded-lg ${
                      request.provider_response.provider_response_type === 'accepted'
                        ? 'bg-green-50'
                        : 'bg-red-50'
                    }`}>
                      <Text className={`text-sm font-medium ${
                        request.provider_response.provider_response_type === 'accepted'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {request.provider_response.provider_response_type === 'accepted'
                          ? 'You accepted this request'
                          : 'You rejected this request'}
                      </Text>
                      {request.response_message && (
                        <Text className="text-sm text-gray-600 mt-1">
                          {request.response_message}
                        </Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          <View className="px-6 pb-6">
            {serviceRequests.length === 0 ? (
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center">
                <Text className="text-gray-500 dark:text-gray-400 text-center">
                  No open service requests available
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-center text-sm mt-2">
                  Open requests will appear here
                </Text>
              </View>
            ) : (
              serviceRequests.map((request) => (
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
            ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}