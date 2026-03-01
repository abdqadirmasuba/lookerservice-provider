// File: app/(tabs)/index.tsx

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
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { apiRequests } from '@/src/utils/apiRequest';
import { showErrorAlert } from '@/src/utils/alerts';
import {
  BellIcon,
  PlusCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MapPinIcon,
  StarIcon,
  XCircleIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get provider businesses from Redux
  const providerBusinesses = useSelector((state: RootState) => state.auth.providerBusinesses);
  const userData = useSelector((state: RootState) => state.user.user);

  // Fetch dashboard data
  const fetchDashboardData = async (providerId: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequests.get(`/provider/dashboard/${providerId}`);
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        showErrorAlert('Error', response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      showErrorAlert('Error', 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with first business
  useEffect(() => {
    if (providerBusinesses && providerBusinesses.length > 0) {
      const firstBusinessId = providerBusinesses[0].id;
      setSelectedBusinessId(firstBusinessId);
      fetchDashboardData(firstBusinessId);
    }
  }, []);

  // Fetch data when selected business changes
  useEffect(() => {
    if (selectedBusinessId) {
      fetchDashboardData(selectedBusinessId);
    }
  }, [selectedBusinessId]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (selectedBusinessId) {
      fetchDashboardData(selectedBusinessId).finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  }, [selectedBusinessId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'accepted':
        return '#2DA9E9';
      case 'active':
        return '#2DA9E9';
      case 'completed':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      case 'cancelled':
        return '#DC2626';
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
              <Text className="text-white text-xl font-bold mt-1">{userData?.fullName || 'Provider'}</Text>
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
          {providerBusinesses && providerBusinesses.length > 1 && (
            <View className="mb-4">
              <Text className="text-white/80 text-xs mb-2">Active Business</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {providerBusinesses.map((business) => (
                  <TouchableOpacity
                    key={business.id}
                    onPress={() => setSelectedBusinessId(business.id)}
                    className={`mr-3 px-4 py-2 rounded-full ${
                      selectedBusinessId === business.id
                        ? 'bg-white'
                        : 'bg-white/20'
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selectedBusinessId === business.id
                          ? 'text-primary-500'
                          : 'text-white'
                      }`}
                    >
                      {business.business_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Single Business Display */}
          {providerBusinesses && providerBusinesses.length === 1 && (
            <View className="mb-4">
              <Text className="text-white/80 text-xs mb-2">Business</Text>
              <View className="bg-white rounded-full px-4 py-2 self-start">
                <Text className="text-primary-500 font-semibold text-sm">
                  {providerBusinesses[0].business_name}
                </Text>
              </View>
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
          {isLoading && !dashboardData ? (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center">
              <ActivityIndicator size="large" color="#F57C1F" />
              <Text className="text-gray-500 mt-2">Loading dashboard...</Text>
            </View>
          ) : dashboardData ? (
            <>
              <View className="flex-row flex-wrap -mx-2">
                <StatCard
                  icon={<ClockIcon size={24} color="#F59E0B" />}
                  label="Pending"
                  value={dashboardData.stats.pending_bookings.toString()}
                />
                <StatCard
                  icon={<CheckCircleIcon size={24} color="#2DA9E9" />}
                  label="Accepted"
                  value={dashboardData.stats.accepted_bookings.toString()}
                />
                <StatCard
                  icon={<ChartBarIcon size={24} color="#10B981" />}
                  label="Active"
                  value={dashboardData.stats.active_bookings.toString()}
                />
                <StatCard
                  icon={<CheckCircleIcon size={24} color="#059669" />}
                  label="Completed"
                  value={dashboardData.stats.completed_bookings.toString()}
                />
                <StatCard
                  icon={<XCircleIcon size={24} color="#EF4444" />}
                  label="Rejected"
                  value={dashboardData.stats.rejected_bookings.toString()}
                />
                <StatCard
                  icon={<XMarkIcon size={24} color="#DC2626" />}
                  label="Cancelled"
                  value={dashboardData.stats.cancelled_bookings.toString()}
                />
                <StatCard
                  icon={<CurrencyDollarIcon size={24} color="#F57C1F" />}
                  label="Total Earnings"
                  value={formatCurrency(dashboardData.stats.total_earnings)}
                  isLarge
                />
              </View>
            </>
          ) : (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center">
              <Text className="text-gray-500">No business selected</Text>
            </View>
          )}
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

          {isLoading && !dashboardData ? (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center">
              <ActivityIndicator size="small" color="#F57C1F" />
            </View>
          ) : dashboardData && dashboardData.recent_bookings && dashboardData.recent_bookings.length > 0 ? (
            dashboardData.recent_bookings.map((booking: any) => (
              <TouchableOpacity
                key={booking.id}
                onPress={() => router.push(`/(bookings)/${booking.id}`)}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3 shadow-sm"
              >
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mr-3">
                    <Text className="text-primary-500 font-bold text-lg">
                      {booking.client_name.charAt(0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-bold text-gray-900 dark:text-white">
                        {booking.client_name}
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
                      {booking.service_title}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-xs text-gray-500">
                        {booking.booking_number}
                      </Text>
                      <Text className="text-sm font-semibold text-primary-500">
                        {formatCurrency(booking.agreed_amount)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center">
              <Text className="text-gray-500">No recent bookings</Text>
            </View>
          )}
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
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
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