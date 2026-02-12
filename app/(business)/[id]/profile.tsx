// File: app/(business)/[id]/profile.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
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
} from 'react-native-heroicons/outline';

export default function BusinessProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'about' | 'services' | 'reviews'>('about');

  // Mock data
  const business = {
    id: businessId,
    name: 'Doe Plumbing Services',
    category: 'Plumbing',
    description: 'Professional plumbing services with 10+ years of experience. We handle all types of plumbing issues from repairs to installations. Our team is certified and equipped with modern tools.',
    phone: '+256 701 234 567',
    email: 'info@doeplumbing.com',
    address: 'Plot 123, Main Street',
    city: 'Kampala',
    district: 'Kampala',
    region: 'Central',
    status: 'active',
    rating: 4.8,
    totalReviews: 127,
    totalBookings: 243,
    completionRate: 96,
    responseTime: '< 2 hours',
    photos: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
    ],
    services: [
      { id: '1', name: 'Pipe Repair', price: '50000', priceType: 'fixed' },
      { id: '2', name: 'Bathroom Installation', price: '150000', priceType: 'hourly' },
      { id: '3', name: 'Emergency Services', priceType: 'negotiable' },
      { id: '4', name: 'Water Heater Installation', price: '200000', priceType: 'fixed' },
    ],
    hours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
  };

  const reviews = [
    {
      id: '1',
      clientName: 'Alice Nambi',
      rating: 5,
      comment: 'Excellent service! Fixed my leaking pipe quickly and professionally.',
      date: '2 days ago',
    },
    {
      id: '2',
      clientName: 'Bob Okello',
      rating: 5,
      comment: 'Very satisfied with the bathroom installation. Highly recommended!',
      date: '1 week ago',
    },
    {
      id: '3',
      clientName: 'Carol Atim',
      rating: 4,
      comment: 'Good work, but took slightly longer than expected.',
      date: '2 weeks ago',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

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
        {/* Cover Photo & Business Info */}
        <View className="relative">
          <Image
            source={{ uri: business.photos[0] }}
            className="w-full h-48"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute bottom-0 left-0 right-0 p-6"
          >
            <View className="flex-row items-end justify-between">
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold mb-1">{business.name}</Text>
                <Text className="text-white/80 text-sm">{business.category}</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push(`/(business)/${businessId}/edit`)}
                className="w-10 h-10 bg-white/20 backdrop-blur rounded-full items-center justify-center"
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
                {business.rating}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">{business.totalReviews} reviews</Text>
          </View>
          <View className="flex-1 items-center py-4 border-r border-gray-200 dark:border-[#334155]">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {business.totalBookings}
            </Text>
            <Text className="text-xs text-gray-500">Bookings</Text>
          </View>
          <View className="flex-1 items-center py-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {business.completionRate}%
            </Text>
            <Text className="text-xs text-gray-500">Completion</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row px-6 py-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155] space-x-3">
          <TouchableOpacity
            onPress={() => router.push(`/(business)/${businessId}/analytics`)}
            className="flex-1 bg-primary-50 dark:bg-primary-900/20 py-3 rounded-xl flex-row items-center justify-center"
          >
            <ChartBarIcon size={20} color="#F57C1F" />
            <Text className="text-primary-500 font-bold ml-2">Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/(business)/${businessId}/services`)}
            className="flex-1 bg-blue-50 dark:bg-blue-900/20 py-3 rounded-xl flex-row items-center justify-center"
          >
            <PencilIcon size={20} color="#2DA9E9" />
            <Text className="text-blue-500 font-bold ml-2">Edit Services</Text>
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
                  {business.description}
                </Text>
              </View>

              {/* Contact */}
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Contact Information
                </Text>
                <View className="space-y-3">
                  <View className="flex-row items-center">
                    <PhoneIcon size={20} color="#6B7280" />
                    <Text className="text-sm text-gray-900 dark:text-white ml-3">
                      {business.phone}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <EnvelopeIcon size={20} color="#6B7280" />
                    <Text className="text-sm text-gray-900 dark:text-white ml-3">
                      {business.email}
                    </Text>
                  </View>
                  <View className="flex-row items-start">
                    <MapPinIcon size={20} color="#6B7280" />
                    <Text className="text-sm text-gray-900 dark:text-white ml-3 flex-1">
                      {business.address}, {business.city}, {business.district}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Business Hours */}
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Business Hours
                </Text>
                <View className="space-y-2">
                  {Object.entries(business.hours).map(([day, hours]) => (
                    <View key={day} className="flex-row justify-between">
                      <Text className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {day}
                      </Text>
                      <Text className="text-sm text-gray-900 dark:text-white font-medium">
                        {hours}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Response Time */}
              <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
                <View className="flex-row items-center">
                  <ClockIcon size={20} color="#2DA9E9" />
                  <Text className="text-blue-700 dark:text-blue-400 font-bold ml-2">
                    Average Response Time: {business.responseTime}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {selectedTab === 'services' && (
            <View className="space-y-3">
              {business.services.map((service) => (
                <View
                  key={service.id}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]"
                >
                  <Text className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {service.name}
                  </Text>
                  <Text className="text-primary-500 font-bold">
                    {getPriceDisplay(service)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {selectedTab === 'reviews' && (
            <View className="space-y-3">
              {reviews.map((review) => (
                <View
                  key={review.id}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-bold text-gray-900 dark:text-white">
                      {review.clientName}
                    </Text>
                    <View className="flex-row">
                      {[...Array(review.rating)].map((_, i) => (
                        <Text key={i} className="text-yellow-500">★</Text>
                      ))}
                    </View>
                  </View>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {review.comment}
                  </Text>
                  <Text className="text-xs text-gray-500">{review.date}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}