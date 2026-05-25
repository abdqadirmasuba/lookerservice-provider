import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store';
import { logout } from '@/src/store/slices/authSlice';
import { callLogoutApi } from '@/src/utils/apiRequest';
import { removeRefreshToken } from '@/src/utils/refreshTokenStorage';
import {
  UserCircleIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  PencilIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ArrowRightOnRectangleIcon,
} from 'react-native-heroicons/outline';

export default function AccountScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get user data from Redux
  const userData = useSelector((state: RootState) => state.user.user);
  const providerBusinesses = useSelector((state: RootState) => state.auth.providerBusinesses);
  const activeBusinessId = useSelector((state: RootState) => state.auth.activeBusinessId);
  const providerTier = useSelector((state: RootState) => state.auth.providerTier);
  const hasMultipleBusinesses = providerTier === 'pro' && providerBusinesses && providerBusinesses.length > 1;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
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
              {userData?.profileImage ? (
                <Image
                  source={{ uri: userData.profileImage }}
                  className="w-24 h-24 rounded-full bg-white/20"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-24 h-24 bg-white rounded-full items-center justify-center">
                  <Text className="text-primary-500 text-4xl font-bold">
                    {userData?.fullName.charAt(0)}
                  </Text>
                </View>
              )}
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
              {/* Tier */}
              <View className="flex-1 items-center">
                <View className="flex-row items-center mb-1">
                  <SparklesIcon size={15} color="#FFF" />
                  <Text className="text-white text-base font-bold ml-1 capitalize">
                    {providerTier}
                  </Text>
                </View>
                <Text className="text-white/70 text-xs">Plan</Text>
              </View>
              {/* Businesses */}
              <View className="flex-1 items-center border-x border-white/30">
                <View className="flex-row items-center mb-1">
                  <BuildingStorefrontIcon size={15} color="#FFF" />
                  <Text className="text-white text-xl font-bold ml-1">
                    {providerBusinesses?.length ?? 0}
                  </Text>
                </View>
                <Text className="text-white/70 text-xs">Businesses</Text>
              </View>
              {/* Verified */}
              <View className="flex-1 items-center">
                <View className="flex-row items-center mb-1">
                  <CheckBadgeIcon size={15} color={userData?.isEmailVerified ? '#86EFAC' : '#FCA5A5'} />
                  <Text className="text-white text-base font-bold ml-1">
                    {userData?.isEmailVerified ? 'Yes' : 'No'}
                  </Text>
                </View>
                <Text className="text-white/70 text-xs">Verified</Text>
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
            {/* Switch Business - Pro tier only, when multiple businesses exist */}
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
              title={providerTier === 'pro' ? 'My Businesses' : 'Manage Business'}
              subtitle={providerTier === 'pro' ? 'Manage your registered businesses' : 'View and edit your business'}
              onPress={() =>
                providerTier === 'pro'
                  ? router.push('/(business)/list')
                  : router.push(`/(business)/${activeBusinessId}/profile`)
              }
              showBorder={false}
            />
          </View>

          {/* Preferences */}
          <Text className="text-xs font-bold mb-3 text-gray-500 dark:text-gray-400 uppercase">
            Preferences
          </Text>
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl mb-6 shadow-sm overflow-hidden">
            {/* <MenuItem
              icon={<UserCircleIcon size={24} color="#F57C1F" />}
              title="Account Settings"
              subtitle="Edit profile and change password"
              onPress={() => router.push('/(settings)/profile')}
            /> */}
            {/* <Divider /> */}
            {/* <MenuItem
              icon={<Cog6ToothIcon size={24} color="#F57C1F" />}
              title="App Settings"
              subtitle="Change theme appearance"
              onPress={() => router.push('/(settings)')}
              showBorder={false}
            /> */}
          </View>

          {/* Logout */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl mb-6 shadow-sm overflow-hidden">
            <MenuItem
              icon={<ArrowRightOnRectangleIcon size={24} color="#EF4444" />}
              title="Logout"
              onPress={handleLogout}
              showBorder={false}
            />
          </View>

          <View className="mb-6 px-1">
            <TouchableOpacity
              onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.lookerservice.clientapp&pcampaignid=web_share')}
              className="bg-sky-100 dark:bg-slate-700 rounded-2xl p-4"
              activeOpacity={0.8}
            >
              <Text className="font-semibold text-slate-900 dark:text-white text-base">
                Get the client app. LookerService
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                Open the LookerService client app on Google Play.
              </Text>
            </TouchableOpacity>
          </View>

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
  subtitle?: string;
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
        {subtitle ? (
          <Text className="text-xs text-gray-500">
            {subtitle}
          </Text>
        ) : null}
      </View>
      <ChevronRightIcon size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

// Divider Component
function Divider() {
  return <View className="h-px bg-gray-100 dark:bg-[#334155]" />;
}