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
  RectangleGroupIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setGroupIds } from '@/src/store/slices/businessRegistrationSlice';
import { RootState } from '@/src/store';
import { getActiveGroups } from '@/src/utils/business';

interface Group {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const MAX_GROUPS = 3;

export default function BusinessStep4Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const reg = useSelector((state: RootState) => state.businessRegistration);

  const [selectedIds, setSelectedIds] = useState<string[]>(reg.group_ids);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActiveGroups();
      setGroups(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((s) => s !== id));
    } else {
      if (selectedIds.length >= MAX_GROUPS) {
        Alert.alert('Maximum reached', `You can select up to ${MAX_GROUPS} business groups.`);
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeGroup = (id: string) => {
    setSelectedIds(selectedIds.filter((s) => s !== id));
  };

  const getSelectedGroupObjects = () => groups.filter((g) => selectedIds.includes(g.id));

  const handleNext = () => {
    if (selectedIds.length === 0) {
      Alert.alert('Required', 'Please select at least one business group');
      return;
    }
    dispatch(setGroupIds(selectedIds));
    router.push('/(business)/register/step5');
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
              Step 4 of 5
            </Text>
          </View>
        </View>
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
              <RectangleGroupIcon size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Business Groups
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-400 px-8">
              Select 1�{MAX_GROUPS} groups that best describe your business
            </Text>
          </View>

          {/* Loading */}
          {loading && (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color="#F57C1F" />
              <Text className="text-gray-600 dark:text-gray-400 mt-4">Loading groups...</Text>
            </View>
          )}

          {/* Error */}
          {error && !loading && (
            <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 mb-6">
              <Text className="text-red-700 dark:text-red-400 text-center mb-3">{error}</Text>
              <TouchableOpacity onPress={fetchGroups} className="bg-red-600 py-2 px-4 rounded-lg">
                <Text className="text-white text-center font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Selected Groups Chips */}
          {!loading && selectedIds.length > 0 && (
            <View className="mb-5">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Selected ({selectedIds.length}/{MAX_GROUPS})
              </Text>
              <View className="flex-row flex-wrap -mx-1">
                {getSelectedGroupObjects().map((g) => (
                  <View key={g.id} className="px-1 mb-2">
                    <View className="bg-primary-500 rounded-full px-4 py-2 flex-row items-center">
                      <Text className="text-white font-semibold text-sm mr-2" numberOfLines={1}>
                        {g.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeGroup(g.id)}
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

          {/* Groups List */}
          {!loading && !error && groups.length > 0 && (
            <View className="space-y-3">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Available Groups
              </Text>
              {groups.map((group) => {
                const isSelected = selectedIds.includes(group.id);
                const isDisabled = !isSelected && selectedIds.length >= MAX_GROUPS;
                return (
                  <TouchableOpacity
                    key={group.id}
                    onPress={() => toggleGroup(group.id)}
                    disabled={isDisabled}
                    className={`rounded-2xl border-2 p-4 ${
                      isSelected
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                        : isDisabled
                        ? 'bg-gray-50 dark:bg-[#1E293B] border-gray-200 dark:border-[#334155] opacity-50'
                        : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-[#334155]'
                    }`}
                  >
                    <View className="flex-row items-center">
                      {/* Group Icon */}
                      <View className="mr-3">
                        {group.icon_url && !imageErrors[group.id] ? (
                          <Image
                            source={{ uri: group.icon_url }}
                            className="w-12 h-12 rounded-xl"
                            resizeMode="contain"
                            onError={() =>
                              setImageErrors((p) => ({ ...p, [group.id]: true }))
                            }
                          />
                        ) : (
                          <View className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-[#334155] items-center justify-center">
                            <RectangleGroupIcon size={24} color="#9CA3AF" />
                          </View>
                        )}
                      </View>

                      {/* Group Info */}
                      <View className="flex-1 mr-3">
                        <Text
                          className={`text-sm font-bold mb-0.5 ${
                            isSelected
                              ? 'text-primary-700 dark:text-primary-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {group.name}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          className={`text-xs leading-tight ${
                            isSelected
                              ? 'text-primary-600 dark:text-primary-300'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {group.description}
                        </Text>
                      </View>

                      {/* Check */}
                      {isSelected ? (
                        <CheckCircleIcon size={26} color="#F57C1F" />
                      ) : (
                        <View className="w-6 h-6 border-2 border-gray-300 dark:border-[#475569] rounded-full" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Empty State */}
          {!loading && !error && groups.length === 0 && (
            <View className="py-12 items-center">
              <RectangleGroupIcon size={64} color="#9CA3AF" />
              <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
                No groups available at the moment
              </Text>
            </View>
          )}

          {/* Tip */}
          {!loading && groups.length > 0 && (
            <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mt-6">
              <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
                ?? Tip
              </Text>
              <Text className="text-blue-600 dark:text-blue-300 text-xs">
                Choose up to {MAX_GROUPS} groups that best match your business. This helps clients find you in the right categories.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-4 rounded-xl items-center"
          >
            <Text className="text-gray-700 dark:text-gray-300 font-bold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={selectedIds.length === 0}
            style={{ opacity: selectedIds.length === 0 ? 0.5 : 1 }}
            className="flex-1 bg-primary-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Next: Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
