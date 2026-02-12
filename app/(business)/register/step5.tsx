// File: app/(business)/register/step5.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
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
  WrenchScrewdriverIcon,
  PencilIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon as CheckCircleSolid } from 'react-native-heroicons/solid';

export default function BusinessStep5Screen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Mock data - would come from previous steps
  const businessData = {
    name: 'Doe Plumbing Services',
    phone: '+256 701 234 567',
    email: 'info@doeplumbing.com',
    description: 'Professional plumbing services with 10+ years of experience. We handle all types of plumbing issues from repairs to installations.',
    address: 'Plot 123, Main Street',
    city: 'Kampala',
    district: 'Kampala',
    region: 'Central',
    photos: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
    ],
    services: [
      {
        id: '1',
        name: 'Pipe Repair',
        price: '50000',
        priceType: 'fixed',
        categories: ['Plumbing', 'Repairs'],
      },
      {
        id: '2',
        name: 'Bathroom Installation',
        price: '150000',
        priceType: 'hourly',
        categories: ['Plumbing', 'Installation'],
      },
      {
        id: '3',
        name: 'Emergency Services',
        price: '0',
        priceType: 'negotiable',
        categories: ['Plumbing', 'Repairs', 'Maintenance'],
      },
    ],
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);

    // TODO: Submit to API
    setTimeout(() => {
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
    }, 2000);
  };

  const handleEdit = (step: number) => {
    router.push(`/(business)/register/step${step}` as any);
  };

  const getPriceDisplay = (service: any) => {
    if (service.priceType === 'negotiable') return 'Negotiable';
    if (service.priceType === 'hourly') return `UGX ${service.price}/hr`;
    return `UGX ${service.price}`;
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
                  Business Details
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit(1)}
                className="w-8 h-8 bg-gray-100 dark:bg-[#0F172A] rounded-full items-center justify-center"
              >
                <PencilIcon size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="space-y-3">
              <DetailRow label="Name" value={businessData.name} />
              <DetailRow label="Phone" value={businessData.phone} />
              <DetailRow label="Email" value={businessData.email || 'Not provided'} />
              <View>
                <Text className="text-xs text-gray-500 mb-1">Description</Text>
                <Text className="text-sm text-gray-900 dark:text-white">
                  {businessData.description}
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
                onPress={() => handleEdit(2)}
                className="w-8 h-8 bg-gray-100 dark:bg-[#0F172A] rounded-full items-center justify-center"
              >
                <PencilIcon size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="space-y-3">
              <DetailRow label="Address" value={businessData.address} />
              <DetailRow label="City" value={businessData.city} />
              <DetailRow label="District" value={businessData.district} />
              <DetailRow label="Region" value={businessData.region} />
            </View>
          </View>

          {/* Photos */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <PhotoIcon size={24} color="#F57C1F" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
                  Photos ({businessData.photos.length})
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit(3)}
                className="w-8 h-8 bg-gray-100 dark:bg-[#0F172A] rounded-full items-center justify-center"
              >
                <PencilIcon size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
              {businessData.photos.map((photo, index) => (
                <View key={index} className="w-32 h-32 mx-2 rounded-xl overflow-hidden relative">
                  <Image source={{ uri: photo }} className="w-full h-full" resizeMode="cover" />
                  {index === 0 && (
                    <View className="absolute bottom-2 left-2 bg-primary-500 px-2 py-1 rounded">
                      <Text className="text-white text-xs font-bold">Primary</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Services */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <WrenchScrewdriverIcon size={24} color="#F57C1F" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
                  Services ({businessData.services.length})
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEdit(4)}
                className="w-8 h-8 bg-gray-100 dark:bg-[#0F172A] rounded-full items-center justify-center"
              >
                <PencilIcon size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="space-y-3">
              {businessData.services.map((service, index) => (
                <View
                  key={service.id}
                  className={`pb-3 ${
                    index < businessData.services.length - 1
                      ? 'border-b border-gray-200 dark:border-[#334155]'
                      : ''
                  }`}
                >
                  <Text className="font-bold text-gray-900 dark:text-white mb-1">
                    {service.name}
                  </Text>
                  <Text className="text-primary-500 font-semibold text-sm mb-2">
                    {getPriceDisplay(service)}
                  </Text>
                  <View className="flex-row flex-wrap">
                    {service.categories.map((cat) => (
                      <View
                        key={cat}
                        className="bg-gray-100 dark:bg-[#0F172A] px-2 py-1 rounded-lg mr-2 mb-1"
                      >
                        <Text className="text-xs text-gray-600 dark:text-gray-400">{cat}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Terms Agreement */}
          <TouchableOpacity
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            className="flex-row items-start mb-6"
          >
            <View className="mr-3 mt-0.5">
              {agreedToTerms ? (
                <CheckCircleSolid size={24} color="#F57C1F" />
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-[#334155]" />
              )}
            </View>
            <Text className="flex-1 text-sm text-gray-600 dark:text-gray-400">
              I confirm that all information provided is accurate and I agree to the{' '}
              <Text className="text-primary-500 font-semibold">Terms & Conditions</Text>
              {' '}and{' '}
              <Text className="text-primary-500 font-semibold">Service Provider Agreement</Text>
            </Text>
          </TouchableOpacity>

          {/* Info Box */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
            <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
              📝 What happens next?
            </Text>
            <Text className="text-blue-600 dark:text-blue-300 text-xs">
              • Your business will be reviewed by our team (usually within 24-48 hours){'\n'}
              • You'll receive a notification once approved{'\n'}
              • After approval, your business will be visible to clients{'\n'}
              • You can start receiving booking requests immediately
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting || !agreedToTerms}
          className={`py-4 rounded-xl items-center ${
            isSubmitting || !agreedToTerms ? 'bg-gray-300 dark:bg-gray-700' : 'bg-primary-500'
          }`}
        >
          <Text className="text-white font-bold text-base">
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper Component
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-xs text-gray-500 mb-1">{label}</Text>
      <Text className="text-sm text-gray-900 dark:text-white">{value}</Text>
    </View>
  );
}