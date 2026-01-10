// File: app/(tabs)/messages.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from 'react-native-heroicons/outline';

export default function MessagesScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const conversations = [
    {
      id: '1',
      clientName: 'Alice Nambi',
      lastMessage: 'Thank you for the quick service!',
      timestamp: '2m ago',
      unreadCount: 2,
      isOnline: true,
      bookingId: 'BK001',
      service: 'Pipe Repair',
    },
    {
      id: '2',
      clientName: 'Bob Okello',
      lastMessage: 'When can you start the bathroom installation?',
      timestamp: '1h ago',
      unreadCount: 0,
      isOnline: false,
      bookingId: 'BK002',
      service: 'Bathroom Installation',
    },
    {
      id: '3',
      clientName: 'Carol Atim',
      lastMessage: 'Perfect! See you tomorrow.',
      timestamp: '3h ago',
      unreadCount: 0,
      isOnline: true,
      bookingId: 'BK003',
      service: 'Water Heater Fix',
    },
    {
      id: '4',
      clientName: 'David Mukasa',
      lastMessage: 'Can you send me the invoice?',
      timestamp: '1d ago',
      unreadCount: 1,
      isOnline: false,
      bookingId: 'BK004',
      service: 'Commercial Plumbing',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const filteredConversations = conversations.filter((conv) =>
    conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Messages
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(messages)/new')}
            className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center"
          >
            <PencilSquareIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white dark:bg-[#1E293B] rounded-xl px-4 py-3">
          <MagnifyingGlassIcon size={20} color="#6B7280" />
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-gray-900 dark:text-white"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
        className="flex-1"
      >
        {filteredConversations.length > 0 ? (
          <View className="px-6 pb-6">
            {filteredConversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                onPress={() => router.push(`/(messages)/${conversation.id}`)}
                className={`bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3 shadow-sm ${
                  conversation.unreadCount > 0 ? 'border-2 border-primary-500' : ''
                }`}
              >
                <View className="flex-row items-start">
                  {/* Avatar with online indicator */}
                  <View className="relative mr-3">
                    <View className="w-14 h-14 bg-primary-50 rounded-full items-center justify-center">
                      <Text className="text-primary-500 font-bold text-xl">
                        {conversation.clientName.charAt(0)}
                      </Text>
                    </View>
                    {conversation.isOnline && (
                      <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#1E293B]" />
                    )}
                  </View>

                  {/* Content */}
                  <View className="flex-1">
                    {/* Name and Time */}
                    <View className="flex-row items-center justify-between mb-1">
                      <Text
                        className={`font-bold text-base ${
                          conversation.unreadCount > 0
                            ? 'text-primary-500'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {conversation.clientName}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </Text>
                    </View>

                    {/* Service/Booking ID */}
                    <Text className="text-xs mb-1 text-gray-500">
                      {conversation.service} • {conversation.bookingId}
                    </Text>

                    {/* Last Message */}
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`flex-1 text-sm ${
                          conversation.unreadCount > 0
                            ? 'text-gray-900 dark:text-white font-semibold'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                        numberOfLines={1}
                      >
                        {conversation.lastMessage}
                      </Text>

                      {/* Unread Badge */}
                      {conversation.unreadCount > 0 && (
                        <View className="ml-2 min-w-[24px] h-6 bg-primary-500 rounded-full items-center justify-center px-2">
                          <Text className="text-white text-xs font-bold">
                            {conversation.unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center py-20 px-6">
            <View className="w-24 h-24 bg-gray-100 dark:bg-[#1E293B] rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">💬</Text>
            </View>
            <Text className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-400">
              {searchQuery
                ? 'Try searching with different keywords'
                : 'Start chatting with your clients when they book your services'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}