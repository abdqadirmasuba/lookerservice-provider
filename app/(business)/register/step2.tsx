// File: app/(business)/register/step2.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  ClockIcon,
} from 'react-native-heroicons/outline';
import { useDispatch, useSelector } from 'react-redux';
import { setBusinessHours } from '@/src/store/slices/businessRegistrationSlice';
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

export default function BusinessStep2Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const businessRegistration = useSelector(
    (state: RootState) => state.businessRegistration
  );

  const [hours, setHours] = useState<{ [key: string]: { enabled: boolean; hours: string } }>(
    DAYS.reduce((acc, day) => {
      const savedHours = businessRegistration.business_hours[day.key as keyof typeof businessRegistration.business_hours];
      acc[day.key] = {
        enabled: !!savedHours,
        hours: savedHours || '08:00-18:00',
      };
      return acc;
    }, {} as { [key: string]: { enabled: boolean; hours: string } })
  );

  const toggleDay = (dayKey: string) => {
    setHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled,
      },
    }));
  };

  const updateHours = (dayKey: string, newHours: string) => {
    setHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        hours: newHours,
      },
    }));
  };

  const setAllDays = () => {
    const defaultHours = '08:00-18:00';
    const newHours = { ...hours };
    DAYS.forEach((day) => {
      newHours[day.key] = { enabled: true, hours: defaultHours };
    });
    setHours(newHours);
  };

  const handleNext = () => {
    // Validate hours format
    const enabledDays = Object.keys(hours).filter((key) => hours[key].enabled);
    
    for (const day of enabledDays) {
      const hourString = hours[day].hours;
      if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(hourString)) {
        Alert.alert('Invalid Format', 'Please use format HH:MM-HH:MM (e.g., 08:00-18:00)');
        return;
      }
    }

    // Save to Redux store
    const businessHours: any = {};
    Object.keys(hours).forEach((key) => {
      if (hours[key].enabled) {
        businessHours[key] = hours[key].hours;
      }
    });
    dispatch(setBusinessHours(businessHours));

    router.push('/(business)/register/step3');
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
              Step 2 of 5
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-2 bg-gray-200 dark:bg-[#334155] rounded-full overflow-hidden">
          <View className="h-full w-[40%] bg-primary-500 rounded-full" />
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
              <ClockIcon size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Business Hours
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-400 px-8">
              When is your business open? (Optional)
            </Text>
          </View>

          {/* Quick Set Button */}
          <TouchableOpacity
            onPress={setAllDays}
            className="bg-primary-50 dark:bg-primary-900/20 border border-primary-300 dark:border-primary-700 rounded-xl p-3 mb-6"
          >
            <Text className="text-primary-600 dark:text-primary-400 font-semibold text-center">
              Set All Days to 08:00-18:00
            </Text>
          </TouchableOpacity>

          {/* Days List */}
          <View className="space-y-3">
            {DAYS.map((day) => (
              <View
                key={day.key}
                className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-gray-200 dark:border-[#334155]"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-base font-semibold text-gray-900 dark:text-white">
                    {day.label}
                  </Text>
                  <Switch
                    value={hours[day.key]?.enabled || false}
                    onValueChange={() => toggleDay(day.key)}
                    trackColor={{ false: '#D1D5DB', true: '#FED7AA' }}
                    thumbColor={hours[day.key]?.enabled ? '#F57C1F' : '#F3F4F6'}
                  />
                </View>

                {hours[day.key]?.enabled && (
                  <View className="flex-row items-center border border-gray-300 dark:border-[#334155] rounded-lg px-3 py-2 bg-gray-50 dark:bg-[#0F172A]">
                    <ClockIcon size={18} color="#6B7280" />
                    <TextInput
                      placeholder="08:00-18:00"
                      placeholderTextColor="#6B7280"
                      value={hours[day.key]?.hours || ''}
                      onChangeText={(text) => updateHours(day.key, text)}
                      className="flex-1 ml-2 text-gray-900 dark:text-white"
                    />
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mt-6">
            <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
              💡 Format
            </Text>
            <Text className="text-blue-600 dark:text-blue-300 text-xs">
              Use HH:MM-HH:MM format (24-hour). Example: 08:00-18:00 or 09:00-16:00. You can skip this step and add hours later.
            </Text>
          </View>
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
          >
            <Text className="text-white font-bold">Next: Photos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}