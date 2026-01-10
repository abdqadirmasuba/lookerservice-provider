// File: app/(tabs)/bookings.tsx

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
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
} from 'react-native-heroicons/outline';

type TabType = 'all' | 'active' | 'completed' | 'cancelled';

export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const bookings = {
    all: 12,
    active: [
      {
        id: '1',
        clientName: 'Alice Nambi',
        service: 'Pipe Repair',
        location: 'Kampala, Nakawa',
        date: '2025-01-10',
        time: '10:00 AM',
        amount: 150000,
        status: 'in-progress',
        startedAt: '9:30 AM',
      },
      {
        id: '2',
        clientName: 'Bob Okello',
        service: 'Bathroom Installation',
        location: 'Entebbe',
        date: '2025-01-12',
        time: '2:00 PM',
        amount: 800000,
        status: 'accepted',
        acceptedAt: '1 hour ago',
      },
    ],
    completed: [
      {
        id: '3',
        clientName: 'Carol Atim',
        service: 'Water Heater Fix',
        location: 'Kampala, Kololo',
        date: '2025-01-08',
        time: '11:00 AM',
        amount: 250000,
        status: 'completed',
        completedAt: '2025-01-08 3:45 PM',
        rating: 5,
      },
    ],
    cancelled: [
      {
        id: '4',
        clientName: 'David Mukasa',
        service: 'Sink Installation',
        location: 'Jinja',
        date: '2025-01-09',
        time: '9:00 AM',
        amount: 180000,
        status: 'cancelled',
        cancelledAt: '2025-01-09 8:00 AM',
        cancelReason: 'Client rescheduled',
      },
    ],
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return { bg: '#DBEAFE', text: '#2563EB' };
      case 'in-progress':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'completed':
        return { bg: '#D1FAE5', text: '#059669' };
      case 'cancelled':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon size={16} color="#2563EB" />;
      case 'in-progress':
        return <PlayIcon size={16} color="#D97706" />;
      case 'completed':
        return <CheckCircleIcon size={16} color="#059669" />;
      case 'cancelled':
        return <XCircleIcon size={16} color="#DC2626" />;
      default:
        return <ClockIcon size={16} color="#6B7280" />;
    }
  };

  const getCurrentBookings = () => {
    switch (activeTab) {
      case 'active':
        return bookings.active;
      case 'completed':
        return bookings.completed;
      case 'cancelled':
        return bookings.cancelled;
      default:
        return [...bookings.active, ...bookings.completed, ...bookings.cancelled];
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Bookings
        </Text>
        <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">
          Track all your service bookings
        </Text>
      </View>

      {/* Tab Toggle */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 mb-4"
      >
        <View className="flex-row space-x-2">
          {['all', 'active', 'completed', 'cancelled'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as TabType)}
              className={`px-5 py-2.5 rounded-full ${
                activeTab === tab
                  ? 'bg-primary-500'
                  : 'bg-white dark:bg-[#1E293B]'
              }`}
            >
              <Text
                className={`font-semibold capitalize ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab} {tab === 'all' && `(${bookings.all})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
        className="flex-1 px-6"
      >
        {getCurrentBookings().map((booking: any) => (
          <TouchableOpacity
            key={booking.id}
            onPress={() => router.push(`/(bookings)/${booking.id}`)}
            className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 shadow-sm"
          >
            {/* Header */}
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-500 font-bold text-lg">
                    {booking.clientName.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-900 dark:text-white">
                    {booking.clientName}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {booking.status === 'in-progress'
                      ? `Started at ${booking.startedAt}`
                      : booking.status === 'accepted'
                      ? `Accepted ${booking.acceptedAt}`
                      : booking.status === 'completed'
                      ? `Completed on ${booking.completedAt}`
                      : `Cancelled on ${booking.cancelledAt}`}
                  </Text>
                </View>
              </View>
              <View
                className="px-2 py-1 rounded-full flex-row items-center"
                style={{ backgroundColor: getStatusColor(booking.status).bg }}
              >
                {getStatusIcon(booking.status)}
                <Text
                  className="text-xs font-semibold ml-1 capitalize"
                  style={{ color: getStatusColor(booking.status).text }}
                >
                  {booking.status.replace('-', ' ')}
                </Text>
              </View>
            </View>

            {/* Service */}
            <Text className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
              {booking.service}
            </Text>

            {/* Details */}
            <View className="space-y-2 mb-4">
              <View className="flex-row items-center">
                <MapPinIcon size={16} color="#6B7280" />
                <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                  {booking.location}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <CalendarIcon size={16} color="#6B7280" />
                  <Text className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                    {booking.date} at {booking.time}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <CurrencyDollarIcon size={16} color="#6B7280" />
                  <Text className="text-sm ml-2 font-bold text-gray-900 dark:text-white">
                    {formatCurrency(booking.amount)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Actions based on status */}
            {booking.status === 'accepted' && (
              <TouchableOpacity
                onPress={() => router.push(`/(bookings)/start?id=${booking.id}`)}
                className="bg-primary-500 py-3 rounded-xl flex-row items-center justify-center"
              >
                <PlayIcon size={20} color="#FFFFFF" />
                <Text className="text-white font-bold ml-2">Start Service</Text>
              </TouchableOpacity>
            )}

            {booking.status === 'in-progress' && (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => router.push(`/(messages)/${booking.id}`)}
                  className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-3 rounded-xl flex-row items-center justify-center"
                >
                  <ChatBubbleLeftRightIcon size={20} color="#6B7280" />
                  <Text className="font-bold ml-2 text-gray-600 dark:text-gray-400">
                    Chat
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push(`/(bookings)/complete?id=${booking.id}`)}
                  className="flex-1 bg-green-500 py-3 rounded-xl flex-row items-center justify-center"
                >
                  <CheckCircleIcon size={20} color="#FFFFFF" />
                  <Text className="text-white font-bold ml-2">Complete</Text>
                </TouchableOpacity>
              </View>
            )}

            {booking.status === 'completed' && booking.rating && (
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-200 dark:border-[#334155]">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Client Rating:
                </Text>
                <View className="flex-row items-center">
                  {[...Array(booking.rating)].map((_, i) => (
                    <Text key={i} className="text-yellow-500 text-lg">★</Text>
                  ))}
                  <Text className="text-gray-500 ml-2">({booking.rating}/5)</Text>
                </View>
              </View>
            )}

            {booking.status === 'cancelled' && booking.cancelReason && (
              <View className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <Text className="text-red-600 dark:text-red-400 text-sm">
                  Reason: {booking.cancelReason}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {getCurrentBookings().length === 0 && (
          <View className="items-center justify-center py-20">
            <Text className="text-base text-gray-400 dark:text-gray-500">
              No {activeTab !== 'all' && activeTab} bookings found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}