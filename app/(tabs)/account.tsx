import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import {
  UserCircleIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  BellIcon,
  PaintBrushIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  PencilIcon,
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
} from 'react-native-heroicons/outline';

export default function AccountScreen() {
  const router = useRouter();

  // Get user data from Redux
  const userData = useSelector((state: RootState) => state.user.user);
  const providerBusinesses = useSelector((state: RootState) => state.auth.providerBusinesses);
  const hasMultipleBusinesses = providerBusinesses && providerBusinesses.length > 1;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#F57C1F', '#E06A0F']}
          className="px-6 pt-6 pb-8 rounded-b-3xl"
        >
          <View className="items-center">
            {/* Profile Image */}
            <View className="relative mb-4">
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center">
                <Text className="text-primary-500 text-4xl font-bold">
                  {userData?.fullName.charAt(0)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/(settings)/profile')}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full items-center justify-center shadow-lg"
              >
                <PencilIcon size={16} color="#F57C1F" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <Text className="text-white text-2xl font-bold mb-1">{userData?.fullName || 'Provider'}</Text>
            <Text className="text-white/80 text-sm mb-1">{userData?.email || ''}</Text>
            <Text className="text-white/70 text-xs">Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}</Text>

            {/* Stats */}
            <View className="flex-row mt-6 w-full">
              <View className="flex-1 items-center">
                <View className="flex-row items-center mb-1">
                  <StarIcon size={16} color="#FFF" />
                  <Text className="text-white text-xl font-bold ml-1">4.8</Text>
                </View>
                <Text className="text-white/70 text-xs">Rating</Text>
              </View>
              <View className="flex-1 items-center border-x border-white/30">
                <View className="flex-row items-center mb-1">
                  <ChartBarIcon size={16} color="#FFF" />
                  <Text className="text-white text-xl font-bold ml-1">0</Text>
                </View>
                <Text className="text-white/70 text-xs">Jobs Done</Text>
              </View>
              <View className="flex-1 items-center">
                <View className="flex-row items-center mb-1">
                  <CurrencyDollarIcon size={16} color="#FFF" />
                  <Text className="text-white text-xl font-bold ml-1">0</Text>
                </View>
                <Text className="text-white/70 text-xs">Earnings</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <View className="px-6 mt-6">
          {/* Business Management */}
          <Text className="text-xs font-bold mb-3 text-gray-500 dark:text-gray-400 uppercase">
            Business
          </Text>
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl mb-6 shadow-sm overflow-hidden">
            {/* Switch Business - Show only if multiple businesses */}
            {hasMultipleBusinesses && (
              <>
                <MenuItem
                  icon={<ArrowsRightLeftIcon size={24} color="#F57C1F" />}
                  title="Switch Active Business"
                  subtitle="Change which business you're managing"
                  onPress={() => router.push('/(business)/switch-business')}
                />
                <Divider />
              </>
            )}
            <MenuItem
              icon={<BuildingStorefrontIcon size={24} color="#F57C1F" />}
              title="My Businesses"
              subtitle="Manage your registered businesses"
              onPress={() => router.push('/(business)/list')}
            />
            <Divider />
            <MenuItem
              icon={<ChartBarIcon size={24} color="#F57C1F" />}
              title="Analytics"
              subtitle="View business performance"
              onPress={() => router.push('/(business)/1/analytics')}
            />
            <Divider />
            <MenuItem
              icon={<CurrencyDollarIcon size={24} color="#F57C1F" />}
              title="Earnings"
              subtitle="Track your income and payouts"
              onPress={() => router.push('/(earnings)/dashboard')}
              showBorder={false}
            />
          </View>

          {/* Account Settings */}
          <Text className="text-xs font-bold mb-3 text-gray-500 dark:text-gray-400 uppercase">
            Account Settings
          </Text>
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl mb-6 shadow-sm overflow-hidden">
            <MenuItem
              icon={<UserCircleIcon size={24} color="#F57C1F" />}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => router.push('/(settings)/profile')}
            />
            <Divider />
            <MenuItem
              icon={<BellIcon size={24} color="#F57C1F" />}
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => router.push('/(settings)/notifications')}
            />
            <Divider />
            <MenuItem
              icon={<PaintBrushIcon size={24} color="#F57C1F" />}
              title="Theme"
              subtitle="Choose your app appearance"
              onPress={() => router.push('/(settings)/theme')}
            />
            <Divider />
            <MenuItem
              icon={<Cog6ToothIcon size={24} color="#F57C1F" />}
              title="App Settings"
              subtitle="General app preferences"
              onPress={() => router.push('/(settings)')}
              showBorder={false}
            />
          </View>

          {/* Support */}
          <Text className="text-xs font-bold mb-3 text-gray-500 dark:text-gray-400 uppercase">
            Support & Legal
          </Text>
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl mb-6 shadow-sm overflow-hidden">
            <MenuItem
              icon={<QuestionMarkCircleIcon size={24} color="#F57C1F" />}
              title="Help & Support"
              subtitle="Get help with your account"
              onPress={() => router.push('/(settings)/help')}
            />
            <Divider />
            <MenuItem
              icon={<ShieldCheckIcon size={24} color="#F57C1F" />}
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={() => router.push('/(settings)/change-password')}
              showBorder={false}
            />
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-8 shadow-sm flex-row items-center"
          >
            <View className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full items-center justify-center mr-4">
              <ArrowRightOnRectangleIcon size={24} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text className="text-red-500 font-bold text-base">Logout</Text>
              <Text className="text-xs text-gray-500">
                Sign out of your account
              </Text>
            </View>
          </TouchableOpacity>

          {/* App Version */}
          <Text className="text-center text-xs mb-8 text-gray-400 dark:text-gray-500">
            LookerService Provider v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Menu Item Component
function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  showBorder = true,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  showBorder?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-4 ${showBorder ? 'border-b border-gray-100 dark:border-[#334155]' : ''}`}
      activeOpacity={0.7}
    >
      <View className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-bold text-base mb-0.5 text-gray-900 dark:text-white">
          {title}
        </Text>
        <Text className="text-xs text-gray-500">
          {subtitle}
        </Text>
      </View>
      <ChevronRightIcon size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

// Divider Component
function Divider() {
  return <View className="h-px bg-gray-100 dark:bg-[#334155]" />;
}