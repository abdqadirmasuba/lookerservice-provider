import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeftIcon, BanknotesIcon, ArrowTrendingUpIcon } from 'react-native-heroicons/outline';

const STATS = [
  { label: 'This Month', amount: 1850000, change: '+12%' },
  { label: 'Last Month', amount: 1640000, change: '+8%' },
  { label: 'Total Earned', amount: 9320000, change: '' },
];

const TRANSACTIONS = [
  { id: '1', client: 'John Doe', service: 'Plumbing Repair', amount: 320000, date: '2026-04-13', status: 'paid' },
  { id: '2', client: 'Sarah Kato', service: 'Electrical Wiring', amount: 580000, date: '2026-04-11', status: 'paid' },
  { id: '3', client: 'Moses Otieno', service: 'House Cleaning', amount: 120000, date: '2026-04-09', status: 'pending' },
  { id: '4', client: 'Grace Namuli', service: 'Painting', amount: 450000, date: '2026-04-06', status: 'paid' },
  { id: '5', client: 'David Ssempa', service: 'Carpentry', amount: 380000, date: '2026-04-03', status: 'paid' },
];

export default function EarningsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeftIcon size={22} color="#F57C1F" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 dark:text-white">Earnings</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row mx-4 mt-4 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
        {(['overview', 'transactions'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
          >
            <Text className={`text-sm font-semibold capitalize ${activeTab === tab ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' ? (
          <>
            {STATS.map((stat, i) => (
              <View
                key={i}
                className={`rounded-2xl p-5 mb-3 ${i === 0 ? 'bg-orange-500' : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700'}`}
              >
                <Text className={`text-sm mb-1 ${i === 0 ? 'text-orange-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {stat.label}
                </Text>
                <Text className={`text-2xl font-bold ${i === 0 ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                  UGX {stat.amount.toLocaleString()}
                </Text>
                {stat.change !== '' && (
                  <View className="flex-row items-center mt-1">
                    <ArrowTrendingUpIcon size={14} color={i === 0 ? '#FED7AA' : '#22C55E'} />
                    <Text className={`text-xs ml-1 ${i === 0 ? 'text-orange-100' : 'text-green-500'}`}>
                      {stat.change} from previous period
                    </Text>
                  </View>
                )}
              </View>
            ))}

            {/* Weekly chart placeholder */}
            <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 mt-1">
              <Text className="text-base font-semibold text-slate-800 dark:text-white mb-3">Weekly Breakdown</Text>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const widths = [60, 80, 45, 90, 70, 100, 55];
                return (
                  <View key={day} className="flex-row items-center mb-2">
                    <Text className="text-xs text-slate-400 w-8">{day}</Text>
                    <View className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-3 mx-2">
                      <View className="bg-orange-400 rounded-full h-3" style={{ width: `${widths[i]}%` }} />
                    </View>
                    <Text className="text-xs text-slate-500 dark:text-slate-400 w-16 text-right">
                      UGX {(widths[i] * 2800).toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <>
            {TRANSACTIONS.map((txn) => (
              <View
                key={txn.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-gray-100 dark:border-slate-700"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-3">
                    <Text className="text-sm font-semibold text-slate-800 dark:text-white">{txn.service}</Text>
                    <Text className="text-xs text-slate-400 mt-0.5">{txn.client}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-base font-bold text-orange-500">+UGX {txn.amount.toLocaleString()}</Text>
                    <View className={`mt-1 px-2 py-0.5 rounded-full ${txn.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <Text className={`text-xs font-semibold capitalize ${txn.status === 'paid' ? 'text-green-700' : 'text-yellow-700'}`}>
                        {txn.status}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="text-xs text-slate-400 mt-2">{txn.date}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
