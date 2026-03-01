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
  TagIcon,
  ClockIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon as CheckCircleSolid } from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { registerBusiness } from '@/src/utils/business';
import { resetBusinessRegistration } from '@/src/store/slices/businessRegistrationSlice';

export default function BusinessStep5Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const businessRegistration = useSelector(
    (state: RootState) => state.businessRegistration
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions');
      return;
    }

    // Validate required fields
    if (!businessRegistration.business_name || !businessRegistration.business_description) {
      Alert.alert('Error', 'Business name and description are required');
      return;
    }

    if (!businessRegistration.latitude || !businessRegistration.longitude) {
      Alert.alert('Error', 'Business location is required');
      return;
    }

    if (businessRegistration.categories.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const registrationData = {
        business_name: businessRegistration.business_name,
        business_description: businessRegistration.business_description,
        longitude: businessRegistration.longitude,
        latitude: businessRegistration.latitude,
        address: businessRegistration.address,
        city: businessRegistration.city,
        state_region: businessRegistration.state_region,
        country: businessRegistration.country,
        postal_code: businessRegistration.postal_code,
        business_hours: businessRegistration.business_hours,
        business_photos: businessRegistration.business_photos,
        category_ids: businessRegistration.categories,
      };

      // Submit to API
      await registerBusiness(registrationData);

      // Reset registration state
      dispatch(resetBusinessRegistration());

      setIsSubmitting(false);

      Alert.alert(
        'Success!',
        'Your business has been submitted for review. You will be notified once approved.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      setIsSubmitting(false);
      Alert.alert(
        'Error',
        error.message || 'Failed to register business. Please try again.'
      );
    }
  };

  const handleEdit = (step: number) => {
    router.push(`/(business)/register/step${step}` as any);
  };

  const handleBack = () => {
    router.back();
  };

  const formatBusinessHours = () => {
    const hours = businessRegistration.business_hours;
    if (!hours || Object.keys(hours).length === 0) {
      return 'Not set';
    }
    const count = Object.keys(hours).length;
    return `${count} ${count === 1 ? 'day' : 'days'} configured`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <ArrowLeftIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Register Business
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Step 5 of 5 - Review
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
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
                <BuildingStorefrontIcon size={24} color="#F57C1F" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
                  Business Information
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
                  {businessRegistration.business_name}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-1">Description</Text>
                <Text className="text-sm text-gray-900 dark:text-white">
                  {businessRegistration.business_description}
                </Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <MapPinIcon size={24} color="#F57C1F" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
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

            <View className="space-y-2">
              <Text className="text-sm text-gray-900 dark:text-white font-medium">
                {businessRegistration.address}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {businessRegistration.city}, {businessRegistration.state_region}
              </Text>
              <Text className="text-xs text-gray-500">
                {businessRegistration.country} {businessRegistration.postal_code && `• ${businessRegistration.postal_code}`}
              </Text>
            </View>
          </View>

          {/* Business Hours */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <ClockIcon size={24} color="#F57C1F" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
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
              {formatBusinessHours()}
            </Text>
          </View>

          {/* Business Photos */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <PhotoIcon size={24} color="#F57C1F" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
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

            {businessRegistration.business_photos.length > 0 ? (
              <View className="flex-row flex-wrap -mx-1">
                {businessRegistration.business_photos.map((photo, index) => (
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

          {/* Categories */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <TagIcon size={24} color="#F57C1F" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
                  Categories
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
              {businessRegistration.categories.length} {businessRegistration.categories.length === 1 ? 'category' : 'categories'} selected
            </Text>
          </View>

          {/* Terms and Conditions */}
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

          {/* Info Box */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
              📋 Next Steps
            </Text>
            <Text className="text-blue-600 dark:text-blue-300 text-xs">
              After submission, your business will be reviewed by our team. You'll receive a notification once approved, typically within 24-48 hours.
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
              onPress={handleBack}
              className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-4 rounded-xl items-center"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-bold">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 bg-primary-500 py-4 rounded-xl items-center"
              disabled={!agreedToTerms}
              style={{ opacity: agreedToTerms ? 1 : 0.5 }}
            >
              <Text className="text-white font-bold">Submit Business</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}