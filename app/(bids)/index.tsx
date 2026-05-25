import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  TagIcon,
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
} from 'react-native-heroicons/outline';

// Placeholder open service requests
const OPEN_REQUESTS: any[] = []; // No integrated bids yet, show empty state until real data is available.

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function BidsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const openCount = OPEN_REQUESTS.length;
  const myBidCount = OPEN_REQUESTS.filter((r) => r.has_bid).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={['#F57C1F', '#E06A0F']} className="px-6 pt-4 pb-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <ArrowLeftIcon size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1">Open Bids</Text>
        </View>
        <View className="flex-row">
          <View className="flex-1 bg-white/20 rounded-xl p-3 mr-2">
            <Text className="text-white/80 text-xs mb-1">Open Requests</Text>
            <Text className="text-white text-2xl font-bold">{openCount}</Text>
          </View>
          <View className="flex-1 bg-white/20 rounded-xl p-3">
            <Text className="text-white/80 text-xs mb-1">My Bids Placed</Text>
            <Text className="text-white text-2xl font-bold">{myBidCount}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
      >
        {OPEN_REQUESTS.length > 0 ? (
          OPEN_REQUESTS.map((request) => (
            <TouchableOpacity
              key={request.id}
              onPress={() => router.push(`/(bids)/${request.id}`)}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-[#334155]"
              activeOpacity={0.8}
            >
              {/* Top row: client avatar + name + time */}
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-500 font-bold text-base">
                    {request.client_name.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-900 dark:text-white text-base">
                    {request.client_name}
                  </Text>
                  <Text className="text-xs text-gray-400">{request.request_number}</Text>
                </View>
                <Text className="text-xs text-gray-400">{timeAgo(request.created_at)}</Text>
              </View>

              {/* Service tags */}
              <View className="flex-row flex-wrap mb-3">
                {request.services.map((svc: any) => (
                  <View
                    key={svc.id}
                    className="bg-primary-50 dark:bg-primary-900/20 rounded-lg px-2 py-1 mr-2 mb-1 flex-row items-center"
                  >
                    <TagIcon size={10} color="#F57C1F" />
                    <Text className="text-primary-600 text-xs font-semibold ml-1">{svc.service_name}</Text>
                  </View>
                ))}
              </View>

              {/* Description */}
              <Text className="text-sm text-gray-600 dark:text-gray-300 mb-3" numberOfLines={2}>
                {request.description}
              </Text>

              {/* Info row */}
              <View className="flex-row items-center flex-wrap mb-3">
                <View className="flex-row items-center mr-4 mb-1">
                  <MapPinIcon size={14} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500 ml-1">{request.address}</Text>
                </View>
                <View className="flex-row items-center mr-4 mb-1">
                  <CalendarDaysIcon size={14} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500 ml-1">{request.preferred_date}</Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <CurrencyDollarIcon size={14} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500 ml-1">
                    UGX {request.budget_min.toLocaleString()} – {request.budget_max.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Footer */}
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-100 dark:border-[#334155]">
                <View className="flex-row items-center">
                  <ClipboardDocumentListIcon size={14} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {request.bid_count} bid{request.bid_count !== 1 ? 's' : ''}
                  </Text>
                  {request.has_bid && (
                    <View className="flex-row items-center ml-3 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                      <CheckBadgeIcon size={12} color="#10B981" />
                      <Text className="text-green-600 text-xs font-semibold ml-1">You bid</Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center">
                  <Text className="text-primary-500 text-sm font-semibold mr-1">
                    {request.has_bid ? 'Update Bid' : 'Place Bid'}
                  </Text>
                  <ChevronRightIcon size={16} color="#F57C1F" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center py-12 mt-8">
            <ClipboardDocumentCheckIcon size={48} color="#CBD5E1" />
            <Text className="text-slate-400 mt-3 text-center text-sm">
              There are no gigs posted to bid on yet in your services.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
