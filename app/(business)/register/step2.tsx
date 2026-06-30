// File: app/(business)/register/step2.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ClockIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBusinessHours,
  DayMode,
  DayHoursState,
} from '@/src/store/slices/businessRegistrationSlice';
import { RootState } from '@/src/store';

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

const MODE_OPTIONS: { value: DayMode; label: string }[] = [
  { value: 'closed', label: 'Closed' },
  { value: 'working', label: 'Working Hours' },
  { value: 'fullday', label: '24 / 7' },
];

function isValidTime(t: string) {
  return /^\d{2}:\d{2}$/.test(t);
}

const TOTAL_STEPS = 4;
const CURRENT_STEP = 2;
const STEP_LABELS = ['Business Info', 'Hours', 'Service Area', 'Review'];

export default function BusinessStep2Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const reg = useSelector((state: RootState) => state.businessRegistration);

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

  const [hours, setHours] = useState<{ [key: string]: DayHoursState }>(
    DAYS.reduce((acc, day) => {
      const saved = reg.business_hours[day.key];
      acc[day.key] = saved ?? { mode: 'working', open: '08:00', close: '18:00' };
      return acc;
    }, {} as { [key: string]: DayHoursState })
  );

  const setMode = (dayKey: string, mode: DayMode) => {
    setHours((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], mode },
    }));
  };

  const setTime = (dayKey: string, field: 'open' | 'close', value: string) => {
    setHours((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value },
    }));
  };

  const setAllWeekdays = () => {
    const updated = { ...hours };
    DAYS.forEach((d) => {
      updated[d.key] = { mode: 'working', open: '08:00', close: '18:00' };
    });
    // weekend defaults
    updated['sat'] = { mode: 'working', open: '09:00', close: '16:00' };
    updated['sun'] = { mode: 'closed', open: '08:00', close: '18:00' };
    setHours(updated);
  };

  const handleNext = () => {
    // Validate time inputs for 'working' days
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

    dispatch(setBusinessHours(hours));
    router.push('/(business)/register/step3');
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
        <View className="px-6 py-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Work Hours 
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Set your operating schedule for each day
          </Text>

          {/* Quick Preset */}
          <TouchableOpacity
            onPress={setAllWeekdays}
            className="bg-primary-50 dark:bg-primary-900/20 border border-primary-300 dark:border-primary-700 rounded-xl p-3 mb-6"
          >
            <Text className="text-primary-600 dark:text-primary-400 font-semibold text-center text-sm">
              Apply Mon–Fri 08:00–18:00 / Sat 09:00–16:00 / Sun Closed
            </Text>
          </TouchableOpacity>

          {/* Legend */}
          <View className="flex-row justify-center space-x-4 mb-5">
            {MODE_OPTIONS.map((opt) => (
              <View key={opt.value} className="flex-row items-center space-x-1 mr-2">
                <View
                  className={`w-3 h-3 rounded-full ${
                    opt.value === 'closed'
                      ? 'bg-red-400'
                      : opt.value === 'working'
                      ? 'bg-primary-500'
                      : 'bg-green-500'
                  }`}
                />
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {opt.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Days List */}
          <View className="space-y-3">
            {DAYS.map((day) => {
              const d = hours[day.key];
              return (
                <View
                  key={day.key}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden"
                >
                  {/* Day header row */}
                  <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#334155]">
                    <Text className="text-sm font-bold text-gray-900 dark:text-white w-20">
                      {day.label}
                    </Text>
                    {/* Mode toggle - 3 buttons */}
                    <View className="flex-row bg-gray-100 dark:bg-[#0F172A] rounded-lg overflow-hidden">
                      {MODE_OPTIONS.map((opt) => {
                        const active = d.mode === opt.value;
                        const activeColor =
                          opt.value === 'closed'
                            ? 'bg-red-500'
                            : opt.value === 'working'
                            ? 'bg-primary-500'
                            : 'bg-green-500';
                        return (
                          <TouchableOpacity
                            key={opt.value}
                            onPress={() => setMode(day.key, opt.value)}
                            className={`px-3 py-1.5 ${active ? activeColor : ''}`}
                          >
                            <Text
                              className={`text-xs font-semibold ${
                                active ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {opt.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Time inputs — shown only for 'working' mode */}
                  {d.mode === 'working' && (
                    <View className="flex-row items-center px-4 py-3 space-x-3">
                      <ClockIcon size={16} color="#9CA3AF" />
                      <View className="flex-row items-center flex-1 space-x-2">
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
                    </View>
                  )}

                  {d.mode === 'closed' && (
                    <View className="px-4 py-3">
                      <Text className="text-xs text-red-500 font-medium">
                        Closed — not available 
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
              "Closed" days are marked in your schedule. "24/7" days indicate always-open availability and are excluded from the timed schedule. Times use 24-hour format.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-gray-100 mr-2 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-4 rounded-xl items-center"
          >
            <Text className="text-gray-700 dark:text-gray-300 font-bold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 bg-primary-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Next: Area of Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}