// File: app/(business)/[id]/edit-hours.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ClockIcon } from 'react-native-heroicons/outline';
import { getProviderProfile, updateBusinessHours } from '@/src/utils/business';

const DAYS = [
  { key: 'mon', full: 'monday',    label: 'Monday'    },
  { key: 'tue', full: 'tuesday',   label: 'Tuesday'   },
  { key: 'wed', full: 'wednesday', label: 'Wednesday' },
  { key: 'thu', full: 'thursday',  label: 'Thursday'  },
  { key: 'fri', full: 'friday',    label: 'Friday'    },
  { key: 'sat', full: 'saturday',  label: 'Saturday'  },
  { key: 'sun', full: 'sunday',    label: 'Sunday'    },
];

type DayMode = 'closed' | 'working' | 'fullday';

interface DayState {
  mode: DayMode;
  open: string;
  close: string;
}

const MODE_OPTIONS: { value: DayMode; label: string }[] = [
  { value: 'closed',  label: 'Closed'         },
  { value: 'working', label: 'Working Hours'   },
  { value: 'fullday', label: '24 / 7'          },
];

function isValidTime(t: string) {
  return /^\d{2}:\d{2}$/.test(t);
}

export default function EditBusinessHoursScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const isDark = useColorScheme() === 'dark';

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hours, setHours] = useState<{ [key: string]: DayState }>(
    DAYS.reduce((acc, day) => {
      acc[day.key] = { mode: 'working', open: '08:00', close: '18:00' };
      return acc;
    }, {} as { [key: string]: DayState })
  );

  useEffect(() => {
    getProviderProfile(businessId)
      .then((res) => {
        const profileHours = res.data?.business_hours;
        if (profileHours) {
          const newState: { [key: string]: DayState } = {};
          DAYS.forEach((day) => {
            const h = profileHours[day.full];
            newState[day.key] = h
              ? { mode: h.is_open ? 'working' : 'closed', open: h.open || '08:00', close: h.close || '18:00' }
              : { mode: 'working', open: '08:00', close: '18:00' };
          });
          setHours(newState);
        }
      })
      .catch(() => Alert.alert('Error', 'Failed to load business hours'))
      .finally(() => setLoadingProfile(false));
  }, [businessId]);

  const setMode = (dayKey: string, mode: DayMode) =>
    setHours((prev) => ({ ...prev, [dayKey]: { ...prev[dayKey], mode } }));

  const setTime = (dayKey: string, field: 'open' | 'close', value: string) =>
    setHours((prev) => ({ ...prev, [dayKey]: { ...prev[dayKey], [field]: value } }));

  const applyPreset = () => {
    const preset: { [key: string]: DayState } = {};
    DAYS.forEach((d) => { preset[d.key] = { mode: 'working', open: '08:00', close: '18:00' }; });
    preset['sat'] = { mode: 'working', open: '09:00', close: '16:00' };
    preset['sun'] = { mode: 'closed', open: '08:00', close: '18:00' };
    setHours(preset);
  };

  const handleSave = async () => {
    for (const day of DAYS) {
      const d = hours[day.key];
      if (d.mode === 'working') {
        if (!isValidTime(d.open) || !isValidTime(d.close)) {
          Alert.alert('Invalid Time', `${day.label}: use HH:MM format (e.g. 08:00)`);
          return;
        }
        if (d.open >= d.close) {
          Alert.alert('Invalid Time', `${day.label}: closing time must be after opening time`);
          return;
        }
      }
    }

    const businessHoursBody: { [key: string]: string } = {};
    DAYS.forEach((day) => {
      const d = hours[day.key];
      if (d.mode === 'working')      businessHoursBody[day.key] = `${d.open}-${d.close}`;
      else if (d.mode === 'fullday') businessHoursBody[day.key] = '00:00-00:00';
      else                           businessHoursBody[day.key] = 'closed';
    });

    try {
      setSaving(true);
      await updateBusinessHours(businessId, businessHoursBody);
      Alert.alert('Saved', 'Business hours updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save business hours');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeftIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">Business Hours</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Set your weekly availability schedule
            </Text>
          </View>
        </View>
      </View>

      {loadingProfile ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F57C1F" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4">Loading current hours...</Text>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="px-6 py-6">

              {/* Quick preset */}
              <TouchableOpacity
                onPress={applyPreset}
                className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-300 dark:border-indigo-700 rounded-xl p-3 mb-6"
              >
                <Text className="text-indigo-600 dark:text-indigo-400 font-semibold text-center text-sm">
                  Apply Mon–Fri 08:00–18:00 / Sat 09:00–16:00 / Sun Closed
                </Text>
              </TouchableOpacity>

              {/* Days list */}
              <View style={{ gap: 10 }}>
                {DAYS.map((day) => {
                  const d = hours[day.key];
                  return (
                    <View
                      key={day.key}
                      className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden"
                    >
                      {/* Day header */}
                      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#334155]">
                        <Text className="text-sm font-bold text-gray-900 dark:text-white w-24">
                          {day.label}
                        </Text>
                        <View className="flex-row bg-gray-100 dark:bg-[#0F172A] rounded-lg overflow-hidden">
                          {MODE_OPTIONS.map((opt) => {
                            const active = d.mode === opt.value;
                            const activeColor =
                              opt.value === 'closed'  ? 'bg-red-500'    :
                              opt.value === 'working' ? 'bg-indigo-500' : 'bg-green-500';
                            return (
                              <TouchableOpacity
                                key={opt.value}
                                onPress={() => setMode(day.key, opt.value)}
                                className={`px-3 py-1.5 ${active ? activeColor : ''}`}
                              >
                                <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                  {opt.label}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>

                      {d.mode === 'working' && (
                        <View className="flex-row items-center px-4 py-3" style={{ gap: 8 }}>
                          <ClockIcon size={16} color="#9CA3AF" />
                          <TextInput
                            value={d.open}
                            onChangeText={(v) => setTime(day.key, 'open', v)}
                            placeholder="08:00"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numbers-and-punctuation"
                            maxLength={5}
                            className="flex-1 text-center bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-lg py-2 text-gray-900 dark:text-white text-sm"
                          />
                          <Text className="text-gray-400 font-bold">–</Text>
                          <TextInput
                            value={d.close}
                            onChangeText={(v) => setTime(day.key, 'close', v)}
                            placeholder="18:00"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numbers-and-punctuation"
                            maxLength={5}
                            className="flex-1 text-center bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-lg py-2 text-gray-900 dark:text-white text-sm"
                          />
                        </View>
                      )}

                      {d.mode === 'closed' && (
                        <View className="px-4 py-3">
                          <Text className="text-xs text-red-500 font-medium">
                            Closed — not included in schedule
                          </Text>
                        </View>
                      )}

                      {d.mode === 'fullday' && (
                        <View className="px-4 py-3">
                          <Text className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Open 24 / 7 — always available
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mt-6">
                <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
                  💡 Note
                </Text>
                <Text className="text-blue-600 dark:text-blue-300 text-xs">
                  Times use 24-hour format. "24/7" days indicate always-open availability.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Save button */}
          <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className="bg-orange-500 py-4 rounded-xl items-center"
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Save Business Hours</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
