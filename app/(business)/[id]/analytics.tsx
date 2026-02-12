// File: app/(business)/[id]/analytics.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  CalendarIcon,
} from 'react-native-heroicons/outline';

export default function BusinessAnalyticsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock data
  const analytics = {
    revenue: {
      current: 1250000,
      previous: 980000,
      change: 27.6,
    },
    bookings: {
      current: 45,
      previous: 38,
      change: 18.4,
    },
    newClients: {
      current: 23,
      previous: 19,
      change: 21.1,
    },
    avgResponseTime: {
      current: '1.5 hours',
      previous: '2.3 hours',
      improved: true,
    },
    topServices: [
      { name: 'Pipe Repair', bookings: 18, revenue: 450000 },
      { name: 'Bathroom Installation', bookings: 12, revenue: 600000 },
      { name: 'Water Heater Fix', bookings: 8, revenue: 200000 },
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
    bookingsByStatus: {
      completed: 38,
      active: 5,
      cancelled: 2,
    },
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const formatCurrency = (amount: number) => {
    return `UGX ${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <ExpoStatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeftIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1">
            Analytics
          </Text>
        </View>

        {/* Period Selector */}
        <View className="flex-row bg-gray-100 dark:bg-[#0F172A] rounded-xl p-1">
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              className={`flex-1 py-2 rounded-lg ${
                selectedPeriod === period ? 'bg-white dark:bg-[#1E293B]' : ''
              }`}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  selectedPeriod === period
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
      >
        <View className="px-6 py-6">
          {/* Key Metrics */}
          <View className="flex-row flex-wrap -mx-2 mb-6">
            <MetricCard
              icon={<CurrencyDollarIcon size={24} color="#F57C1F" />}
              label="Revenue"
              value={formatCurrency(analytics.revenue.current)}
              change={analytics.revenue.change}
              isPositive={true}
            />
            <MetricCard
              icon={<ChartBarIcon size={24} color="#2DA9E9" />}
              label="Bookings"
              value={analytics.bookings.current.toString()}
              change={analytics.bookings.change}
              isPositive={true}
            />
            <MetricCard
              icon={<UserGroupIcon size={24} color="#10B981" />}
              label="New Clients"
              value={analytics.newClients.current.toString()}
              change={analytics.newClients.change}
              isPositive={true}
            />
            <MetricCard
              icon={<ClockIcon size={24} color="#F59E0B" />}
              label="Avg. Response"
              value={analytics.avgResponseTime.current}
              change={null}
              isPositive={analytics.avgResponseTime.improved}
            />
          </View>

          {/* Revenue Chart */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-6 border border-gray-200 dark:border-[#334155]">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Revenue Overview
            </Text>
            <View className="h-48">
              {analytics.revenueByDay.map((day, index) => {
                const maxAmount = Math.max(...analytics.revenueByDay.map((d) => d.amount));
                const height = (day.amount / maxAmount) * 100;
                return (
                  <View key={day.day} className="flex-1 flex-row items-end">
                    <View className="flex-1 items-center">
                      <View
                        className="w-full bg-primary-500 rounded-t-lg"
                        style={{ height: `${height}%` }}
                      />
                      <Text className="text-xs text-gray-500 mt-2">{day.day}</Text>
                    </View>
                    {index < analytics.revenueByDay.length - 1 && (
                      <View className="w-2" />
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Top Services */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-6 border border-gray-200 dark:border-[#334155]">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Top Services
            </Text>
            {analytics.topServices.map((service, index) => (
              <View
                key={service.name}
                className={`py-3 ${
                  index < analytics.topServices.length - 1
                    ? 'border-b border-gray-200 dark:border-[#334155]'
                    : ''
                }`}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="font-bold text-gray-900 dark:text-white flex-1">
                    {service.name}
                  </Text>
                  <Text className="text-primary-500 font-bold">
                    {formatCurrency(service.revenue)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="flex-1 bg-gray-200 dark:bg-[#0F172A] h-2 rounded-full overflow-hidden mr-3">
                    <View
                      className="h-full bg-primary-500 rounded-full"
                      style={{
                        width: `${(service.bookings / analytics.bookings.current) * 100}%`,
                      }}
                    />
                  </View>
                  <Text className="text-xs text-gray-500">{service.bookings} bookings</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Bookings Status */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-6 border border-gray-200 dark:border-[#334155]">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Bookings by Status
            </Text>
            <View className="space-y-3">
              <StatusBar
                label="Completed"
                count={analytics.bookingsByStatus.completed}
                total={analytics.bookings.current}
                color="#10B981"
              />
              <StatusBar
                label="Active"
                count={analytics.bookingsByStatus.active}
                total={analytics.bookings.current}
                color="#2DA9E9"
              />
              <StatusBar
                label="Cancelled"
                count={analytics.bookingsByStatus.cancelled}
                total={analytics.bookings.current}
                color="#EF4444"
              />
            </View>
          </View>

          {/* Insights */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <View className="flex-row items-center mb-2">
              <CalendarIcon size={20} color="#2DA9E9" />
              <Text className="text-blue-700 dark:text-blue-400 font-bold ml-2">
                Monthly Summary
              </Text>
            </View>
            <Text className="text-blue-600 dark:text-blue-300 text-sm">
              • Your revenue is up {analytics.revenue.change}% compared to last month{'\n'}
              • You gained {analytics.newClients.current} new clients{'\n'}
              • {analytics.topServices[0].name} is your most popular service
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Metric Card Component
function MetricCard({
  icon,
  label,
  value,
  change,
  isPositive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number | null;
  isPositive: boolean;
}) {
  return (
    <View className="w-1/2 p-2">
      <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center mb-2">
          {icon}
          <Text className="text-xs text-gray-500 ml-2 flex-1">{label}</Text>
        </View>
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </Text>
        {change !== null && (
          <View className="flex-row items-center">
            {isPositive ? (
              <ChevronDoubleUpIcon size={14} color="#10B981" />
            ) : (
              <ChevronDoubleDownIcon size={14} color="#EF4444" />
            )}
            <Text className={`text-xs font-semibold ml-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? '+' : ''}{change}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Status Bar Component
function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = (count / total) * 100;
  return (
    <View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-sm text-gray-600 dark:text-gray-400">{label}</Text>
        <Text className="text-sm font-bold text-gray-900 dark:text-white">{count}</Text>
      </View>
      <View className="h-2 bg-gray-200 dark:bg-[#0F172A] rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}