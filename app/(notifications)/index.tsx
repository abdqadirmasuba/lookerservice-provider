// File: app/(notifications)/index.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from 'react-native-heroicons/outline';

interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'system' | 'alert';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock notifications data - replace with API call
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'New Booking Request',
      message: 'You have a new booking request from John Doe for Plumbing Service.',
      time: '5 mins ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'You received UGX 150,000 for booking #BK12345.',
      time: '1 hour ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'alert',
      title: 'Service Review',
      message: 'Jane Smith left a 5-star review for your service.',
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: '4',
      type: 'system',
      title: 'Profile Update',
      message: 'Your business profile has been approved.',
      time: '1 day ago',
      isRead: true,
    },
    {
      id: '5',
      type: 'booking',
      title: 'Booking Cancelled',
      message: 'Booking #BK12340 has been cancelled by the client.',
      time: '2 days ago',
      isRead: true,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Fetch notifications from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <ClockIcon size={24} color="#2DA9E9" />;
      case 'payment':
        return <CheckCircleIcon size={24} color="#10B981" />;
      case 'alert':
        return <ExclamationTriangleIcon size={24} color="#F59E0B" />;
      case 'system':
        return <InformationCircleIcon size={24} color="#6B7280" />;
      default:
        return <BellIcon size={24} color="#6B7280" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeftIcon size={24} color="#6B7280" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {unreadCount} unread
                </Text>
              )}
            </View>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
            >
              <Text className="text-primary-500 font-semibold text-sm">
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F57C1F"
          />
        }
      >
        <View className="px-6 py-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => markAsRead(notification.id)}
                className={`mb-3 rounded-2xl p-4 border ${
                  notification.isRead
                    ? 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-[#334155]'
                    : 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                }`}
              >
                <View className="flex-row">
                  <View className="w-12 h-12 bg-gray-100 dark:bg-[#0F172A] rounded-full items-center justify-center mr-3">
                    {getNotificationIcon(notification.type)}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between mb-1">
                      <Text
                        className={`text-base font-bold flex-1 ${
                          notification.isRead
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {notification.title}
                      </Text>
                      {!notification.isRead && (
                        <View className="w-2 h-2 bg-primary-500 rounded-full ml-2 mt-1.5" />
                      )}
                    </View>
                    <Text
                      className={`text-sm mb-2 ${
                        notification.isRead
                          ? 'text-gray-600 dark:text-gray-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {notification.message}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-500">
                      {notification.time}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center justify-center py-20">
              <BellIcon size={64} color="#9CA3AF" />
              <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
                No notifications yet
              </Text>
              <Text className="text-gray-500 dark:text-gray-500 text-sm text-center mt-2 px-8">
                We'll notify you when something important happens
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
