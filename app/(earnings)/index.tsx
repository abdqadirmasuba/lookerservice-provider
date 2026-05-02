import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  FunnelIcon,
} from 'react-native-heroicons/outline';

const TRANSACTIONS = [
  { id: '1', client: 'John Doe', service: 'Plumbing Repair', amount: 320000, date: '2026-04-13', status: 'completed' },
  { id: '2', client: 'Sarah Kato', service: 'Electrical Wiring', amount: 580000, date: '2026-04-11', status: 'completed' },
  { id: '3', client: 'Moses Otieno', service: 'House Cleaning', amount: 120000, date: '2026-04-09', status: 'pending' },
  { id: '4', client: 'Grace Namuli', service: 'Interior Painting', amount: 450000, date: '2026-04-06', status: 'completed' },
  { id: '5', client: 'David Ssempa', service: 'Carpentry', amount: 380000, date: '2026-04-03', status: 'completed' },
  { id: '6', client: 'Alice Nalwoga', service: 'Roof Repair', amount: 750000, date: '2026-03-28', status: 'completed' },
  { id: '7', client: 'Peter Mugisha', service: 'Floor Tiling', amount: 620000, date: '2026-03-22', status: 'pending' },
];

const thisMonthTotal = TRANSACTIONS.filter((t) =>
  t.date.startsWith('2026-04') && t.status === 'completed'
).reduce((sum, t) => sum + t.amount, 0);

const pendingTotal = TRANSACTIONS.filter((t) => t.status === 'pending').reduce(
  (sum, t) => sum + t.amount,
  0
);

type FilterType = 'all' | 'completed' | 'pending';

export default function TransactionsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filtered =
    filter === 'all' ? TRANSACTIONS : TRANSACTIONS.filter((t) => t.status === filter);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={['#F57C1F', '#E06A0F']} className="px-6 pt-4 pb-6">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <ArrowLeftIcon size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1">Transactions</Text>
        </View>

        {/* Summary Cards */}
        <View className="flex-row">
          <View className="flex-1 bg-white/20 rounded-xl p-3 mr-2">
            <View className="flex-row items-center mb-1">
              <ArrowTrendingUpIcon size={14} color="#FED7AA" />
              <Text className="text-white/80 text-xs ml-1">This Month</Text>
            </View>
            <Text className="text-white text-xl font-bold">
              UGX {thisMonthTotal.toLocaleString()}
            </Text>
          </View>
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <View className="flex-row items-center mb-1">
              <ClockIcon size={14} color="#FED7AA" />
              <Text className="text-white/80 text-xs ml-1">Pending</Text>
            </View>
            <Text className="text-white text-xl font-bold">
              UGX {pendingTotal.toLocaleString()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View className="flex-row mx-4 mt-4 bg-gray-100 dark:bg-[#1E293B] rounded-xl p-1 mb-2">
        {(['all', 'completed', 'pending'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`flex-1 py-2 rounded-lg items-center ${
              filter === f ? 'bg-white dark:bg-[#334155] shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-semibold capitalize ${
                filter === f ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
      >
        {filtered.length === 0 ? (
          <View className="items-center py-16">
            <BanknotesIcon size={48} color="#CBD5E1" />
            <Text className="text-gray-400 mt-3">No transactions found</Text>
          </View>
        ) : (
          filtered.map((txn) => (
            <View
              key={txn.id}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3 border border-gray-100 dark:border-[#334155] shadow-sm"
            >
              <View className="flex-row items-center">
                {/* Icon */}
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                    txn.status === 'completed'
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-yellow-50 dark:bg-yellow-900/20'
                  }`}
                >
                  {txn.status === 'completed' ? (
                    <CheckCircleIcon size={22} color="#10B981" />
                  ) : (
                    <ClockIcon size={22} color="#F59E0B" />
                  )}
                </View>

                {/* Details */}
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-bold text-gray-900 dark:text-white">
                    {txn.service}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {txn.client} · {txn.date}
                  </Text>
                </View>

                {/* Amount + Status */}
                <View className="items-end">
                  <Text className="text-base font-bold text-primary-500">
                    +UGX {txn.amount.toLocaleString()}
                  </Text>
                  <View
                    className={`mt-1 px-2 py-0.5 rounded-full ${
                      txn.status === 'completed'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold capitalize ${
                        txn.status === 'completed' ? 'text-green-700' : 'text-yellow-700'
                      }`}
                    >
                      {txn.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

