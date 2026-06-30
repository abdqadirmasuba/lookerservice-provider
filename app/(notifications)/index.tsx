// File: app/(notifications)/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { apiRequests } from '@/src/utils/apiRequest';
import {
  markOneRead,
  markAllRead,
  removeNotification,
  clearAll,
  setNotifications,
  setUnreadCount,
  Notification,
} from '@/src/store/slices/notificationSlice';
import {
  ArrowLeftIcon,
  BellSlashIcon,
  TrashIcon,
  ClockIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
} from 'react-native-heroicons/outline';

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getNotificationIcon(type: string, source: string) {
  if (source === 'service_request') return <BriefcaseIcon size={22} color="#2DA9E9" />;
  switch (type) {
    case 'success': return <CheckCircleIcon size={22} color="#10B981" />;
    case 'warning': return <ExclamationTriangleIcon size={22} color="#F59E0B" />;
    case 'error': return <ExclamationTriangleIcon size={22} color="#EF4444" />;
    case 'payment': return <CurrencyDollarIcon size={22} color="#10B981" />;
    case 'message': return <ChatBubbleLeftEllipsisIcon size={22} color="#8B5CF6" />;
    case 'info':
    default: return <InformationCircleIcon size={22} color="#6B7280" />;
  }
}

function getIconBg(type: string, source: string): string {
  if (source === 'service_request') return 'bg-blue-100 dark:bg-blue-900/30';
  switch (type) {
    case 'success': return 'bg-green-100 dark:bg-green-900/30';
    case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30';
    case 'error': return 'bg-red-100 dark:bg-red-900/30';
    case 'payment': return 'bg-emerald-100 dark:bg-emerald-900/30';
    case 'message': return 'bg-purple-100 dark:bg-purple-900/30';
    default: return 'bg-gray-100 dark:bg-gray-800';
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const [unreadRes, countRes] = await Promise.all([
        apiRequests.get('/notifications'),
        apiRequests.get('/notifications/count'),
      ]);
      if (unreadRes.data.success) {
        dispatch(setNotifications(unreadRes.data.data));
      }
      if (countRes.data.success) {
        dispatch(setUnreadCount(countRes.data.data.unread_count));
      }
    } catch (error: any) {
      console.error('Notifications fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notif: Notification) => {
    if (notif.is_read) return;
    try {
      await apiRequests.patch(`/notifications/${notif.id}/read`);
      dispatch(markOneRead(notif.id));
    } catch (error: any) {
      console.error('Mark read error:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiRequests.post('/notifications/mark-all-read');
      dispatch(markAllRead());
    } catch (error: any) {
      console.error('Mark all read error:', error);
    }
  };

  const handleClearOne = async (id: string) => {
    try {
      await apiRequests.delete(`/notifications/${id}`);
      dispatch(removeNotification(id));
    } catch (error: any) {
      console.error('Clear notification error:', error);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiRequests.delete('/notifications');
              dispatch(clearAll());
            } catch (error: any) {
              console.error('Clear all error:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-4 pt-4 pb-3 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
              <ArrowLeftIcon size={22} color="#6B7280" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount} unread
                </Text>
              )}
            </View>
          </View>
          <View className="flex-row items-center" style={{ gap: 8 }}>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={handleMarkAllRead}
                className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
              >
                <Text className="text-primary-500 font-semibold text-xs">Mark all read</Text>
              </TouchableOpacity>
            )}
            {notifications.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                <TrashIcon size={18} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {isLoading && notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F57C1F" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
          }
        >
          <View className="px-4 py-4">
            {notifications.length === 0 ? (
              <View className="items-center justify-center py-20">
                <View className="w-20 h-20 bg-gray-100 dark:bg-[#1E293B] rounded-full items-center justify-center mb-4">
                  <BellSlashIcon size={36} color="#9CA3AF" />
                </View>
                <Text className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
                  All caught up!
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 text-center px-8">
                  You have no unread notifications right now.
                </Text>
              </View>
            ) : (
              notifications.map((notif) => (
                <TouchableOpacity
                  key={notif.id}
                  onPress={() => handleMarkAsRead(notif)}
                  activeOpacity={0.75}
                  className={`mb-3 rounded-2xl border overflow-hidden ${
                    notif.is_read
                      ? 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-[#334155]'
                      : 'bg-orange-50 dark:bg-[#1E293B] border-orange-200 dark:border-orange-800/40'
                  }`}
                >
                  <View className="flex-row p-4">
                    {!notif.is_read && (
                      <View className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
                    )}
                    <View
                      className={`w-11 h-11 rounded-full items-center justify-center mr-3 flex-shrink-0 ${getIconBg(notif.type, notif.source)}`}
                    >
                      {getNotificationIcon(notif.type, notif.source)}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between mb-0.5">
                        <Text
                          className="text-sm font-bold text-gray-900 dark:text-white flex-1 mr-2"
                          numberOfLines={1}
                        >
                          {notif.title}
                        </Text>
                        {!notif.is_read && (
                          <View className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                        )}
                      </View>
                      <Text
                        className="text-xs text-gray-600 dark:text-gray-400 leading-4 mb-2"
                        numberOfLines={2}
                      >
                        {notif.message}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <ClockIcon size={12} color="#9CA3AF" />
                          <Text className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                            {timeAgo(notif.created_at)}
                          </Text>
                        </View>
                        <View className="flex-row items-center" style={{ gap: 8 }}>
                          <View className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            <Text className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {notif.source.replace(/_/g, ' ')}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => handleClearOne(notif.id)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <TrashIcon size={14} color="#9CA3AF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
          <View className="h-8" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
