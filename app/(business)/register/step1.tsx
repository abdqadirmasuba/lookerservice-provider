// File: app/(business)/register/step1.tsx

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
  BuildingStorefrontIcon,
  DocumentTextIcon,
  MapPinIcon,
} from 'react-native-heroicons/outline';
import { useDispatch, useSelector } from 'react-redux';
import KeyboardAvoidingWrapper from '@/src/components/common/KeyboardAvoidingWrapper';
import LocationPicker from '@/src/components/forms/LocationPicker';
import { setBusinessInfo, setLocation } from '@/src/store/slices/businessRegistrationSlice';
import { RootState } from '@/src/store';

export default function BusinessStep1Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const businessRegistration = useSelector(
    (state: RootState) => state.businessRegistration
  );

  const [businessName, setBusinessName] = useState(
    businessRegistration.business_name
  );
  const [description, setDescription] = useState(
    businessRegistration.business_description
  );
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(
    businessRegistration.latitude && businessRegistration.longitude
      ? {
          latitude: businessRegistration.latitude,
          longitude: businessRegistration.longitude,
          address: businessRegistration.address,
          city: businessRegistration.city,
          state_region: businessRegistration.state_region,
          country: businessRegistration.country,
          postal_code: businessRegistration.postal_code,
        }
      : null
  );

  const handleNext = () => {
    // Validation
    if (!businessName.trim()) {
      Alert.alert('Required', 'Please enter your business name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required', 'Please enter a business description');
      return;
    }
    if (!selectedLocation) {
      Alert.alert('Required', 'Please select your business location');
      return;
    }

    // Save to Redux store
    dispatch(
      setBusinessInfo({
        business_name: businessName,
        business_description: description,
      })
    );
    dispatch(setLocation(selectedLocation));

    router.push('/(business)/register/step2');
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      <KeyboardAvoidingWrapper>
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
                Step 1 of 5
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="h-2 bg-gray-200 dark:bg-[#334155] rounded-full overflow-hidden">
            <View className="h-full w-[20%] bg-primary-500 rounded-full" />
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
                <BuildingStorefrontIcon size={40} color="#FFFFFF" />
              </LinearGradient>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Business Information
              </Text>
              <Text className="text-sm text-center text-gray-600 dark:text-gray-400 px-8">
                Tell us about your business and where it's located
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Business Name */}
              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Name <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row items-center bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4">
                  <BuildingStorefrontIcon size={20} color="#6B7280" />
                  <TextInput
                    placeholder="e.g., Manyangwa Cleaners"
                    placeholderTextColor="#6B7280"
                    value={businessName}
                    onChangeText={setBusinessName}
                    className="flex-1 py-4 ml-3 text-gray-900 dark:text-white"
                  />
                </View>
              </View>

              {/* Description */}
              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Description <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row items-start bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4">
                  <DocumentTextIcon size={20} color="#6B7280" className="mt-4" />
                  <TextInput
                    placeholder="Describe what your business does, services offered, specializations..."
                    placeholderTextColor="#6B7280"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    className="flex-1 py-4 ml-3 text-gray-900 dark:text-white"
                    style={{ minHeight: 120 }}
                  />
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  {description.length}/500 characters
                </Text>
              </View>

              {/* Location */}
              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Location <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setLocationPickerVisible(true)}
                  className="flex-row items-center bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-4"
                >
                  <MapPinIcon size={20} color="#6B7280" />
                  <View className="flex-1 ml-3">
                    {selectedLocation ? (
                      <>
                        <Text className="text-gray-900 dark:text-white font-medium">
                          {selectedLocation.address}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {selectedLocation.city}, {selectedLocation.state_region}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-gray-500">Tap to select location</Text>
                    )}
                  </View>
                  <Text className="text-primary-500 font-medium">
                    {selectedLocation ? 'Change' : 'Select'}
                  </Text>
                </TouchableOpacity>
                <Text className="text-xs text-gray-500 mt-1">
                  Use map to pick your exact business location
                </Text>
              </View>

              {/* Info Box */}
              <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
                  💡 Tip
                </Text>
                <Text className="text-blue-600 dark:text-blue-300 text-xs">
                  A clear description and precise location helps clients find and trust your business more easily.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
          <TouchableOpacity
            onPress={handleNext}
            className="bg-primary-500 py-4 rounded-xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              Next: Business Hours
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingWrapper>

      {/* Location Picker Modal */}
      <LocationPicker
        visible={locationPickerVisible}
        onClose={() => setLocationPickerVisible(false)}
        onSelect={handleLocationSelect}
        initialLocation={selectedLocation}
      />
    </SafeAreaView>
  );
}