// File: app/(business)/register/step4.tsx

import React, { useState, useEffect } from 'react';
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
  TagIcon,
  CheckIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '@/src/store/slices/businessRegistrationSlice';
import { RootState } from '@/src/store';
import { getActiveCategories } from '@/src/utils/business';

interface Category {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function BusinessStep4Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const businessRegistration = useSelector(
    (state: RootState) => state.businessRegistration
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    businessRegistration.categories
  );
  const [categories, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActiveCategories();
      setCategoriesList(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
  };

  const getSelectedCategoryObjects = () => {
    return categories.filter(cat => selectedCategories.includes(cat.id));
  };

  const handleImageError = (categoryId: string) => {
    setImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  const handleNext = () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Required', 'Please select at least one category');
      return;
    }

    // Save to Redux store
    dispatch(setCategories(selectedCategories));

    router.push('/(business)/register/step5');
  };

  const handleBack = () => {
    router.back();
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
              Step 4 of 5
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-2 bg-gray-200 dark:bg-[#334155] rounded-full overflow-hidden">
          <View className="h-full w-[80%] bg-primary-500 rounded-full" />
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
              <TagIcon size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Business Categories
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-400 px-8">
              Select the categories your business operates in
            </Text>
          </View>

          {/* Loading State */}
          {loading && (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color="#F57C1F" />
              <Text className="text-gray-600 dark:text-gray-400 mt-4">
                Loading categories...
              </Text>
            </View>
          )}

          {/* Error State */}
          {error && !loading && (
            <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 mb-6">
              <Text className="text-red-700 dark:text-red-400 text-center mb-3">
                {error}
              </Text>
              <TouchableOpacity
                onPress={fetchCategories}
                className="bg-red-600 py-2 px-4 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Selected Categories Chips */}
          {!loading && selectedCategories.length > 0 && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Selected Categories ({selectedCategories.length})
              </Text>
              <View className="flex-row flex-wrap -mx-1">
                {getSelectedCategoryObjects().map((category) => (
                  <View key={category.id} className="px-1 mb-2">
                    <View className="bg-primary-500 rounded-full px-4 py-2 flex-row items-center">
                      <Text className="text-white font-semibold text-sm mr-2">
                        {category.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeCategory(category.id)}
                        className="bg-white/20 rounded-full p-0.5"
                      >
                        <XMarkIcon size={16} color="#FFFFFF" strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Categories List */}
          {!loading && !error && categories.length > 0 && (
            <View>
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Available Categories
              </Text>
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => toggleCategory(category.id)}
                    className={`mb-3 rounded-2xl border-2 p-4 ${
                      isSelected
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                        : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-[#334155]'
                    }`}
                  >
                    <View className="flex-row items-start">
                      {/* Category Icon */}
                      <View className="mr-3">
                        {category.icon_url && !imageErrors[category.id] ? (
                          <Image
                            source={{ uri: category.icon_url }}
                            className="w-12 h-12 rounded-xl"
                            resizeMode="cover"
                            onError={() => handleImageError(category.id)}
                          />
                        ) : (
                          <View className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-[#334155] items-center justify-center">
                            <TagIcon size={24} color="#9CA3AF" />
                          </View>
                        )}
                      </View>

                      {/* Category Info */}
                      <View className="flex-1 mr-3">
                        <Text
                          className={`text-base font-bold mb-1 ${
                            isSelected
                              ? 'text-primary-700 dark:text-primary-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {category.name}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          className={`text-sm ${
                            isSelected
                              ? 'text-primary-600 dark:text-primary-300'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {category.description}
                        </Text>
                      </View>

                      {/* Check Icon */}
                      <View className="justify-center">
                        {isSelected ? (
                          <CheckCircleIcon size={28} color="#F57C1F" />
                        ) : (
                          <View className="w-7 h-7 border-2 border-gray-300 dark:border-[#475569] rounded-full" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Empty State */}
          {!loading && !error && categories.length === 0 && (
            <View className="py-12 items-center">
              <TagIcon size={64} color="#9CA3AF" />
              <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
                No categories available at the moment
              </Text>
            </View>
          )}

          {/* Info Box */}
          {!loading && categories.length > 0 && (
            <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mt-6">
              <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
                💡 Tip
              </Text>
              <Text className="text-blue-600 dark:text-blue-300 text-xs">
                Select all categories that apply to your business. This helps clients find you more easily when searching for services.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={handleBack}
            className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-4 rounded-xl items-center"
          >
            <Text className="text-gray-700 dark:text-gray-300 font-bold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 bg-primary-500 py-4 rounded-xl items-center"
            disabled={selectedCategories.length === 0}
            style={{ opacity: selectedCategories.length === 0 ? 0.5 : 1 }}
          >
            <Text className="text-white font-bold">Next: Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}