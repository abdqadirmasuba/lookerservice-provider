// File: app/(business)/[id]/categories.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  PlusIcon,
  CheckIcon,
  TagIcon,
} from 'react-native-heroicons/outline';
import {
  getActiveCategories,
  getProviderCategories,
  addProviderCategory,
} from '@/src/utils/business';
import { useCustomAlert } from '@/src/components/common/CustomAlert';

interface Category {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  status: string;
}

interface ProviderCategory {
  category_id: string;
  category_name: string;
  category_description: string;
  icon_url?: string;
}

export default function ManageCategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const { showAlert, AlertComponent } = useCustomAlert();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [providerCategories, setProviderCategories] = useState<ProviderCategory[]>([]);
  const [addingCategoryId, setAddingCategoryId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allCatsResponse, providerCatsResponse] = await Promise.all([
        getActiveCategories(),
        getProviderCategories(businessId),
      ]);

      if (allCatsResponse.success) {
        setAllCategories(allCatsResponse.data || []);
      }

      if (providerCatsResponse.success) {
        setProviderCategories(providerCatsResponse.data || []);
      }
    } catch (err: any) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to load categories',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleAddCategory = async (categoryId: string) => {
    setAddingCategoryId(categoryId);
    try {
      const response = await addProviderCategory(businessId, categoryId);
      
      if (response.success) {
        showAlert({
          type: 'success',
          title: 'Success',
          message: 'Category added successfully',
          buttons: [{ text: 'OK', style: 'default' }],
        });
        await fetchData();
      } else {
        showAlert({
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to add category',
          buttons: [{ text: 'OK', style: 'default' }],
        });
      }
    } catch (err: any) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to add category',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    } finally {
      setAddingCategoryId(null);
    }
  };

  const isCategoryAdded = (categoryId: string) => {
    return providerCategories.some((pc) => pc.category_id === categoryId);
  };

  const handleImageError = (categoryId: string) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeftIcon size={24} color="#6B7280" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Manage Categories
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {providerCategories.length} categories added
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
      >
        <View className="px-6 py-6">
          {loading ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color="#F57C1F" />
              <Text className="text-gray-600 dark:text-gray-400 mt-4">
                Loading categories...
              </Text>
            </View>
          ) : (
            <>
              {/* Info Card */}
              <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6">
                <Text className="text-blue-900 dark:text-blue-300 font-semibold mb-2">
                  Add Categories First
                </Text>
                <Text className="text-blue-700 dark:text-blue-400 text-sm">
                  You need to add categories to your business profile before you can manage services. Select the categories that match your business offerings.
                </Text>
              </View>

              {/* My Categories */}
              {providerCategories.length > 0 && (
                <View className="mb-6">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    My Categories
                  </Text>
                  {providerCategories.map((category) => (
                    <View
                      key={category.category_id}
                      className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3 border border-primary-200 dark:border-primary-800"
                    >
                      <View className="flex-row items-center">
                        <View className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-xl items-center justify-center mr-4">
                          {category.icon_url && !imageErrors[category.category_id] ? (
                            <Image
                              source={{ uri: category.icon_url }}
                              className="w-8 h-8"
                              resizeMode="contain"
                              onError={() => handleImageError(category.category_id)}
                            />
                          ) : (
                            <TagIcon size={32} color="#F57C1F" />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">
                            {category.category_name}
                          </Text>
                          <Text className="text-sm text-gray-600 dark:text-gray-400">
                            {category.category_description}
                          </Text>
                        </View>
                        <View className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full items-center justify-center">
                          <CheckIcon size={16} color="#10B981" />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Available Categories */}
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Available Categories
              </Text>

              {allCategories.filter((cat) => !isCategoryAdded(cat.id)).length === 0 ? (
                <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center">
                  <CheckIcon size={64} color="#10B981" />
                  <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
                    You've added all available categories!
                  </Text>
                </View>
              ) : (
                allCategories
                  .filter((category) => !isCategoryAdded(category.id))
                  .map((category) => (
                    <View
                      key={category.id}
                      className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3 border border-gray-200 dark:border-[#334155]"
                    >
                      <View className="flex-row items-center">
                        <View className="w-14 h-14 bg-gray-50 dark:bg-[#0F172A] rounded-xl items-center justify-center mr-4">
                          {category.icon_url && !imageErrors[category.id] ? (
                            <Image
                              source={{ uri: category.icon_url }}
                              className="w-8 h-8"
                              resizeMode="contain"
                              onError={() => handleImageError(category.id)}
                            />
                          ) : (
                            <TagIcon size={32} color="#9CA3AF" />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">
                            {category.name}
                          </Text>
                          <Text className="text-sm text-gray-600 dark:text-gray-400">
                            {category.description}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleAddCategory(category.id)}
                          disabled={addingCategoryId === category.id}
                          className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center"
                        >
                          {addingCategoryId === category.id ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <PlusIcon size={20} color="#FFFFFF" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Custom Alert */}
      {AlertComponent}
    </SafeAreaView>
  );
}
