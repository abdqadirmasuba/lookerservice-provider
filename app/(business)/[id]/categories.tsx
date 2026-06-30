// File: app/(business)/[id]/categories.tsx

import React, { useState, useEffect } from 'react';
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
import SvgIcon from '@/src/components/common/SvgIcon';
import {
  PlusIcon,
  CheckIcon,
  TagIcon,
  RectangleGroupIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import {
  getAvailableProviderCategories,
  getProviderCategories,
  addProviderCategory,
} from '@/src/utils/business';

interface AvailableCategory {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  group_name: string;
  sort_order: number;
  status: string;
}

interface ProviderCategory {
  id: string;
  category_id: string;
  category_name: string;
  category_description: string;
  icon_url?: string;
  status: string;
}

export default function ManageCategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState<AvailableCategory[]>([]);
  const [providerCategories, setProviderCategories] = useState<ProviderCategory[]>([]);
  const [addingCategoryId, setAddingCategoryId] = useState<string | null>(null);
  const [confirmCategory, setConfirmCategory] = useState<AvailableCategory | null>(null);
  const [showNextStepModal, setShowNextStepModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [availRes, providerRes] = await Promise.all([
        getAvailableProviderCategories(businessId),
        getProviderCategories(businessId),
      ]);
      if (availRes.success) setAvailable(availRes.data || []);
      if (providerRes.success) setProviderCategories(providerRes.data || []);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAdd = async () => {
    if (!confirmCategory) return;
    const cat = confirmCategory;
    setConfirmCategory(null);
    setAddingCategoryId(cat.id);
    try {
      const res = await addProviderCategory(businessId, cat.id);
      if (res.success) {
        await fetchData();
      } else {
        Alert.alert('Error', res.message || 'Failed to add category');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add category');
    } finally {
      setAddingCategoryId(null);
    }
  };

  const addedIds = new Set(providerCategories.map((pc) => pc.category_id));
  const unaddedCategories = available.filter((c) => !addedIds.has(c.id));
  const hasCategories = providerCategories.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header — modal style (no back button) */}
      <View className="px-5 pt-5 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center mb-1">
          <RectangleGroupIcon size={26} color="#F57C1F" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white ml-2">
            Choose Categories
          </Text>
        </View>
        <Text className="text-base text-gray-500 dark:text-gray-400">
          Select the categories that describe your services. Add at least one to continue.
        </Text>
      </View>

      {/* Category list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
      >
        {loading ? (
          <View className="py-20 items-center">
            <ActivityIndicator size="large" color="#F57C1F" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
              Loading categories...
            </Text>
          </View>
        ) : (
          <>
            {/* Already-added categories */}
            {providerCategories.length > 0 && (
              <View className="mb-6">
                <Text className="text-xs font-bold text-gray-400 uppercase mb-3">
                  Added ({providerCategories.length})
                </Text>
                <View style={{ gap: 8 }}>
                  {providerCategories.map((cat) => (
                    <View
                      key={cat.id}
                      className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 flex-row items-center border border-green-200 dark:border-green-800"
                    >
                      <View className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl items-center justify-center mr-4 overflow-hidden">
                        <SvgIcon uri={cat.icon_url} size={40} fallback="🏷️" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900 dark:text-white">
                          {cat.category_name}
                        </Text>
                        {cat.category_description ? (
                          <Text className="text-sm text-gray-400 mt-0.5" numberOfLines={2}>
                            {cat.category_description}
                          </Text>
                        ) : null}
                      </View>
                      <View className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center">
                        <CheckIcon size={18} color="#10B981" />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Available categories */}
            <Text className="text-xs font-bold text-gray-400 uppercase mb-3">
              Available Categories
            </Text>
            {unaddedCategories.length === 0 ? (
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center border border-gray-100 dark:border-[#334155]">
                <CheckCircleIcon size={48} color="#10B981" />
                <Text className="text-gray-500 dark:text-gray-400 mt-3 text-center text-sm">
                  All available categories have been added!
                </Text>
              </View>
            ) : (
              <View style={{ gap: 8 }}>
                {unaddedCategories.map((cat) => (
                  <View
                    key={cat.id}
                    className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 flex-row items-center border border-gray-100 dark:border-[#334155]"
                  >
                    <View className="w-16 h-16 bg-gray-50 dark:bg-[#0F172A] rounded-2xl items-center justify-center mr-4 overflow-hidden">
                      <SvgIcon uri={cat.icon_url} size={40} fallback="🏷️" />
                    </View>
                    <View className="flex-1 mr-3">
                      <Text className="text-base font-semibold text-gray-900 dark:text-white">
                        {cat.name}
                      </Text>
                      {cat.description ? (
                        <Text className="text-sm text-gray-400 mt-0.5" numberOfLines={2}>
                          {cat.description}
                        </Text>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      onPress={() => setConfirmCategory(cat)}
                      disabled={addingCategoryId === cat.id}
                      className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center"
                      activeOpacity={0.8}
                    >
                      {addingCategoryId === cat.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <PlusIcon size={24} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Next-step modal */}
      <Modal
        visible={showNextStepModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNextStepModal(false)}
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-sm">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Almost there!
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400 leading-6 mb-6">
              Lastly, add the services or products that you provide under each of the categories you have added.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowNextStepModal(false);
                router.replace(`/(business)/${businessId}/add-service` as any);
              }}
              className="bg-orange-500 py-4 rounded-xl items-center"
              activeOpacity={0.85}
            >
              <Text className="text-white font-bold text-base">Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        visible={!!confirmCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmCategory(null)}
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-sm">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Add Category
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400 mb-6">
              Add{' '}
              <Text className="font-bold text-gray-900 dark:text-white">
                "{confirmCategory?.name}"
              </Text>{' '}
              to your business?
            </Text>
            <View className="flex-row" style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => setConfirmCategory(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#0F172A] items-center"
              >
                <Text className="font-semibold text-gray-700 dark:text-gray-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmAdd}
                className="flex-1 py-3 rounded-xl bg-orange-500 items-center"
              >
                <Text className="font-semibold text-white">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fixed bottom button */}
      <View className="px-5 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        <TouchableOpacity
          onPress={() => hasCategories && setShowNextStepModal(true)}
          disabled={!hasCategories}
          style={{ opacity: hasCategories ? 1 : 0.4 }}
          className="bg-orange-500 py-4 rounded-xl items-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-lg">
            {hasCategories ? 'Continue' : 'Add at least one category'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}