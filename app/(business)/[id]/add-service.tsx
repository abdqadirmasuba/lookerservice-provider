import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import SvgIcon from '@/src/components/common/SvgIcon';
import {
  WrenchScrewdriverIcon,
  RectangleGroupIcon,
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  HomeIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { getAvailableServices, getProviderServices } from '@/src/utils/business';

interface AvailableService {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  sort_order: number;
  status: string;
}

interface ProviderService {
  id: string;
  service_id: string;
  service_name: string;
}

export default function AddServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState<AvailableService[]>([]);
  const [registered, setRegistered] = useState<ProviderService[]>([]);
  const [confirmService, setConfirmService] = useState<AvailableService | null>(null);
  const [showDoneOptions, setShowDoneOptions] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [availRes, regRes] = await Promise.all([
        getAvailableServices(businessId),
        getProviderServices(businessId),
      ]);

      if (availRes.success) setAvailable(availRes.data || []);
      if (regRes.success) setRegistered(regRes.data || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const registeredServiceIds = new Set(registered.map((s) => s.service_id));
  const unaddedServices = available.filter((s) => !registeredServiceIds.has(s.id));
  const addedServices = available.filter((s) => registeredServiceIds.has(s.id));

  const handleSelectService = (service: AvailableService) => {
    // Navigate to service registration screen with pre-selected service
    router.push(
      `/(business)/${businessId}/register-service?service_id=${service.id}&service_name=${encodeURIComponent(service.name)}&service_icon=${encodeURIComponent(service.icon_url || '')}` as any
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-5 pt-5 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center mb-3">
          <View className="flex-1">
            <View className="flex-row items-center">
              <WrenchScrewdriverIcon size={22} color="#2DA9E9" />
              <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">
                Add Service
              </Text>
            </View>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Select a service to register for your business
            </Text>
          </View>
        </View>

        {/* Shortcut to categories */}
        <TouchableOpacity
          onPress={() => router.push(`/(business)/${businessId}/categories` as any)}
          className="flex-row items-center bg-orange-50 dark:bg-orange-900/20 rounded-xl px-4 py-3"
          activeOpacity={0.8}
        >
          <View className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg items-center justify-center mr-3">
            <RectangleGroupIcon size={16} color="#F57C1F" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-orange-700 dark:text-orange-400">
              Manage Categories
            </Text>
            <Text className="text-xs text-orange-500/80 dark:text-orange-500 mt-0.5">
              Add or review your business categories
            </Text>
          </View>
          <ArrowTopRightOnSquareIcon size={16} color="#F57C1F" />
        </TouchableOpacity>
      </View>

      {/* Service list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {loading ? (
          <View className="py-20 items-center">
            <ActivityIndicator size="large" color="#F57C1F" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
              Loading available services...
            </Text>
          </View>
        ) : (
          <>
            {/* Already-registered services */}
            {addedServices.length > 0 && (
              <View className="mb-6">
                <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                  Already Added ({addedServices.length})
                </Text>
                <View style={{ gap: 8 }}>
                  {addedServices.map((service) => (
                    <View
                      key={service.id}
                      className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 flex-row items-center border border-green-200 dark:border-green-800"
                    >
                      <View className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl items-center justify-center mr-4 overflow-hidden">
                        <SvgIcon uri={service.icon_url} size={36} fallback="🛠️" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900 dark:text-white">
                          {service.name}
                        </Text>
                        {service.description ? (
                          <Text
                            className="text-sm text-gray-400 dark:text-gray-500 mt-0.5"
                            numberOfLines={2}
                          >
                            {service.description}
                          </Text>
                        ) : null}
                      </View>
                      <View className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center ml-3">
                        <CheckCircleIcon size={22} color="#10B981" />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Available services */}
            <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
              Available Services
            </Text>

            {unaddedServices.length === 0 ? (
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center border border-gray-100 dark:border-[#334155]">
                <CheckCircleIcon size={52} color="#10B981" />
                <Text className="text-base font-bold text-gray-900 dark:text-white mt-4">
                  All Set!
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                  You have registered all available services for your categories.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 8 }}>
                {unaddedServices.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    onPress={() => setConfirmService(service)}
                    activeOpacity={0.8}
                    className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 flex-row items-center border border-gray-100 dark:border-[#334155]"
                  >
                    <View className="w-14 h-14 bg-secondary-50 dark:bg-secondary-500/20 rounded-2xl items-center justify-center mr-4 overflow-hidden">
                      <SvgIcon uri={service.icon_url} size={36} fallback="🛠️" />
                    </View>
                    <View className="flex-1 mr-3">
                      <Text className="text-base font-semibold text-gray-900 dark:text-white">
                        {service.name}
                      </Text>
                      {service.description ? (
                        <Text
                          className="text-sm text-gray-400 dark:text-gray-500 mt-0.5"
                          numberOfLines={2}
                        >
                          {service.description}
                        </Text>
                      ) : null}
                    </View>
                    <View className="w-9 h-9 bg-secondary-100 dark:bg-secondary-500/30 rounded-full items-center justify-center">
                      <PlusIcon size={18} color="#2DA9E9" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Done footer */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-white dark:bg-[#1E293B] border-t border-gray-100 dark:border-[#334155]">
        <TouchableOpacity
          onPress={() => setShowDoneOptions(true)}
          disabled={loading || addedServices.length === 0}
          className={`py-4 rounded-2xl items-center justify-center ${
            loading || addedServices.length === 0
              ? 'bg-gray-300 dark:bg-[#334155]'
              : 'bg-primary-500'
          }`}
          style={{ minHeight: 54 }}
          activeOpacity={0.85}
        >
          <Text
            className={`font-bold text-base ${
              loading || addedServices.length === 0
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-white'
            }`}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation modal */}
      <Modal
        visible={!!confirmService}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmService(null)}
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
          <View className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-sm">
            {/* Icon */}
            {confirmService && (
              <View className="w-16 h-16 bg-secondary-50 dark:bg-secondary-500/20 rounded-2xl items-center justify-center mb-4 self-center overflow-hidden">
                <SvgIcon uri={confirmService.icon_url} size={40} fallback="🛠️" />
              </View>
            )}
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Add Service
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Continue to add{' '}
              <Text className="font-bold text-gray-900 dark:text-white">
                "{confirmService?.name}"
              </Text>{' '}
              to your business?
            </Text>
            <View className="flex-row" style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => setConfirmService(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#0F172A] items-center"
              >
                <Text className="font-semibold text-gray-700 dark:text-gray-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const s = confirmService!;
                  setConfirmService(null);
                  handleSelectService(s);
                }}
                className="flex-1 py-3 rounded-xl bg-primary-500 items-center"
              >
                <Text className="font-semibold text-white">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Done options modal */}
      <Modal
        visible={showDoneOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDoneOptions(false)}
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
          <View className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-sm">
            <View className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full items-center justify-center mb-4 self-center">
              <CheckCircleIcon size={36} color="#10B981" />
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Services Added
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Where would you like to go next?
            </Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDoneOptions(false);
                  router.replace(`/(business)/${businessId}/profile` as any);
                }}
                className="py-3 rounded-xl bg-primary-500 flex-row items-center justify-center"
                activeOpacity={0.85}
              >
                <UserCircleIcon size={18} color="#FFFFFF" />
                <Text className="font-semibold text-white ml-2">Manage Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDoneOptions(false);
                  router.replace('/(tabs)' as any);
                }}
                className="py-3 rounded-xl bg-gray-100 dark:bg-[#0F172A] flex-row items-center justify-center"
                activeOpacity={0.85}
              >
                <HomeIcon size={18} color="#6B7280" />
                <Text className="font-semibold text-gray-700 dark:text-gray-300 ml-2">
                  Go Home
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
