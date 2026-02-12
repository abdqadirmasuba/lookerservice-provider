// File: app/(business)/[id]/edit.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  MapPinIcon,
} from 'react-native-heroicons/outline';

export default function EditBusinessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;

  // Mock existing data
  const [businessName, setBusinessName] = useState('Doe Plumbing Services');
  const [businessPhone, setBusinessPhone] = useState('701 234 567');
  const [businessEmail, setBusinessEmail] = useState('info@doeplumbing.com');
  const [description, setDescription] = useState('Professional plumbing services with 10+ years of experience.');
  const [address, setAddress] = useState('Plot 123, Main Street');
  const [city, setCity] = useState('Kampala');
  const [district, setDistrict] = useState('Kampala');
  const [region, setRegion] = useState('Central');

  const handleSave = () => {
    if (!businessName.trim() || !businessPhone.trim() || !description.trim()) {
      Alert.alert('Required', 'Please fill in all required fields');
      return;
    }

    // TODO: Save to API
    Alert.alert('Success', 'Business information updated successfully!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeftIcon size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1">
              Edit Business
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text className="text-primary-500 font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="px-6 py-6">
            {/* Business Details Section */}
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
              <View className="flex-row items-center mb-4">
                <BuildingStorefrontIcon size={24} color="#F57C1F" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
                  Business Details
                </Text>
              </View>

              <View className="space-y-4">
                {/* Business Name */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Name <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter business name"
                    placeholderTextColor="#6B7280"
                    value={businessName}
                    onChangeText={setBusinessName}
                    className="bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>

                {/* Business Phone */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Phone <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="flex-row items-center bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4">
                    <Text className="text-gray-600 dark:text-gray-400">+256</Text>
                    <TextInput
                      placeholder="701 234 567"
                      placeholderTextColor="#6B7280"
                      value={businessPhone}
                      onChangeText={setBusinessPhone}
                      keyboardType="phone-pad"
                      className="flex-1 py-3 ml-2 text-gray-900 dark:text-white"
                    />
                  </View>
                </View>

                {/* Business Email */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Email
                  </Text>
                  <TextInput
                    placeholder="business@example.com"
                    placeholderTextColor="#6B7280"
                    value={businessEmail}
                    onChangeText={setBusinessEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>

                {/* Description */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="Describe your business..."
                    placeholderTextColor="#6B7280"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    className="bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                    style={{ minHeight: 120 }}
                  />
                </View>
              </View>
            </View>

            {/* Location Section */}
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
              <View className="flex-row items-center mb-4">
                <MapPinIcon size={24} color="#F57C1F" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
                  Location
                </Text>
              </View>

              <View className="space-y-4">
                {/* Address */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Street Address <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="e.g., Plot 123, Main Street"
                    placeholderTextColor="#6B7280"
                    value={address}
                    onChangeText={setAddress}
                    className="bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>

                {/* City */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="e.g., Kampala"
                    placeholderTextColor="#6B7280"
                    value={city}
                    onChangeText={setCity}
                    className="bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>

                {/* District */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    District <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    placeholder="e.g., Kampala"
                    placeholderTextColor="#6B7280"
                    value={district}
                    onChangeText={setDistrict}
                    className="bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>

                {/* Region */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region
                  </Text>
                  <TextInput
                    placeholder="e.g., Central"
                    placeholderTextColor="#6B7280"
                    value={region}
                    onChangeText={setRegion}
                    className="bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>
              </View>
            </View>

            {/* Info Box */}
            <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
                💡 Note
              </Text>
              <Text className="text-blue-600 dark:text-blue-300 text-xs">
                Changes to your business information may require admin approval before being visible to clients.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}