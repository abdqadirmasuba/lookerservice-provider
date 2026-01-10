// File: app/(tabs)/index.tsx

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
import { LinearGradient } from 'expo-linear-gradient';
import {
  BellIcon,
  PlusCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MapPinIcon,
  StarIcon,
} from 'react-native-heroicons/outline';

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  // Mock data
  const userData = {
    fullName: 'John Doe',
    businesses: [
      { id: '1', name: 'Doe Plumbing Services', status: 'active' },
      { id: '2', name: 'Emergency Repairs Ltd', status: 'active' },
    ],
  };

  const stats = {
    pendingRequests: 5,
    activeBookings: 3,
    completedToday: 2,
    monthlyEarnings: 1250000,
  };

  const recentBookings = [
    {
      id: '1',
      clientName: 'Alice Nambi',
      service: 'Pipe Repair',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: '2',
      clientName: 'Bob Okello',
      service: 'Bathroom Installation',
      time: '5 hours ago',
      status: 'active',
    },
    {
      id: '3',
      clientName: 'Carol Atim',
      service: 'Water Heater Fix',
      time: '1 day ago',
      status: 'completed',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'active':
        return '#2DA9E9';
      case 'completed':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['#F57C1F', '#E06A0F']}
          className="px-6 pt-4 pb-8 rounded-b-3xl"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-white/80 text-sm">Welcome back,</Text>
              <Text className="text-white text-xl font-bold mt-1">{userData.fullName}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(notifications)')}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <BellIcon size={24} color="#FFFFFF" />
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Business Selector */}
          {userData.businesses.length > 1 && (
            <View className="mb-4">
              <Text className="text-white/80 text-xs mb-2">Active Business</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {userData.businesses.map((business) => (
                  <TouchableOpacity
                    key={business.id}
                    onPress={() => setSelectedBusiness(business.id)}
                    className={`mr-3 px-4 py-2 rounded-full ${
                      selectedBusiness === business.id || (!selectedBusiness && business.id === '1')
                        ? 'bg-white'
                        : 'bg-white/20'
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selectedBusiness === business.id || (!selectedBusiness && business.id === '1')
                          ? 'text-primary-500'
                          : 'text-white'
                      }`}
                    >
                      {business.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Quick Action */}
          <TouchableOpacity
            onPress={() => router.push('/(business)/register/step1')}
            activeOpacity={0.8}
          >
            <View className="bg-white rounded-2xl p-4 flex-row items-center">
              <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mr-4">
                <PlusCircleIcon size={24} color="#F57C1F" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">Register New Business</Text>
                <Text className="text-gray-500 text-xs mt-0.5">Expand your service offerings</Text>
              </View>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Grid */}
        <View className="px-6 -mt-4">
          <View className="flex-row flex-wrap -mx-2">
            <StatCard
              icon={<ClockIcon size={24} color="#F59E0B" />}
              label="Pending"
              value={stats.pendingRequests.toString()}
            />
            <StatCard
              icon={<CheckCircleIcon size={24} color="#2DA9E9" />}
              label="Active"
              value={stats.activeBookings.toString()}
            />
            <StatCard
              icon={<ChartBarIcon size={24} color="#10B981" />}
              label="Completed"
              value={stats.completedToday.toString()}
            />
            <StatCard
              icon={<CurrencyDollarIcon size={24} color="#F57C1F" />}
              label="Earnings"
              value={formatCurrency(stats.monthlyEarnings)}
              isLarge
            />
          </View>
        </View>

        {/* Recent Bookings */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Bookings
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
              <Text className="text-primary-500 font-semibold text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {recentBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              onPress={() => router.push(`/(bookings)/${booking.id}`)}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3 shadow-sm"
            >
              <View className="flex-row items-start">
                <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-500 font-bold text-lg">
                    {booking.clientName.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-bold text-gray-900 dark:text-white">
                      {booking.clientName}
                    </Text>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${getStatusColor(booking.status)}20` }}
                    >
                      <Text
                        className="text-xs font-semibold capitalize"
                        style={{ color: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm mb-1 text-gray-700 dark:text-gray-300">
                    {booking.service}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {booking.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Links */}
        <View className="px-6 mt-6 mb-8">
          <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            <QuickLinkCard
              icon={<MapPinIcon size={24} color="#F57C1F" />}
              label="My Services"
              onPress={() => router.push('/(services)/list')}
            />
            <QuickLinkCard
              icon={<StarIcon size={24} color="#F57C1F" />}
              label="Bids"
              onPress={() => router.push('/(bids)/my-bids')}
            />
            <QuickLinkCard
              icon={<CurrencyDollarIcon size={24} color="#F57C1F" />}
              label="Earnings"
              onPress={() => router.push('/(earnings)/dashboard')}
            />
            <QuickLinkCard
              icon={<ChartBarIcon size={24} color="#F57C1F" />}
              label="Analytics"
              onPress={() => router.push('/(business)/1/analytics')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  isLarge = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLarge?: boolean;
}) {
  return (
    <View className={`${isLarge ? 'w-full' : 'w-1/2'} p-2`}>
      <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center mb-2">
          {icon}
          <Text className="text-gray-500 text-xs ml-2 flex-1">{label}</Text>
        </View>
        <Text className={`text-2xl font-bold text-gray-900 dark:text-white ${isLarge ? 'text-base' : ''}`}>
          {value}
        </Text>
      </View>
    </View>
  );
}

// Quick Link Card Component
function QuickLinkCard({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <View className="w-1/2 p-2">
      <TouchableOpacity
        onPress={onPress}
        className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 items-center shadow-sm"
      >
        <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mb-2">
          {icon}
        </View>
        <Text className="text-sm font-semibold text-center text-gray-900 dark:text-white">
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}