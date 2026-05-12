import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { updateUser } from '@/src/store/slices/userSlice';
import { pickAndUploadProfilePicture } from '@/src/utils/uploadProfilePicture';
import {
  ArrowLeftIcon,
  CameraIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.user);
  const [uploading, setUploading] = useState(false);

  const handleChangePhoto = async () => {
    try {
      setUploading(true);
      const publicUrl = await pickAndUploadProfilePicture();
      dispatch(updateUser({ profileImage: publicUrl }));
    } catch (err: any) {
      if (err?.message !== 'cancelled') {
        Alert.alert('Upload failed', 'Could not update your profile photo. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <LinearGradient
        colors={['#F57C1F', '#E06A0F']}
        className="px-6 pt-4 pb-6"
      >
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeftIcon size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Edit Profile</Text>
        </View>

        {/* Avatar */}
        <View className="items-center">
          <View className="relative">
            {userData?.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                className="w-28 h-28 rounded-full bg-white/20"
                resizeMode="cover"
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-white/20 items-center justify-center">
                <UserCircleIcon size={64} color="rgba(255,255,255,0.8)" />
              </View>
            )}

            <TouchableOpacity
              onPress={handleChangePhoto}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg"
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#F57C1F" />
              ) : (
                <CameraIcon size={20} color="#F57C1F" />
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-white text-xl font-bold mt-4">
            {userData?.fullName || 'Provider'}
          </Text>
          <Text className="text-white/70 text-sm mt-0.5">
            {uploading ? 'Uploading photo…' : 'Tap the camera icon to change your photo'}
          </Text>
        </View>
      </LinearGradient>

      {/* Info */}
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm overflow-hidden mb-4">
          <InfoRow label="Full Name" value={userData?.fullName ?? '—'} />
          <View className="h-px bg-gray-100 dark:bg-[#334155]" />
          <InfoRow label="Email" value={userData?.email ?? '—'} />
          <View className="h-px bg-gray-100 dark:bg-[#334155]" />
          <InfoRow label="Phone" value={userData?.phone ?? '—'} />
          <View className="h-px bg-gray-100 dark:bg-[#334155]" />
          <InfoRow
            label="Member since"
            value={
              userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'
            }
          />
        </View>

        <TouchableOpacity
          onPress={handleChangePhoto}
          disabled={uploading}
          className="bg-primary-500 rounded-2xl py-4 items-center mt-2"
          activeOpacity={0.8}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-base">Change Profile Photo</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="px-4 py-3.5">
      <Text className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</Text>
      <Text className="text-base text-gray-900 dark:text-white font-medium">{value}</Text>
    </View>
  );
}
