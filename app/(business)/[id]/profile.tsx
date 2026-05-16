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
  StarIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  TagIcon,
  WrenchScrewdriverIcon,
  PlusCircleIcon,
  TruckIcon,
} from 'react-native-heroicons/outline';
import { SparklesIcon } from 'react-native-heroicons/solid';
import { getProviderProfile, enableBusiness } from '@/src/utils/business';
import SvgIcon from '@/src/components/common/SvgIcon';

interface DayHours {
  open: string | null;
  close: string | null;
  is_open: boolean;
}

interface ServiceListItem {
  label: string;
  amount?: number;
  currency?: string;
  image_urls?: string[];
}

interface ProfileService {
  provider_service_id: string;
  service_id: string;
  service_name: string;
  service_icon_url?: string;
  category_id?: string;
  category_name?: string;
  service_list?: ServiceListItem[];
  status: string;
  created_at: string;
}

interface BusinessProfile {
  id: string;
  business_name: string;
  business_description: string;
  logo_url?: string;
  service_delivery_type?: string;
  location: { longitude: number; latitude: number };
  address: string;
  city: string;
  state_region: string;
  country: string;
  business_status: string;
  provider_type?: string;
  verification_status: string;
  categories_count: number;
  services_count: number;
  group_count: number;
  services: ProfileService[];
  reviews: any[];
  review_summary: { total_reviews: number; average_rating: number };
  booking_stats: {
    total_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    completion_percentage: number;
  };
  business_hours?: { [key: string]: DayHours };
  created_at: string;
  updated_at: string;
  approved_at?: string;
}

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function getStatusConfig(status: string) {
  switch (status) {
    case 'approved': return { bg: '#10B981', label: 'Approved' };
    case 'pending':  return { bg: '#F59E0B', label: 'Pending Review' };
    case 'rejected': return { bg: '#EF4444', label: 'Rejected' };
    default:         return { bg: '#6B7280', label: status };
  }
}

function getDeliveryConfig(type?: string) {
  switch (type) {
    case 'onsite': return { color: '#EF4444', label: 'On-site' };
    case 'remote': return { color: '#3B82F6', label: 'Remote' };
    case 'both':   return { color: '#10B981', label: 'On-site & Remote' };
    default:       return null;
  }
}

function getBusinessStatusConfig(status: string) {
  switch (status) {
    case 'active':   return { bg: '#10B981', label: 'Active' };
    case 'inactive': return { bg: '#6B7280', label: 'Inactive' };
    default:         return { bg: '#6B7280', label: status || 'Unknown' };
  }
}

