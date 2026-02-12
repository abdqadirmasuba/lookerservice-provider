// File: app/(business)/register/step2.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  MapPinIcon,
  GlobeAltIcon,
} from 'react-native-heroicons/outline';

export default function BusinessStep2Screen() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');

  const handleNext = () => {
    if (!address.trim() || !city.trim() || !district.trim()) {
      Alert.alert('Required', 'Please fill in all required location fields');
      return;
    }

    router.push('/(business)/register/step3');
  };

  const handleBack = () => {
    router.back();
  };

  const handleUseCurrentLocation = () => {
    Alert.alert(
      'Use Current Location',
      'This will use your device GPS to get your business location',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Allow',
          onPress: () => {
            // TODO: Implement GPS location fetch
            Alert.alert('Success', 'Location detected!');
          },
        },
      ]
    );
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
              <MapPinIcon size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Business Location
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-400 px-8">
              Where is your business located?
            </Text>
          </View>

          {/* Current Location Button */}
          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-700 rounded-xl p-4 mb-6 flex-row items-center justify-center"
          >
            <GlobeAltIcon size={24} color="#2DA9E9" />
            <Text className="text-blue-600 dark:text-blue-400 font-bold ml-3">
              Use Current Location
            </Text>
          </TouchableOpacity>

          {/* Form */}
          <View className="space-y-4">
            {/* Street Address */}
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Street Address / Building <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4">
                <MapPinIcon size={20} color="#6B7280" />
                <TextInput
                  placeholder="e.g., Plot 123, Main Street"
                  placeholderTextColor="#6B7280"
                  value={address}
                  onChangeText={setAddress}
                  className="flex-1 py-4 ml-3 text-gray-900 dark:text-white"
                />
              </View>
            </View>

            {/* City */}
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City / Town <Text className="text-red-500">*</Text>
              </Text>
              <View className="bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4">
                <TextInput
                  placeholder="e.g., Kampala"
                  placeholderTextColor="#6B7280"
                  value={city}
                  onChangeText={setCity}
                  className="py-4 text-gray-900 dark:text-white"
                />
              </View>
            </View>

            {/* District */}
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                District <Text className="text-red-500">*</Text>
              </Text>
              <View className="bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4">
                <TextInput
                  placeholder="e.g., Kampala"
                  placeholderTextColor="#6B7280"
                  value={district}
                  onChangeText={setDistrict}
                  className="py-4 text-gray-900 dark:text-white"
                />
              </View>
            </View>

            {/* Region (Optional) */}
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Region (Optional)
              </Text>
              <View className="bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4">
                <TextInput
                  placeholder="e.g., Central"
                  placeholderTextColor="#6B7280"
                  value={region}
                  onChangeText={setRegion}
                  className="py-4 text-gray-900 dark:text-white"
                />
              </View>
            </View>

            {/* Map Placeholder */}
            <View className="bg-gray-200 dark:bg-[#1E293B] h-48 rounded-xl items-center justify-center border border-gray-300 dark:border-[#334155]">
              <MapPinIcon size={48} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 mt-2">Map Preview</Text>
              <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Location will be shown here
              </Text>
            </View>

            {/* Info Box */}
            <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
                📍 Location Visibility
              </Text>
              <Text className="text-blue-600 dark:text-blue-300 text-xs">
                Your exact location will be shown to clients only after they book your service. Your general area will be visible in search.
              </Text>
            </View>
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