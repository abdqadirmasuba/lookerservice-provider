// File: app/(business)/register/step5.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  PhotoIcon,
  RectangleGroupIcon,
  ClockIcon,
  TruckIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon as CheckCircleSolid } from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { registerBusiness } from '@/src/utils/business';
import {
  resetBusinessRegistration,
  DayHoursState,
} from '@/src/store/slices/businessRegistrationSlice';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
};

const DELIVERY_LABELS: Record<string, string> = {
  onsite: 'On-site',
  remote: 'Remote',
  both: 'Both (On-site & Remote)',
};

/** Convert Redux DayHoursState map → API business_hours payload */
function buildHoursPayload(
  hours: Record<string, DayHoursState>
): Record<string, { open: string; close: string } | 'closed'> {
  const payload: Record<string, { open: string; close: string } | 'closed'> = {};
  DAYS.forEach((day) => {
    const d = hours[day];
    if (!d) return;
    if (d.mode === 'closed') {
      payload[day] = 'closed';
    } else if (d.mode === 'working') {
      payload[day] = { open: d.open, close: d.close };
    }
    // 'fullday' → omit from payload (24/7)
  });
  return payload;
}

export default function BusinessStep5Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const reg = useSelector((state: RootState) => state.businessRegistration);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions');
      return;
    }

    if (!reg.business_name || !reg.business_description) {
      Alert.alert('Error', 'Business name and description are required');
      return;
    }
    if (!reg.latitude || !reg.longitude) {
      Alert.alert('Error', 'Business location is required');
      return;
    }
    if (!reg.service_delivery_type) {
      Alert.alert('Error', 'Service delivery type is required');
      return;
    }
    if (reg.group_ids.length === 0) {
      Alert.alert('Error', 'Please select at least one business group');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        business_name: reg.business_name,
        business_description: reg.business_description,
        service_delivery_type: reg.service_delivery_type,
        longitude: reg.longitude,
        latitude: reg.latitude,
        address: reg.address,
        city: reg.city,
        state_region: reg.state_region,
        country: reg.country,
        business_hours: buildHoursPayload(reg.business_hours),
        business_photos: reg.business_photos,
        group_ids: reg.group_ids,
      };

      await registerBusiness(payload);
      dispatch(resetBusinessRegistration());

      Alert.alert(
        'Success!',
        'Your business has been submitted for review. You will be notified once approved.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to register business. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (step: number) => {
    router.push(`/(business)/register/step${step}` as any);
  };

  const formatHoursSummary = () => {
    const h = reg.business_hours;
    if (!h || Object.keys(h).length === 0) return 'Not configured';
    const working = DAYS.filter((d) => h[d]?.mode === 'working').length;
    const fullday = DAYS.filter((d) => h[d]?.mode === 'fullday').length;
    const closed = DAYS.filter((d) => h[d]?.mode === 'closed').length;
    const parts: string[] = [];
    if (working > 0) parts.push(`${working} working`);
    if (fullday > 0) parts.push(`${fullday} 24/7`);
    if (closed > 0) parts.push(`${closed} closed`);
    return parts.join(' · ') || 'Not configured';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeftIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Register Business
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Step 5 of 5 — Review
            </Text>
          </View>
        </View>
        <View className="h-2 bg-gray-200 dark:bg-[#334155] rounded-full overflow-hidden">
          <View className="h-full w-full bg-primary-500 rounded-full" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6">
          {/* Step Icon */}
          <View className="items-center mb-6">
            <LinearGradient
              colors={['#F57C1F', '#E06A0F']}
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
            >
              <CheckCircleIcon size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Review & Submit
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-400 px-8">
              Please review your information before submitting
            </Text>
          </View>

          {/* Business Details */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <BuildingStorefrontIcon size={22} color="#F57C1F" />
                <Text className="text-base font-bold text-gray-900 dark:text-white ml-2">
                  Business Info
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit(1)}
                className="px-3 py-1 bg-gray-100 dark:bg-[#0F172A] rounded-lg"
              >
                <Text className="text-xs text-primary-500 font-semibold">Edit</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-3">
              <View>
                <Text className="text-xs text-gray-500 mb-1">Business Name</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {reg.business_name}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-1">Description</Text>
                <Text className="text-sm text-gray-900 dark:text-white" numberOfLines={3}>
                  {reg.business_description}
                </Text>
              </View>
            </View>
          </View>

          {/* Service Delivery Type */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <TruckIcon size={22} color="#F57C1F" />
                <Text className="text-base font-bold text-gray-900 dark:text-white ml-2">
                  Service Delivery
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit(1)}
                className="px-3 py-1 bg-gray-100 dark:bg-[#0F172A] rounded-lg"
              >
                <Text className="text-xs text-primary-500 font-semibold">Edit</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              {DELIVERY_LABELS[reg.service_delivery_type] || reg.service_delivery_type}
            </Text>
          </View>

          {/* Location */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <MapPinIcon size={22} color="#F57C1F" />
                <Text className="text-base font-bold text-gray-900 dark:text-white ml-2">
                  Location
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit(1)}
                className="px-3 py-1 bg-gray-100 dark:bg-[#0F172A] rounded-lg"
              >
                <Text className="text-xs text-primary-500 font-semibold">Edit</Text>
              </TouchableOpacity>
            </View>
            <View className="space-y-1">
              <Text className="text-sm text-gray-900 dark:text-white font-medium">
                {reg.address}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {reg.city}, {reg.state_region}
              </Text>
              <Text className="text-xs text-gray-500">{reg.country}</Text>
              {reg.latitude && reg.longitude && (
                <Text className="text-xs text-gray-400">
                  {reg.latitude.toFixed(5)}, {reg.longitude.toFixed(5)}
                </Text>
              )}
            </View>
          </View>

          {/* Business Hours */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <ClockIcon size={22} color="#F57C1F" />
                <Text className="text-base font-bold text-gray-900 dark:text-white ml-2">
                  Business Hours
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit(2)}
                className="px-3 py-1 bg-gray-100 dark:bg-[#0F172A] rounded-lg"
              >
                <Text className="text-xs text-primary-500 font-semibold">Edit</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {formatHoursSummary()}
            </Text>
            {/* Per-day breakdown */}
            <View className="mt-3 space-y-1">
              {DAYS.map((day) => {
                const d = reg.business_hours[day];
                if (!d) return null;
                return (
                  <View key={day} className="flex-row items-center">
                    <Text className="w-8 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {DAY_LABELS[day]}
                    </Text>
                    {d.mode === 'working' && (
                      <Text className="text-xs text-gray-900 dark:text-white ml-2">
                        {d.open} – {d.close}
                      </Text>
                    )}
                    {d.mode === 'closed' && (
                      <Text className="text-xs text-red-500 ml-2">Closed</Text>
                    )}
                    {d.mode === 'fullday' && (
                      <Text className="text-xs text-green-600 dark:text-green-400 ml-2">
                        24/7
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Photos */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <PhotoIcon size={22} color="#F57C1F" />
                <Text className="text-base font-bold text-gray-900 dark:text-white ml-2">
                  Photos
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit(3)}
                className="px-3 py-1 bg-gray-100 dark:bg-[#0F172A] rounded-lg"
              >
                <Text className="text-xs text-primary-500 font-semibold">Edit</Text>
              </TouchableOpacity>
            </View>
            {reg.business_photos.length > 0 ? (
              <View className="flex-row flex-wrap -mx-1">
                {reg.business_photos.map((photo, index) => (
                  <View key={index} className="w-1/4 p-1">
                    <Image
                      source={{ uri: photo }}
                      className="w-full aspect-square rounded-lg"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-sm text-gray-500">No photos added</Text>
            )}
          </View>

          {/* Groups */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <RectangleGroupIcon size={22} color="#F57C1F" />
                <Text className="text-base font-bold text-gray-900 dark:text-white ml-2">
                  Business Groups
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit(4)}
                className="px-3 py-1 bg-gray-100 dark:bg-[#0F172A] rounded-lg"
              >
                <Text className="text-xs text-primary-500 font-semibold">Edit</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {reg.group_ids.length}{' '}
              {reg.group_ids.length === 1 ? 'group' : 'groups'} selected
            </Text>
          </View>

          {/* Terms */}
          <TouchableOpacity
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            className="flex-row items-start bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]"
          >
            <View className="mr-3 mt-0.5">
              {agreedToTerms ? (
                <CheckCircleSolid size={24} color="#F57C1F" />
              ) : (
                <View className="w-6 h-6 border-2 border-gray-300 dark:border-[#334155] rounded-full" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-900 dark:text-white">
                I agree to the{' '}
                <Text className="text-primary-500 font-semibold">Terms and Conditions</Text>
                {' '}and{' '}
                <Text className="text-primary-500 font-semibold">Privacy Policy</Text>
              </Text>
            </View>
          </TouchableOpacity>

          {/* Info */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
              📋 Next Steps
            </Text>
            <Text className="text-blue-600 dark:text-blue-300 text-xs">
              After submission, your business will be reviewed by our team. You'll receive a
              notification once approved, typically within 24–48 hours.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        {isSubmitting ? (
          <View className="py-4 items-center">
            <ActivityIndicator size="large" color="#F57C1F" />
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              Submitting your business...
            </Text>
          </View>
        ) : (
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-4 rounded-xl items-center"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-bold">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!agreedToTerms}
              style={{ opacity: agreedToTerms ? 1 : 0.5 }}
              className="flex-1 bg-primary-500 py-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Submit Business</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}