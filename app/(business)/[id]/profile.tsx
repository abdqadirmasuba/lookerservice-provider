// File: app/(business)/[id]/profile.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PencilIcon,
  ShareIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  TagIcon,
} from 'react-native-heroicons/outline';
import { getProviderProfile } from '@/src/utils/business';

type DayHoursValue = { open: string; close: string } | 'closed';

interface BusinessProfile {
  id: string;
  business_name: string;
  business_description: string;
  location: {
    longitude: number;
    latitude: number;
  };
  address: string;
  city: string;
  state_region: string;
  country: string;
  verification_status: string;
  business_photos?: string[];
  services: any[];
  reviews: any[];
  review_summary: {
    total_reviews: number;
    average_rating: number;
  };
  booking_stats: {
    total_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    completion_percentage: number;
  };
  business_hours?: { [key: string]: DayHoursValue };
  created_at: string;
  updated_at: string;
  approved_at?: string;
}

export default function BusinessProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [selectedTab, setSelectedTab] = useState<'about' | 'services' | 'reviews'>('about');

  useEffect(() => {
    fetchBusinessProfile();
  }, [businessId]);

  const fetchBusinessProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProviderProfile(businessId);
      setBusiness(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load business profile');
      Alert.alert('Error', 'Failed to load business profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBusinessProfile().finally(() => setRefreshing(false));
  }, [businessId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
        <StatusBar style="auto" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F57C1F" />
          <Text className="text-gray-600 dark:text-gray-400 mt-4">
            Loading business profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !business) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
        <StatusBar style="auto" />
        <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeftIcon size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Business Profile
            </Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 mb-6">
            <Text className="text-red-700 dark:text-red-400 text-center mb-3">
              {error || 'Business not found'}
            </Text>
            <TouchableOpacity
              onPress={fetchBusinessProfile}
              className="bg-red-600 py-2 px-4 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeftIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Business Profile
            </Text>
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="w-10 h-10 bg-gray-100 dark:bg-[#0F172A] rounded-full items-center justify-center">
              <ShareIcon size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/(business)/${businessId}/settings`)}
              className="w-10 h-10 bg-gray-100 dark:bg-[#0F172A] rounded-full items-center justify-center"
            >
              <Cog6ToothIcon size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
      >
        {/* Business Header */}
        <View className="relative">
          {/* Cover photo or gradient */}
          {business.business_photos && business.business_photos.length > 0 ? (
            <Image
              source={{ uri: business.business_photos[0] }}
              className="w-full h-48"
              resizeMode="cover"
            />
          ) : null}
          <LinearGradient
            colors={[
              business.business_photos && business.business_photos.length > 0
                ? 'transparent'
                : '#F57C1F',
              '#E06A0F',
            ]}
            className="p-6"
          >
            <View className="flex-row items-center">
              <View className="w-20 h-20 bg-white rounded-2xl items-center justify-center mr-4 shadow-md">
                <BuildingStorefrontIcon size={40} color="#F57C1F" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold mb-1">
                  {business.business_name}
                </Text>
                <View className="flex-row items-center">
                  <MapPinIcon size={16} color="#FFFFFF" />
                  <Text className="text-white/80 text-sm ml-1">
                    {business.city}, {business.state_region}
                  </Text>
                </View>
                {business.business_photos && business.business_photos.length > 0 && (
                  <Text className="text-white/60 text-xs mt-1">
                    {business.business_photos.length} photo{business.business_photos.length > 1 ? 's' : ''}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => router.push(`/(business)/${businessId}/edit`)}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <PencilIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View className="flex-row bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
          <View className="flex-1 items-center py-4 border-r border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center mb-1">
              <StarIcon size={16} color="#F59E0B" />
              <Text className="text-xl font-bold text-gray-900 dark:text-white ml-1">
                {business.review_summary.average_rating > 0 
                  ? business.review_summary.average_rating.toFixed(1) 
                  : 'N/A'}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">
              {business.review_summary.total_reviews} reviews
            </Text>
          </View>
          <View className="flex-1 items-center py-4 border-r border-gray-200 dark:border-[#334155]">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {business.booking_stats.total_bookings}
            </Text>
            <Text className="text-xs text-gray-500">Bookings</Text>
          </View>
          <View className="flex-1 items-center py-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {business.booking_stats.completion_percentage}%
            </Text>
            <Text className="text-xs text-gray-500">Completion</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
          <View className="flex-row space-x-3 mb-3">
            <TouchableOpacity
              key="analytics"
              onPress={() => router.push(`/(business)/${businessId}/analytics`)}
              className="flex-1 bg-primary-50 dark:bg-primary-900/20 py-3 rounded-xl flex-row items-center justify-center"
            >
              <ChartBarIcon size={20} color="#F57C1F" />
              <Text className="text-primary-500 font-bold ml-2">Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity
              key="services"
              onPress={() => router.push(`/(business)/${businessId}/services`)}
              className="flex-1 bg-blue-50 dark:bg-blue-900/20 py-3 rounded-xl flex-row items-center justify-center"
            >
              <PencilIcon size={20} color="#2DA9E9" />
              <Text className="text-blue-500 font-bold ml-2">Services</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/(business)/${businessId}/categories`)}
            className="bg-green-50 dark:bg-green-900/20 py-3 rounded-xl flex-row items-center justify-center"
          >
            <TagIcon size={20} color="#10B981" />
            <Text className="text-green-600 dark:text-green-400 font-bold ml-2">Manage Categories</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
          <View className="flex-row bg-gray-100 dark:bg-[#0F172A] rounded-xl p-1">
            {(['about', 'services', 'reviews'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                className={`flex-1 py-2 rounded-lg ${
                  selectedTab === tab ? 'bg-white dark:bg-[#1E293B]' : ''
                }`}
              >
                <Text
                  className={`text-center font-semibold capitalize ${
                    selectedTab === tab
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        <View className="px-6 py-6">
          {selectedTab === 'about' && (
            <View className="space-y-4">
              {/* Description */}
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  About
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                  {business.business_description}
                </Text>
              </View>

              {/* Location */}
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Location
                </Text>
                <View className="space-y-2">
                  <View className="flex-row items-start">
                    <MapPinIcon size={20} color="#6B7280" />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm text-gray-900 dark:text-white font-medium">
                        {business.address}
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {business.city}, {business.state_region}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {business.country}
                      </Text>
                      <Text className="text-xs text-gray-400 mt-0.5">
                        {business.location.latitude.toFixed(4)}, {business.location.longitude.toFixed(4)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Business Hours */}
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Business Hours
                </Text>
                {business.business_hours && Object.keys(business.business_hours).length > 0 ? (
                  <View className="space-y-2">
                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
                      .filter((d) => business.business_hours![d] !== undefined)
                      .map((day) => {
                        const h = business.business_hours![day];
                        const isClosed = h === 'closed';
                        const label = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' }[day];
                        return (
                          <View key={day} className="flex-row justify-between items-center py-1 border-b border-gray-100 dark:border-[#334155]">
                            <Text className="text-sm text-gray-600 dark:text-gray-400 w-24">
                              {label}
                            </Text>
                            {isClosed ? (
                              <View className="bg-red-100 dark:bg-red-900/20 px-3 py-0.5 rounded-full">
                                <Text className="text-xs font-semibold text-red-600 dark:text-red-400">Closed</Text>
                              </View>
                            ) : (
                              <Text className="text-sm text-gray-900 dark:text-white font-medium">
                                {(h as { open: string; close: string }).open} – {(h as { open: string; close: string }).close}
                              </Text>
                            )}
                          </View>
                        );
                      })}
                  </View>
                ) : (
                  <View className="py-4 items-center">
                    <ClockIcon size={32} color="#9CA3AF" />
                    <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                      Hours not set
                    </Text>
                  </View>
                )}
              </View>

              {/* Photos */}
              {business.business_photos && business.business_photos.length > 0 && (
                <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    Photos ({business.business_photos.length})
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
                    {business.business_photos.map((uri, idx) => (
                      <View key={idx} className="px-1">
                        <Image
                          source={{ uri }}
                          className="w-32 h-24 rounded-xl"
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Verification Status */}
              <View className={`rounded-2xl p-4 border ${
                business.verification_status === 'approved'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : business.verification_status === 'pending'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <View className="flex-row items-center">
                  <ClockIcon size={20} color={
                    business.verification_status === 'approved' ? '#10B981' :
                    business.verification_status === 'pending' ? '#F59E0B' : '#EF4444'
                  } />
                  <Text className={`font-bold ml-2 ${
                    business.verification_status === 'approved'
                      ? 'text-green-700 dark:text-green-400'
                      : business.verification_status === 'pending'
                      ? 'text-yellow-700 dark:text-yellow-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    Status: {business.verification_status.charAt(0).toUpperCase() + business.verification_status.slice(1)}
                  </Text>
                </View>
                {business.approved_at && (
                  <Text className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Approved on {new Date(business.approved_at).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>
          )}

          {selectedTab === 'services' && (
            <View className="space-y-3">
              {business.services.length > 0 ? (
                business.services.map((service: any) => (
                  <View
                    key={service.provider_service_id || service.id}
                    className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]"
                  >
                    <View className="flex-row items-start">
                      {/* Service icon */}
                      <View className="w-12 h-12 bg-gray-100 dark:bg-[#334155] rounded-xl items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                        {service.service_icon_url ? (
                          <Image
                            source={{ uri: service.service_icon_url }}
                            className="w-8 h-8"
                            resizeMode="contain"
                          />
                        ) : (
                          <BuildingStorefrontIcon size={24} color="#9CA3AF" />
                        )}
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-base font-bold text-gray-900 dark:text-white flex-1 mr-2">
                            {service.title || service.service_name || service.name}
                          </Text>
                          <View
                            className={`px-2 py-0.5 rounded-full ${
                              service.status === 'active'
                                ? 'bg-green-100 dark:bg-green-900/20'
                                : service.status === 'hidden'
                                ? 'bg-gray-100 dark:bg-gray-800'
                                : 'bg-red-100 dark:bg-red-900/20'
                            }`}
                          >
                            <Text
                              className={`text-xs font-bold ${
                                service.status === 'active'
                                  ? 'text-green-600 dark:text-green-400'
                                  : service.status === 'hidden'
                                  ? 'text-gray-600 dark:text-gray-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {service.status === 'active' ? 'Active' : service.status === 'hidden' ? 'Hidden' : 'Down'}
                            </Text>
                          </View>
                        </View>
                        {service.category_name && (
                          <Text className="text-xs text-primary-500 font-medium mb-1">
                            {service.category_name}
                          </Text>
                        )}
                        {service.description && (
                          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2" numberOfLines={2}>
                            {service.description}
                          </Text>
                        )}
                        <Text className="text-primary-500 font-bold">
                          {service.pricing_type === 'negotiable'
                            ? 'Negotiable'
                            : service.base_price != null && service.currency
                            ? `${service.currency} ${service.base_price.toLocaleString()}`
                            : 'Price not set'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View className="py-12 items-center">
                  <Cog6ToothIcon size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
                    No services added yet
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push(`/(business)/${businessId}/services`)}
                    className="mt-4 bg-primary-500 px-6 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Add Services</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {selectedTab === 'reviews' && (
            <View className="space-y-3">
              {business.reviews.length > 0 ? (
                business.reviews.map((review: any) => (
                  <View
                    key={review.id}
                    className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-bold text-gray-900 dark:text-white">
                        {review.client_name || 'Anonymous'}
                      </Text>
                      <View className="flex-row">
                        {[...Array(review.rating || 0)].map((_, i) => (
                          <Text key={i} className="text-yellow-500">★</Text>
                        ))}
                      </View>
                    </View>
                    {review.comment && (
                      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {review.comment}
                      </Text>
                    )}
                    <Text className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                ))
              ) : (
                <View className="py-12 items-center">
                  <StarIcon size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
                    No reviews yet
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}