// File: app/(settings)/notifications.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeftIcon,
  BellIcon,
  BellSlashIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  ChatBubbleLeftEllipsisIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
} from 'react-native-heroicons/outline';

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  value: boolean;
}

interface ChannelSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  value: boolean;
  color: string;
}

export default function NotificationSettingsScreen() {
  const router = useRouter();

  const [muteAll, setMuteAll] = useState(false);

  const [channels, setChannels] = useState<ChannelSetting[]>([
    {
      id: 'push',
      label: 'Push Notifications',
      description: 'Receive alerts on your device',
      icon: <BellIcon size={20} color="#F57C1F" />,
      value: true,
      color: '#F57C1F',
    },
    {
      id: 'sms',
      label: 'SMS Notifications',
      description: 'Receive text messages to your phone',
      icon: <DevicePhoneMobileIcon size={20} color="#3B82F6" />,
      value: false,
      color: '#3B82F6',
    },
    {
      id: 'email',
      label: 'Email Notifications',
      description: 'Receive updates to your email address',
      icon: <EnvelopeIcon size={20} color="#8B5CF6" />,
      value: true,
      color: '#8B5CF6',
    },
  ]);

  const [topics, setTopics] = useState<NotifSetting[]>([
    {
      id: 'service_requests',
      label: 'Service Requests',
      description: 'New and updated service requests',
      icon: <BriefcaseIcon size={20} color="#2DA9E9" />,
      value: true,
    },
    {
      id: 'bookings',
      label: 'Bookings',
      description: 'Booking confirmations and changes',
      icon: <CalendarDaysIcon size={20} color="#10B981" />,
      value: true,
    },
    {
      id: 'messages',
      label: 'Messages',
      description: 'New chat messages from clients',
      icon: <ChatBubbleLeftEllipsisIcon size={20} color="#6366F1" />,
      value: true,
    },
    {
      id: 'payments',
      label: 'Payments & Earnings',
      description: 'Payment received and payout updates',
      icon: <CurrencyDollarIcon size={20} color="#F59E0B" />,
      value: true,
    },
    {
      id: 'promotions',
      label: 'Promotions & Tips',
      description: 'Tips to grow your business',
      icon: <MegaphoneIcon size={20} color="#EC4899" />,
      value: false,
    },
  ]);

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value: !c.value } : c))
    );
  };

  const toggleTopic = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, value: !t.value } : t))
    );
  };

  const handleMuteAll = (val: boolean) => {
    setMuteAll(val);
    if (val) {
      setChannels((prev) => prev.map((c) => ({ ...c, value: false })));
    } else {
      // Restore defaults
      setChannels((prev) =>
        prev.map((c) => ({
          ...c,
          value: c.id === 'push' || c.id === 'email',
        }))
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white dark:bg-[#1E293B] border-b border-gray-100 dark:border-[#334155]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeftIcon size={22} color="#F57C1F" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Notification Settings
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            Manage how you receive alerts
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>

        {/* Mute All Toggle */}
        <View className="bg-white dark:bg-[#1E293B] rounded-2xl px-4 py-4 mb-4 border border-gray-100 dark:border-[#334155] flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${muteAll ? 'bg-red-100 dark:bg-red-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
              {muteAll
                ? <BellSlashIcon size={20} color="#EF4444" />
                : <BellIcon size={20} color="#F57C1F" />}
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {muteAll ? 'Notifications Muted' : 'Notifications Active'}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {muteAll
                  ? 'You will not receive any alerts'
                  : 'You are receiving notifications'}
              </Text>
            </View>
          </View>
          <Switch
            value={muteAll}
            onValueChange={handleMuteAll}
            trackColor={{ false: '#FED7AA', true: '#FECACA' }}
            thumbColor={muteAll ? '#EF4444' : '#F57C1F'}
          />
        </View>

        {/* Delivery Channels */}
        <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
          Delivery Channels
        </Text>
        <View className="bg-white dark:bg-[#1E293B] rounded-2xl mb-4 border border-gray-100 dark:border-[#334155] overflow-hidden">
          {channels.map((channel, idx) => (
            <View
              key={channel.id}
              className={`flex-row items-center px-4 py-3.5 ${idx < channels.length - 1 ? 'border-b border-gray-50 dark:border-[#334155]' : ''}`}
            >
              <View className="w-8 h-8 bg-gray-50 dark:bg-[#0F172A] rounded-lg items-center justify-center mr-3">
                {channel.icon}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {channel.label}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {channel.description}
                </Text>
              </View>
              <Switch
                value={channel.value && !muteAll}
                onValueChange={() => !muteAll && toggleChannel(channel.id)}
                disabled={muteAll}
                trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                thumbColor={channel.value && !muteAll ? '#F57C1F' : '#D1D5DB'}
              />
            </View>
          ))}
        </View>

        {/* Notification Topics */}
        <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
          Notification Topics
        </Text>
        <View className="bg-white dark:bg-[#1E293B] rounded-2xl mb-6 border border-gray-100 dark:border-[#334155] overflow-hidden">
          {topics.map((topic, idx) => (
            <View
              key={topic.id}
              className={`flex-row items-center px-4 py-3.5 ${idx < topics.length - 1 ? 'border-b border-gray-50 dark:border-[#334155]' : ''}`}
            >
              <View className="w-8 h-8 bg-gray-50 dark:bg-[#0F172A] rounded-lg items-center justify-center mr-3">
                {topic.icon}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {topic.label}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {topic.description}
                </Text>
              </View>
              <Switch
                value={topic.value && !muteAll}
                onValueChange={() => !muteAll && toggleTopic(topic.id)}
                disabled={muteAll}
                trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                thumbColor={topic.value && !muteAll ? '#F57C1F' : '#D1D5DB'}
              />
            </View>
          ))}
        </View>

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
