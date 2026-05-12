// File: app/(business)/[id]/analytics.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  StarIcon,
} from 'react-native-heroicons/outline';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_CHART_HEIGHT = 140;

export default function BusinessAnalyticsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const analytics = {
    revenue: { current: 1250000, previous: 980000, change: 27.6 },
    bookings: { current: 45, previous: 38, change: 18.4 },
    newClients: { current: 23, previous: 19, change: 21.1 },
    avgResponseTime: { current: '1.5h', previous: '2.3h', improved: true },
    topServices: [
      { name: 'Pipe Repair', bookings: 18, revenue: 450000 },
      { name: 'Bathroom Install', bookings: 12, revenue: 600000 },
      { name: 'Water Heater Fix', bookings: 8, revenue: 200000 },
      { name: 'Leak Detection', bookings: 7, revenue: 175000 },
    ],
    revenueByDay: [
      { day: 'Mon', amount: 150000 },
      { day: 'Tue', amount: 180000 },
      { day: 'Wed', amount: 220000 },
      { day: 'Thu', amount: 200000 },
      { day: 'Fri', amount: 250000 },
      { day: 'Sat', amount: 150000 },
      { day: 'Sun', amount: 100000 },
    ],
    bookingsByStatus: { completed: 38, active: 5, cancelled: 2 },
  };

  const maxRevenue = Math.max(...analytics.revenueByDay.map((d) => d.amount));

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const fmt = (amount: number) =>
    amount >= 1000000
      ? `UGX ${(amount / 1000000).toFixed(1)}M`
      : `UGX ${(amount / 1000).toFixed(0)}K`;

  const totalBookings =
    analytics.bookingsByStatus.completed +
    analytics.bookingsByStatus.active +
    analytics.bookingsByStatus.cancelled;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <ExpoStatusBar style="light" />

      {/* Gradient Header */}
      <LinearGradient colors={['#F57C1F', '#E06A0F']} className="px-6 pt-4 pb-8">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
            <ArrowLeftIcon size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold flex-1">Analytics</Text>
          <CalendarIcon size={22} color="#FFFFFF" />
        </View>

        {/* Period Selector */}
        <View className="flex-row bg-white/20 rounded-xl p-1">
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 rounded-lg ${
                selectedPeriod === period ? 'bg-white' : ''
              }`}
            >
              <Text
                className={`text-center font-bold capitalize text-sm ${
                  selectedPeriod === period ? 'text-primary-500' : 'text-white/80'
                }`}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
        className="-mt-4"
      >
        {/* Key Metrics */}
        <View className="px-4 mb-4">
          <View className="flex-row flex-wrap -mx-1.5">
            <MetricCard
              icon={<CurrencyDollarIcon size={20} color="#F57C1F" />}
              iconBg="bg-orange-50 dark:bg-orange-900/20"
              label="Revenue"
              value={fmt(analytics.revenue.current)}
              change={analytics.revenue.change}
              isUp={true}
            />
            <MetricCard
              icon={<ChartBarIcon size={20} color="#2DA9E9" />}
              iconBg="bg-blue-50 dark:bg-blue-900/20"
              label="Bookings"
              value={analytics.bookings.current.toString()}
              change={analytics.bookings.change}
              isUp={true}
            />
            <MetricCard
              icon={<UserGroupIcon size={20} color="#10B981" />}
              iconBg="bg-green-50 dark:bg-green-900/20"
              label="New Clients"
              value={analytics.newClients.current.toString()}
              change={analytics.newClients.change}
              isUp={true}
            />
            <MetricCard
              icon={<ClockIcon size={20} color="#8B5CF6" />}
              iconBg="bg-purple-50 dark:bg-purple-900/20"
              label="Avg Response"
              value={analytics.avgResponseTime.current}
              change={null}
              isUp={analytics.avgResponseTime.improved}
              suffix={analytics.avgResponseTime.improved ? '↑ faster' : '↓ slower'}
            />
          </View>
        </View>

        {/* Revenue Bar Chart */}
        <View className="mx-4 mb-4 bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-[#334155]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-bold text-gray-900 dark:text-white">
              Revenue Overview
            </Text>
            <Text className="text-xs text-gray-400 bg-gray-100 dark:bg-[#0F172A] px-2 py-1 rounded-full">
              This Week
            </Text>
          </View>

          {/* Y-axis label */}
          <Text className="text-xs text-gray-400 mb-2">
            Peak: {fmt(maxRevenue)}
          </Text>

          {/* Bars */}
          <View
            className="flex-row items-end justify-between"
            style={{ height: BAR_CHART_HEIGHT }}
          >
            {analytics.revenueByDay.map((day, index) => {
              const barHeight = Math.max(
                (day.amount / maxRevenue) * BAR_CHART_HEIGHT,
                8
              );
              const isMax = day.amount === maxRevenue;
              return (
                <View key={day.day} className="flex-1 items-center">
                  <View
                    style={{
                      height: barHeight,
                      width: '70%',
                      borderRadius: 6,
                      backgroundColor: isMax ? '#F57C1F' : '#FED7AA',
                    }}
                  />
                  <Text className="text-xs text-gray-400 mt-2">{day.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Bookings Status Ring-style */}
        <View className="mx-4 mb-4 bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-[#334155]">
          <Text className="text-base font-bold text-gray-900 dark:text-white mb-4">
            Bookings Breakdown
          </Text>
          <View className="space-y-3">
            <StatusRow
              label="Completed"
              count={analytics.bookingsByStatus.completed}
              total={totalBookings}
              color="#10B981"
              bg="bg-green-500"
            />
            <StatusRow
              label="Active"
              count={analytics.bookingsByStatus.active}
              total={totalBookings}
              color="#2DA9E9"
              bg="bg-blue-400"
            />
            <StatusRow
              label="Cancelled"
              count={analytics.bookingsByStatus.cancelled}
              total={totalBookings}
              color="#EF4444"
              bg="bg-red-400"
            />
          </View>
        </View>

        {/* Top Services */}
        <View className="mx-4 mb-4 bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-[#334155]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-bold text-gray-900 dark:text-white">
              Top Services
            </Text>
            <StarIcon size={16} color="#F59E0B" />
          </View>
          {analytics.topServices.map((svc, i) => {
            const maxBookings = analytics.topServices[0].bookings;
            return (
              <View
                key={svc.name}
                className={`py-3 ${
                  i < analytics.topServices.length - 1
                    ? 'border-b border-gray-100 dark:border-[#334155]'
                    : ''
                }`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <View className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center mr-2">
                      <Text className="text-primary-600 text-xs font-bold">{i + 1}</Text>
                    </View>
                    <Text className="font-semibold text-gray-900 dark:text-white text-sm flex-1">
                      {svc.name}
                    </Text>
                  </View>
                  <Text className="text-primary-500 font-bold text-sm">{fmt(svc.revenue)}</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="flex-1 bg-gray-100 dark:bg-[#0F172A] h-1.5 rounded-full overflow-hidden mr-3">
                    <View
                      className="h-full bg-primary-400 rounded-full"
                      style={{ width: `${(svc.bookings / maxBookings) * 100}%` }}
                    />
                  </View>
                  <Text className="text-xs text-gray-400">{svc.bookings} bookings</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Insights Banner */}
        <LinearGradient
          colors={['#EFF6FF', '#DBEAFE']}
          className="mx-4 mb-8 rounded-2xl p-4"
        >
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
              <ArrowTrendingUpIcon size={16} color="#FFFFFF" />
            </View>
            <Text className="font-bold text-blue-800 text-base">Monthly Insights</Text>
          </View>
          <View className="space-y-1.5">
            {[
              `Revenue up ${analytics.revenue.change}% vs last month`,
              `${analytics.newClients.current} new clients acquired`,
              `${analytics.topServices[0].name} is your top earner`,
              `${Math.round((analytics.bookingsByStatus.completed / totalBookings) * 100)}% completion rate`,
            ].map((insight, i) => (
              <View key={i} className="flex-row items-start">
                <Text className="text-blue-400 mr-2 mt-0.5">•</Text>
                <Text className="text-blue-700 text-sm flex-1">{insight}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  icon,
  iconBg,
  label,
  value,
  change,
  isUp,
  suffix,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  change: number | null;
  isUp: boolean;
  suffix?: string;
}) {
  return (
    <View className="w-1/2 px-1.5 mb-3">
      <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-[#334155]">
        <View className={`w-9 h-9 ${iconBg} rounded-xl items-center justify-center mb-3`}>
          {icon}
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</Text>
        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">{value}</Text>
        {change !== null ? (
          <View className="flex-row items-center">
            {isUp ? (
              <ArrowTrendingUpIcon size={12} color="#10B981" />
            ) : (
              <ArrowTrendingDownIcon size={12} color="#EF4444" />
            )}
            <Text
              className={`text-xs font-semibold ml-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}
            >
              {change > 0 ? '+' : ''}
              {change}%
            </Text>
          </View>
        ) : suffix ? (
          <Text className={`text-xs font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {suffix}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function StatusRow({
  label,
  count,
  total,
  color,
  bg,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  bg: string;
}) {
  const pct = Math.round((count / total) * 100);
  return (
    <View className="mb-3">
      <View className="flex-row items-center justify-between mb-1.5">
        <View className="flex-row items-center">
          <View className={`w-2.5 h-2.5 rounded-full ${bg} mr-2`} />
          <Text className="text-sm text-gray-600 dark:text-gray-300">{label}</Text>
        </View>
        <Text className="text-sm font-bold text-gray-900 dark:text-white">
          {count} <Text className="text-gray-400 font-normal text-xs">({pct}%)</Text>
        </Text>
      </View>
      <View className="h-2 bg-gray-100 dark:bg-[#0F172A] rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}