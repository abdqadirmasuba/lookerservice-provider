// File: app/(business)/register/step3.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RectangleGroupIcon,
  XMarkIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setGroupIds } from '@/src/store/slices/businessRegistrationSlice';
import { RootState } from '@/src/store';
import { getActiveGroups } from '@/src/utils/business';
import SvgIcon from '@/src/components/common/SvgIcon';

const TOTAL_STEPS = 4;
const CURRENT_STEP = 3;
const STEP_LABELS = ['Business Info', 'Hours', 'Service Area', 'Review'];

interface Group {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  sort_order: number;
  status: string;
}

export default function BusinessStep3Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const reg = useSelector((state: RootState) => state.businessRegistration);

  const [selectedId, setSelectedId] = useState<string>(reg.group_id || '');
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(err.message || 'Failed to load service areas');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    Alert.alert(
      'Cancel Registration',
      'Your registration progress will be lost. Are you sure you want to exit?',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => router.replace('/(tabs)') },
      ],
    );
  };

  const navigateToStep = (step: number) => {
    if (step < CURRENT_STEP) {
      router.push(`/(business)/register/step${step}` as any);
    }
  };

  const handleNext = () => {
    if (!selectedId) {
      Alert.alert('Required', 'Please select the area your business operates in');
      return;
    }
    const selectedGroup = groups.find((g) => g.id === selectedId);
    dispatch(setGroupIds({ id: selectedId, name: selectedGroup?.name || '' }));
    router.push('/(business)/register/step4');
  };

  // Extract tint color from Iconify URL, e.g. ?color=%232196F3 => #2196F3
  const parseIconColor = (iconUrl: string): string => {
    const match = iconUrl?.match(/color=%23([A-Fa-f0-9]{6})/);
    return match ? `#${match[1]}` : '#9CA3AF';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Fixed Header */}
      <View className="px-5 pt-3 pb-3 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-base font-bold text-gray-900 dark:text-white">
               Business/ Individual/ Company Details
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Step {CURRENT_STEP} of {TOTAL_STEPS} — {STEP_LABELS[CURRENT_STEP - 1]}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            className="w-8 h-8 bg-gray-100 dark:bg-[#334155] rounded-full items-center justify-center"
          >
            <XMarkIcon size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <View className="flex-row" style={{ gap: 5 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigateToStep(i + 1)}
              disabled={i + 1 >= CURRENT_STEP}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: i + 1 <= CURRENT_STEP ? '#F97316' : isDark ? '#334155' : '#E5E7EB',
              }}
            />
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-5 py-6">



          {/* Loading */}
          {loading && (
            <View className="py-16 items-center">
              <ActivityIndicator size="large" color="#F97316" />
              <Text className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
                Loading service areas...
              </Text>
            </View>
          )}

          {/* Error */}
          {error && !loading && (
            <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-200 dark:border-red-800 mb-6">
              <Text className="text-red-600 dark:text-red-400 text-sm text-center mb-3">
                {error}
              </Text>
              <TouchableOpacity
                onPress={fetchGroups}
                className="flex-row items-center justify-center bg-red-500 py-2.5 px-5 rounded-xl self-center"
              >
                <ArrowPathIcon size={14} color="#fff" />
                <Text className="text-white font-semibold text-sm ml-1.5">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Groups list */}
          {!loading && !error && groups.length > 0 && (
            <View style={{ gap: 10 }}>
              {groups.map((group) => {
                const isSelected = selectedId === group.id;
                return (
                  <TouchableOpacity
                    key={group.id}
                    onPress={() => setSelectedId(isSelected ? '' : group.id)}
                    activeOpacity={0.75}
                    className={`rounded-2xl p-4 ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-900/20'
                        : 'bg-white dark:bg-[#1E293B]'
                    }`}
                    style={{
                      borderWidth: 2,
                      borderColor: isSelected ? '#F97316' : isDark ? '#334155' : '#E5E7EB',
                    }}
                  >
                    <View className="flex-row items-center">
                      {/* Icon */}
                      <View
                        className="mr-3 items-center justify-center rounded-xl"
                        style={{ width: 48, height: 48, backgroundColor: isSelected ? 'rgba(249,115,22,0.12)' : 'rgba(156,163,175,0.12)' }}
                      >
                        <SvgIcon uri={group.icon_url} size={28} fallback="💼" />
                      </View>

                      {/* Text */}
                      <View className="flex-1 mr-3">
                        <Text
                          className={`text-sm font-bold mb-0.5 ${
                            isSelected
                              ? 'text-orange-700 dark:text-orange-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {group.name}
                        </Text>
                        <Text
                          numberOfLines={2}
                          className={`text-xs leading-tight ${
                            isSelected
                              ? 'text-orange-600 dark:text-orange-300'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {group.description}
                        </Text>
                      </View>

                      {/* Selection indicator */}
                      {isSelected ? (
                        <CheckCircleIcon size={24} color="#F97316" />
                      ) : (
                        <View
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            borderWidth: 2,
                            borderColor: isDark ? '#475569' : '#D1D5DB',
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Empty */}
          {!loading && !error && groups.length === 0 && (
            <View className="py-16 items-center">
              <RectangleGroupIcon size={56} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center text-sm">
                No service areas available at the moment
              </Text>
            </View>
          )}

          {/* Tip */}
          {!loading && groups.length > 0 && (
            <View className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-200 dark:border-sky-800 mt-6">
              <Text className="text-sky-700 dark:text-sky-400 text-xs">
                Choose the category that most closely matches what your business does. This helps clients find you.
              </Text>
            </View>
          )}

          {/* Group lock warning */}
          {!loading && (
            <View className="flex-row items-start mt-3 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800">
              <ExclamationTriangleIcon size={14} color="#D97706" />
              <Text className="text-xs text-amber-700 dark:text-amber-400 ml-2 flex-1">
                Your service group cannot be changed after registration. If you need to update it, contact our support team.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View className="px-5 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        <View className="flex-row" style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] py-4 rounded-xl items-center"
          >
            <Text className="text-gray-700 dark:text-gray-300 font-bold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={!selectedId}
            style={{ opacity: selectedId ? 1 : 0.45 }}
            className="flex-1 bg-orange-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Next: Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
