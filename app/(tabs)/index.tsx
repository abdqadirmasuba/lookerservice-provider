// File: app/(tabs)/index.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store';
import { apiRequests } from '@/src/utils/apiRequest';
import { setUnreadCount } from '@/src/store/slices/notificationSlice';
import { showErrorAlert } from '@/src/utils/alerts';
import {
  BellIcon,
  PlusCircleIcon,
  ClockIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  CalendarDaysIcon,
} from 'react-native-heroicons/outline';

export default function DashboardScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get provider businesses and active business from Redux
  const providerBusinesses = useSelector((state: RootState) => state.auth.providerBusinesses);
  const activeBusinessId = useSelector((state: RootState) => state.auth.activeBusinessId);
  const providerTier = useSelector((state: RootState) => state.auth.providerTier);
  const userData = useSelector((state: RootState) => state.user.user);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);

  // Check if user has any registered businesses
  const hasBusinesses = providerBusinesses && providerBusinesses.length > 0;

  // Get active business details
  const activeBusiness = providerBusinesses.find(b => b.id === activeBusinessId);
  const businessCount = providerBusinesses.length;

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

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const response = await apiRequests.get('/notifications/count');
      if (response.data.success) {
        dispatch(setUnreadCount(response.data.data.unread_count));
      }
    } catch (error: any) {
      console.error('Unread count fetch error:', error);
    }
  };

  // Fetch data when active business is set
  useEffect(() => {
    if (activeBusinessId) {
      fetchDashboardData(activeBusinessId);
    }
    fetchUnreadCount();
  }, [activeBusinessId]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    const tasks: Promise<any>[] = [fetchUnreadCount()];
    if (activeBusinessId) {
      tasks.push(fetchDashboardData(activeBusinessId));
    }
    Promise.all(tasks).finally(() => setRefreshing(false));
  }, [activeBusinessId]);

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
    return `UGX ${amount?.toLocaleString()}`;
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
            <View className="flex-1">
              <Text className="text-white/80 text-sm">Welcome back,</Text>
              <Text className="text-white text-xl font-bold mt-1">{userData?.fullName || 'Provider'}</Text>
            </View>
            <View className="flex-row items-center">
              {/* Business Switcher Icon - Pro tier only, when multiple businesses exist */}
              {providerTier === 'pro' && businessCount > 1 && (
                <TouchableOpacity
                  onPress={() => router.push('/(business)/switch-business')}
                  className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
                >
                  <BuildingStorefrontIcon size={24} color="#FFFFFF" />
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">{businessCount}</Text>
                  </View>
                </TouchableOpacity>
              )}
              
              {/* Notifications */}
              <TouchableOpacity
                onPress={() => router.push('/(notifications)')}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <BellIcon size={24} color="#FFFFFF" />
                {unreadCount > 0 && (
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Active Business Display */}
          {hasBusinesses && activeBusiness && (
            <View className="mb-4">
              <Text className="text-white/80 text-xs mb-2">Active Business</Text>
              <View className="bg-white rounded-2xl px-4 py-3">
                <View className="flex-row items-center">
                  {/* Business Logo or Initial Avatar */}
                  <View className="w-12 h-12 bg-primary-50 rounded-xl items-center justify-center mr-3 overflow-hidden">
                    {activeBusiness.logo_url ? (
                      <Image
                        source={{ uri: activeBusiness.logo_url }}
                        className="w-12 h-12"
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-primary-500 font-bold text-xl">
                        {activeBusiness.business_name.charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base">
                      {activeBusiness.business_name}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-0.5">
                      {activeBusiness.address || 'Address not set'}
                    </Text>
                  </View>
                  {providerTier === 'pro' && businessCount > 1 && (
                    <TouchableOpacity
                      onPress={() => router.push('/(business)/switch-business')}
                      className="px-3 py-1.5 bg-primary-50 rounded-lg"
                    >
                      <Text className="text-primary-600 font-semibold text-xs">Switch</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        </LinearGradient>

        {/* Stats Grid or Empty State */}
        <View className="px-6 -mt-4">
          {!hasBusinesses ? (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center shadow-sm">
              <View className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center mb-4">
                <PlusCircleIcon size={40} color="#F57C1F" />
              </View>
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                No Active Businesses
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mb-6 px-4">
                Register your first business to start receiving bookings and grow your service offerings.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(business)/register/step1')}
                className="bg-primary-500 px-8 py-4 rounded-xl shadow-sm"
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-base">Register a Business</Text>
              </TouchableOpacity>
            </View>
          ) : isLoading && !dashboardData ? (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center">
              <ActivityIndicator size="large" color="#F57C1F" />
              <Text className="text-gray-500 mt-2">Loading dashboard...</Text>
            </View>
          ) : dashboardData ? (
            <View className="flex-row -mx-2">
              <StatCard
                icon={<ClockIcon size={24} color="#F59E0B" />}
                label="Requests"
                value={dashboardData.stats.pending_bookings.toString()}
                subtitle="Pending"
              />
              <StatCard
                icon={<CalendarDaysIcon size={24} color="#2DA9E9" />}
                label="Bookings"
                value={(dashboardData.stats.accepted_bookings + dashboardData.stats.active_bookings).toString()}
                subtitle="Active"
              />
            </View>
          ) : (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center">
              <Text className="text-gray-500">No business selected</Text>
            </View>
          )}
        </View>

        {/* Recent Bookings - Only show if has businesses */}
        {hasBusinesses && (
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              Today's Schedule
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
              <CalendarDaysIcon size={32} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">No bookings today</Text>
            </View>
          )}
        </View>
        )}

        {/* Quick Links - Only show if has businesses */}
        {hasBusinesses && (
        <View className="px-6 mt-6 mb-8">
          <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            <QuickLinkCard
              icon={<BuildingStorefrontIcon size={24} color="#F57C1F" />}
              label={businessCount === 1 ? 'My Business' : 'My Businesses'}
              onPress={() =>
                businessCount === 1
                  ? router.push(`/(business)/${activeBusinessId}/profile`)
                  : router.push('/(business)/list')
              }
            />
            <QuickLinkCard
              icon={<ClipboardDocumentListIcon size={24} color="#F57C1F" />}
              label="Bids"
              onPress={() => router.push('/(bids)')}
            />
            <QuickLinkCard
              icon={<BanknotesIcon size={24} color="#F57C1F" />}
              label="Transactions"
              onPress={() => router.push('/(earnings)')}
            />
            <QuickLinkCard
              icon={<ChartBarIcon size={24} color="#F57C1F" />}
              label="Analytics"
              onPress={() => router.push(`/(business)/${activeBusinessId}/analytics`)}
            />
          </View>
        </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <View className="w-1/2 p-2">
      <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center mb-2">
          {icon}
          <Text className="text-gray-700 dark:text-gray-300 text-sm font-semibold ml-2 flex-1">{label}</Text>
        </View>
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </Text>
        {subtitle && (
          <Text className="text-xs text-gray-400 mt-1">{subtitle}</Text>
        )}
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