function getProviderTypeLabel(type?: string): string {
  const labels: Record<string, string> = {
    individual: 'Individual',
    business: 'Business',
    company: 'Company',
  };
  return type ? (labels[type] || type) : '';
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
  const [logoError, setLogoError] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    fetchBusinessProfile();
  }, [businessId]);

  // Redirect to category setup if no categories
  useEffect(() => {
    if (business && business.categories_count === 0) {
      router.replace(`/(business)/${businessId}/categories` as any);
    }
  }, [business]);

  const fetchBusinessProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProviderProfile(businessId);
      setBusiness(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load business profile');
    } finally {
      setLoading(false);
    }
  };


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBusinessProfile().finally(() => setRefreshing(false));
  }, [businessId]);

  const handleActivate = () => {
    Alert.alert(
      'Activate Business',
      'Your business will become visible to clients again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Activate',
          onPress: async () => {
            setIsActivating(true);
            try {
              await enableBusiness(businessId);
              await fetchBusinessProfile();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to activate. Please try again.');
            } finally {
              setIsActivating(false);
            }
          },
        },
      ],
    );
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
        <StatusBar style="auto" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F57C1F" />
          <Text className="text-gray-600 dark:text-gray-400 mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ── Error ── */
  if (error || !business) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
        <StatusBar style="auto" />
        <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <ArrowLeftIcon size={24} color="#6B7280" />
            <Text className="text-xl font-bold text-gray-900 dark:text-white ml-3">
              Business Profile
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 mb-6 w-full">
            <Text className="text-red-700 dark:text-red-400 text-center mb-3">
              {error || 'Business not found'}
            </Text>
            <TouchableOpacity
              onPress={fetchBusinessProfile}
              className="bg-red-600 py-2 px-4 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const status = getStatusConfig(business.verification_status);
  const businessStatusCfg = getBusinessStatusConfig(business.business_status);
  const delivery = getDeliveryConfig(business.service_delivery_type);
  const noServices = business.services_count === 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* ── Fixed top bar ── */}
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
          <TouchableOpacity
            onPress={() => router.push(`/(business)/${businessId}/settings`)}
            className="w-10 h-10 bg-gray-100 dark:bg-[#0F172A] rounded-full items-center justify-center"
          >
            <Cog6ToothIcon size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Outer scroll – everything inside scrolls ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
      >
        {/* Business hero */}
        <LinearGradient colors={['#F57C1F', '#E06A0F']} className="px-6 py-6">
          <View className="flex-row items-center">
            {/* Logo / placeholder */}
            <View className="w-20 h-20 bg-white rounded-2xl items-center justify-center mr-4 shadow-md overflow-hidden">
              {business.logo_url && !logoError ? (
                <Image
                  source={{ uri: business.logo_url }}
                  style={{ width: 80, height: 80 }}
                  resizeMode="cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <BuildingStorefrontIcon size={40} color="#F57C1F" />
              )}
            </View>

            {/* Name + badges */}
            <View className="flex-1">
              <Text className="text-white text-xl font-bold mb-0.5">
                {business.business_name}
              </Text>
              {business.provider_type ? (
                <Text className="text-white/65 text-xs mb-1.5">
                  {getProviderTypeLabel(business.provider_type)}
                </Text>
              ) : null}
              {/* Status badges */}
              <View className="flex-row flex-wrap items-center mb-1.5" style={{ gap: 6 }}>
                {/* Business status (active / inactive) */}
                <View
                  className="self-start px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: businessStatusCfg.bg }}
                >
                  <Text className="text-white text-xs font-semibold">{businessStatusCfg.label}</Text>
                </View>
                {/* Verification status */}
                <View
                  className="self-start px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: status.bg }}
                >
                  <Text className="text-white text-xs font-semibold">{status.label}</Text>
                </View>
                {delivery && (
                  <View
                    className="self-start px-2.5 py-0.5 rounded-full flex-row items-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                  >
                    <TruckIcon size={10} color="#fff" />
                    <Text className="text-white text-xs font-semibold ml-1">{delivery.label}</Text>
                  </View>
                )}
              </View>
              <View className="flex-row items-center">
                <MapPinIcon size={14} color="rgba(255,255,255,0.8)" />
                <Text className="text-white/80 text-sm ml-1" numberOfLines={1}>
                  {business.city}, {business.state_region}
                </Text>
              </View>
            </View>

            {/* Activate button — shown only when business is inactive */}
            {business.business_status === 'inactive' && (
              <TouchableOpacity
                onPress={handleActivate}
                disabled={isActivating}
                className="ml-3 items-center justify-center bg-white/20 border border-white/40 px-3 py-2 rounded-xl"
                activeOpacity={0.8}
              >
                {isActivating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white text-xs font-bold">Activate</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Stats row */}
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

        {/* Tab bar */}
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
                  className={`text-center font-semibold capitalize text-sm ${
                    selectedTab === tab
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── No-services banner (shown when services_count === 0) ── */}
        {noServices && (
          <View className="mx-5 mt-4">
            <LinearGradient
              colors={['#7C3AED', '#6D28D9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 16, padding: 16 }}
            >
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center mr-3">
                  <SparklesIcon size={22} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base">Add your services</Text>
                  <Text className="text-white/75 text-xs mt-0.5">
                    Let clients know what you offer
                  </Text>
                </View>
              </View>
              <Text className="text-white/80 text-sm mb-4 leading-5">
                Your profile is set up — now add the services you provide so clients can discover and book you.
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/(business)/${businessId}/add-service` as any)}
                className="bg-white rounded-xl py-3 items-center"
                activeOpacity={0.85}
              >
                <Text className="text-purple-700 font-bold text-sm">Start Adding Services</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Tab content */}
        <View className="px-6 py-6">

          {/* ── ABOUT ── */}
          {selectedTab === 'about' && (
            <View style={{ gap: 16 }}>

              {/* Description */}
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">About</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                  {business.business_description || 'No description provided.'}
                </Text>
              </View>

              {/* Location */}
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">Location</Text>
                <View className="flex-row items-start">
                  <MapPinIcon size={20} color="#6B7280" />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-medium text-gray-900 dark:text-white">
                      {business.address}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {business.city}, {business.state_region}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{business.country}</Text>
                  </View>
                </View>
              </View>

              {/* Business Hours */}
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Business Hours
                </Text>
                {business.business_hours && Object.keys(business.business_hours).length > 0 ? (
                  <View style={{ gap: 8 }}>
                    {DAYS_ORDER.filter((d) => business.business_hours![d]).map((day) => {
                      const h = business.business_hours![day];
                      return (
                        <View
                          key={day}
                          className="flex-row justify-between items-center py-1 border-b border-gray-100 dark:border-[#334155]"
                        >
                          <Text className="text-sm text-gray-600 dark:text-gray-400 w-24">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Text>
                          {h.is_open ? (
                            <Text className="text-sm text-gray-900 dark:text-white font-medium">
                              {h.open} – {h.close}
                            </Text>
                          ) : (
                            <View className="bg-red-100 dark:bg-red-900/20 px-3 py-0.5 rounded-full">
                              <Text className="text-xs font-semibold text-red-600 dark:text-red-400">
                                Closed
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View className="py-4 items-center">
                    <ClockIcon size={32} color="#9CA3AF" />
                    <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Hours not set</Text>
                  </View>
                )}
              </View>

              {/* Categories shortcut */}
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155] flex-row items-center">
                <View className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-full items-center justify-center mr-4">
                  <TagIcon size={24} color="#F57C1F" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base text-gray-900 dark:text-white">Categories</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {business.categories_count} active {business.categories_count === 1 ? 'category' : 'categories'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push(`/(business)/${businessId}/categories`)}
                  className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                >
                  <Text className="text-orange-600 dark:text-orange-400 text-xs font-semibold">
                    Manage
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── SERVICES ── */}
          {selectedTab === 'services' && (
            <View style={{ gap: 12 }}>
              {(business.services ?? []).length > 0 ? (
                (business.services ?? []).map((service) => (
                  <TouchableOpacity
                    key={service.provider_service_id}
                    onPress={() =>
                      router.push(
                        `/(business)/${businessId}/view-service?service_id=${service.service_id}` as any,
                      )
                    }
                    activeOpacity={0.8}
                    className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]"
                  >
                    <View className="flex-row items-start">
                      <View className="w-12 h-12 bg-gray-100 dark:bg-[#334155] rounded-xl items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                        <SvgIcon uri={service.service_icon_url} size={28} fallback="🛠️" />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-base font-bold text-gray-900 dark:text-white flex-1 mr-2">
                            {service.service_name}
                          </Text>
                          {service.service_list && service.service_list.length > 0 && (
                            <View className="bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                              <Text className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                                {service.service_list.length} item{service.service_list.length !== 1 ? 's' : ''}
                              </Text>
                            </View>
                          )}
                        </View>
                        {service.category_name && (
                          <Text className="text-xs text-orange-500 font-medium mb-1">
                            {service.category_name}
                          </Text>
                        )}
                        {service.service_list && service.service_list.length > 0 && (
                          <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>
                            {service.service_list[0].label}
                            {service.service_list[0].amount != null
                              ? ` · UGX ${service.service_list[0].amount.toLocaleString()}`
                              : ''}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                /* Empty state */
                <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center border border-dashed border-gray-300 dark:border-[#334155]">
                  <View className="w-16 h-16 bg-secondary-50 dark:bg-secondary-500/20 rounded-2xl items-center justify-center mb-4">
                    <WrenchScrewdriverIcon size={36} color="#2DA9E9" />
                  </View>
                  <Text className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    No services yet
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    Add the services you offer so clients can find and book you.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push(`/(business)/${businessId}/add-service` as any)}
                    className="bg-primary-500 px-6 py-3 rounded-xl flex-row items-center"
                    activeOpacity={0.85}
                  >
                    <PlusCircleIcon size={18} color="#fff" />
                    <Text className="text-white font-bold text-sm ml-2">Add a Service</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* ── REVIEWS ── */}
          {selectedTab === 'reviews' && (
            <View style={{ gap: 12 }}>
              {business.reviews.length > 0 ? (
                business.reviews.map((review: any, idx: number) => (
                  <View
                    key={idx}
                    className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]"
                  >
                    <View className="flex-row items-center mb-2">
                      <View className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full items-center justify-center mr-3">
                        <Text className="text-orange-600 font-bold text-base">
                          {(review.client_name || 'U').charAt(0)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-gray-900 dark:text-white">
                          {review.client_name || 'Anonymous'}
                        </Text>
                        <View className="flex-row mt-0.5" style={{ gap: 2 }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon
                              key={s}
                              size={12}
                              color={s <= (review.rating || 0) ? '#F59E0B' : '#D1D5DB'}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                    {review.comment ? (
                      <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                        {review.comment}
                      </Text>
                    ) : null}
                  </View>
                ))
              ) : (
                <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center border border-gray-200 dark:border-[#334155]">
                  <StarIcon size={48} color="#D1D5DB" />
                  <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
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
