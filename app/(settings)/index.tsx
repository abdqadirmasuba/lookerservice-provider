import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useDispatch } from 'react-redux';
import { logout } from '@/src/store/slices/authSlice';
import { callLogoutApi } from '@/src/utils/apiRequest';
import { removeRefreshToken } from '@/src/utils/refreshTokenStorage';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
  BellIcon,
  LockClosedIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
} from 'react-native-heroicons/outline';

interface SettingItem {
  id: string;
  label: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'nav' | 'toggle' | 'danger';
  value?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await callLogoutApi();
            await removeRefreshToken();
            dispatch(logout());
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Edit Profile',
          subtitle: 'Update your name, photo and bio',
          icon: <UserCircleIcon size={20} color="#F57C1F" />,
          type: 'nav',
        },
        {
          id: 'phone',
          label: 'Phone Number',
          subtitle: '+256 700 000 000',
          icon: <DevicePhoneMobileIcon size={20} color="#3B82F6" />,
          type: 'nav',
        },
        {
          id: 'password',
          label: 'Change Password',
          subtitle: 'Last changed 30 days ago',
          icon: <LockClosedIcon size={20} color="#8B5CF6" />,
          type: 'nav',
        },
        {
          id: 'payment',
          label: 'Payment Methods',
          subtitle: 'Mobile money & bank accounts',
          icon: <CreditCardIcon size={20} color="#10B981" />,
          type: 'nav',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          subtitle: 'Push, SMS and email preferences',
          icon: <BellIcon size={20} color="#F59E0B" />,
          type: 'nav',
        },
        {
          id: 'dark',
          label: 'Dark Mode',
          subtitle: 'Switch app appearance',
          icon: <MoonIcon size={20} color="#6366F1" />,
          type: 'toggle',
          value: darkMode,
        },
        {
          id: 'biometric',
          label: 'Biometric Login',
          subtitle: 'Use fingerprint to sign in',
          icon: <ShieldCheckIcon size={20} color="#14B8A6" />,
          type: 'toggle',
          value: biometric,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          label: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          icon: <QuestionMarkCircleIcon size={20} color="#64748B" />,
          type: 'nav',
        },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          label: 'Sign Out',
          icon: <ArrowRightOnRectangleIcon size={20} color="#EF4444" />,
          type: 'danger',
        },
      ],
    },
  ];

  const handleToggle = (id: string) => {
    if (id === 'notifications') setNotifications((v) => !v);
    if (id === 'dark') setDarkMode((v) => !v);
    if (id === 'biometric') setBiometric((v) => !v);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeftIcon size={22} color="#F57C1F" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 dark:text-white">Settings</Text>
      </View>

      {/* Profile card */}
      <View className="mx-4 mt-4 bg-white dark:bg-slate-800 rounded-2xl p-4 flex-row items-center border border-gray-100 dark:border-slate-700">
        <View className="w-14 h-14 bg-orange-500 rounded-full items-center justify-center mr-3">
          <Text className="text-white font-bold text-lg">JP</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-slate-800 dark:text-white">John Provider</Text>
          <Text className="text-sm text-slate-400">john.provider@email.com</Text>
        </View>
        <TouchableOpacity className="bg-orange-50 px-3 py-1.5 rounded-lg">
          <Text className="text-orange-500 text-xs font-semibold">Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 mt-4 px-4" showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.title} className="mb-4">
            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
              {section.title}
            </Text>
            <View className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    if (item.type === 'toggle') return;
                    if (item.id === 'logout') {
                      handleLogout();
                    } else if (item.id === 'notifications') {
                      router.push('/(settings)/notifications');
                    } else {
                      handleToggle(item.id);
                    }
                  }}
                  activeOpacity={item.type === 'toggle' ? 1 : 0.7}
                  className={`flex-row items-center px-4 py-3.5 ${idx < section.items.length - 1 ? 'border-b border-gray-50 dark:border-slate-700' : ''}`}
                >
                  <View className="w-8 h-8 bg-gray-50 dark:bg-slate-700 rounded-lg items-center justify-center mr-3">
                    {item.icon}
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm font-medium ${item.type === 'danger' ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                      {item.label}
                    </Text>
                    {item.subtitle && (
                      <Text className="text-xs text-slate-400 mt-0.5">{item.subtitle}</Text>
                    )}
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value}
                      onValueChange={() => handleToggle(item.id)}
                      trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                      thumbColor={item.value ? '#F57C1F' : '#fff'}
                    />
                  ) : item.type === 'nav' ? (
                    <ChevronRightIcon size={16} color="#CBD5E1" />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
