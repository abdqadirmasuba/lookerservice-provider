import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeftIcon, ClipboardDocumentCheckIcon } from 'react-native-heroicons/outline';

const PLACEHOLDER_BIDS = [
  {
    id: '1',
    service: 'Plumbing Repair',
    client: 'John Doe',
    amount: 150000,
    status: 'pending',
    date: '2026-04-12',
  },
  {
    id: '2',
    service: 'Electrical Wiring',
    client: 'Sarah Kato',
    amount: 320000,
    status: 'accepted',
    date: '2026-04-10',
  },
  {
    id: '3',
    service: 'House Cleaning',
    client: 'Moses Otieno',
    amount: 80000,
    status: 'rejected',
    date: '2026-04-08',
  },
];

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function BidsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeftIcon size={22} color="#F57C1F" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 dark:text-white flex-1">My Bids</Text>
        <Text className="text-sm text-slate-400">{PLACEHOLDER_BIDS.length} total</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {PLACEHOLDER_BIDS.map((bid) => (
          <View
            key={bid.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-slate-700"
          >
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-base font-semibold text-slate-800 dark:text-white flex-1 mr-2">
                {bid.service}
              </Text>
              <View className={`px-2 py-1 rounded-lg ${statusColor[bid.status].split(' ')[0]}`}>
                <Text className={`text-xs font-semibold capitalize ${statusColor[bid.status].split(' ')[1]}`}>
                  {bid.status}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mb-1">Client: {bid.client}</Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-orange-500 font-bold text-base">
                UGX {bid.amount.toLocaleString()}
              </Text>
              <Text className="text-xs text-slate-400">{bid.date}</Text>
            </View>
          </View>
        ))}

        {/* Empty state placeholder */}
        <View className="items-center py-8 mt-4">
          <ClipboardDocumentCheckIcon size={48} color="#CBD5E1" />
          <Text className="text-slate-400 mt-3 text-sm">More bids will appear here</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
