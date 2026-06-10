import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeftIcon, MagnifyingGlassIcon, ChatBubbleLeftEllipsisIcon } from 'react-native-heroicons/outline';

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Mukisa sam',
    lastMessage: 'Hi, I wanted to confirm the appointment for tomorrow.',
    time: '10:32 AM',
    unread: 2,
    avatar: 'JD',
  },
  {
    id: '2',
    name: 'Sarah Kato',
    lastMessage: 'Thank you! The work was excellent.',
    time: 'Yesterday',
    unread: 0,
    avatar: 'SK',
  },
  {
    id: '3',
    name: 'Moses Otieno',
    lastMessage: 'Can you give me a quote for painting 3 rooms?',
    time: 'Yesterday',
    unread: 1,
    avatar: 'MO',
  },
  {
    id: '4',
    name: 'Grace Namuli',
    lastMessage: 'What time will you arrive on Friday?',
    time: 'Mon',
    unread: 0,
    avatar: 'GN',
  },
  {
    id: '5',
    name: 'David Ssempa',
    lastMessage: 'Please bring the extra tools.',
    time: 'Sun',
    unread: 0,
    avatar: 'DS',
  },
];

const AVATAR_COLORS = ['#F57C1F', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444'];

export default function MessagesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeftIcon size={22} color="#F57C1F" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 dark:text-white flex-1">Messages</Text>
        <View className="w-6 h-6 bg-orange-500 rounded-full items-center justify-center">
          <Text className="text-white text-xs font-bold">3</Text>
        </View>
      </View>

      {/* Search */}
      <View className="mx-4 mt-3 mb-2 flex-row items-center bg-white dark:bg-slate-800 rounded-xl px-3 border border-gray-200 dark:border-slate-700">
        <MagnifyingGlassIcon size={18} color="#94A3B8" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search conversations..."
          placeholderTextColor="#94A3B8"
          className="flex-1 py-3 pl-2 text-sm text-slate-700 dark:text-white"
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filtered.map((conv, i) => (
          <TouchableOpacity
            key={conv.id}
            className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-800 border-b border-gray-50 dark:border-slate-700"
            activeOpacity={0.7}
          >
            {/* Avatar */}
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
            >
              <Text className="text-white font-bold text-sm">{conv.avatar}</Text>
            </View>

            {/* Content */}
            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-semibold text-slate-800 dark:text-white">{conv.name}</Text>
                <Text className="text-xs text-slate-400">{conv.time}</Text>
              </View>
              <Text
                className={`text-xs mt-0.5 ${conv.unread > 0 ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}`}
                numberOfLines={1}
              >
                {conv.lastMessage}
              </Text>
            </View>

            {/* Unread badge */}
            {conv.unread > 0 && (
              <View className="ml-2 w-5 h-5 bg-orange-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">{conv.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View className="items-center py-16">
            <ChatBubbleLeftEllipsisIcon size={48} color="#CBD5E1" />
            <Text className="text-slate-400 mt-3 text-sm">No conversations found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
