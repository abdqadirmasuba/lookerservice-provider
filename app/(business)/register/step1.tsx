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
  TruckIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';
import KeyboardAvoidingWrapper from '@/src/components/common/KeyboardAvoidingWrapper';
import LocationPicker from '@/src/components/forms/LocationPicker';
import {
  setBusinessInfo,
  setLocation,
  ServiceDeliveryType,
} from '@/src/store/slices/businessRegistrationSlice';
import { RootState } from '@/src/store';

const DELIVERY_TYPES: { value: ServiceDeliveryType; label: string; description: string }[] = [
  { value: 'onsite', label: 'On-site', description: "You travel to the client's location" },
  { value: 'remote', label: 'Remote', description: 'Service delivered online or remotely' },
  { value: 'both', label: 'Both', description: 'On-site and remote options available' },
];

export default function BusinessStep1Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const reg = useSelector((state: RootState) => state.businessRegistration);

  const [businessName, setBusinessName] = useState(reg.business_name);
  const [description, setDescription] = useState(reg.business_description);
  const [deliveryType, setDeliveryType] = useState<ServiceDeliveryType>(reg.service_delivery_type);

  // location state — auto-filled from map, editable by user
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
    reg.latitude && reg.longitude ? { latitude: reg.latitude, longitude: reg.longitude } : null
  );
  const [address, setAddress] = useState(reg.address);
  const [city, setCity] = useState(reg.city);
  const [stateRegion, setStateRegion] = useState(reg.state_region);
  const [country, setCountry] = useState(reg.country || 'Uganda');

  const hasLocation = !!coords;

  const handleLocationSelect = (location: any) => {
    setCoords({ latitude: location.latitude, longitude: location.longitude });
    setAddress(location.address || '');
    setCity(location.city || '');
    setStateRegion(location.state_region || '');
    setCountry(location.country || 'Uganda');
  };

  const handleNext = () => {
    if (!businessName.trim()) {
      Alert.alert('Required', 'Please enter your business name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required', 'Please enter a business description');
      return;
    }
    if (!deliveryType) {
      Alert.alert('Required', 'Please select a service delivery type');
      return;
    }
    if (!coords) {
      Alert.alert('Required', 'Please pin your business location on the map');
      return;
    }
    if (!address.trim() || !city.trim() || !stateRegion.trim() || !country.trim()) {
      Alert.alert('Required', 'Please fill in all location fields');
      return;
    }

    dispatch(
      setBusinessInfo({
        business_name: businessName,
        business_description: description,
        service_delivery_type: deliveryType,
      })
    );
    dispatch(
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: address.trim(),
        city: city.trim(),
        state_region: stateRegion.trim(),
        country: country.trim(),
      })
    );

    router.push('/(business)/register/step2');
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

            <View className="space-y-5">
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
                    placeholder="Describe what your business does, services offered, specialisations..."
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

              {/* Service Delivery Type */}
              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Delivery Type <Text className="text-red-500">*</Text>
                </Text>
                <View className="space-y-2">
                  {DELIVERY_TYPES.map((type) => {
                    const isSelected = deliveryType === type.value;
                    return (
                      <TouchableOpacity
                        key={type.value}
                        onPress={() => setDeliveryType(type.value)}
                        className={`flex-row items-center p-4 rounded-xl border-2 ${
                          isSelected
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                            : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-[#334155]'
                        }`}
                      >
                        <TruckIcon size={22} color={isSelected ? '#F57C1F' : '#6B7280'} />
                        <View className="flex-1 ml-3">
                          <Text
                            className={`font-semibold text-sm ${
                              isSelected
                                ? 'text-primary-700 dark:text-primary-400'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {type.label}
                          </Text>
                          <Text
                            className={`text-xs mt-0.5 ${
                              isSelected
                                ? 'text-primary-600 dark:text-primary-300'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {type.description}
                          </Text>
                        </View>
                        {isSelected && <CheckCircleIcon size={24} color="#F57C1F" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* ── Location Section ── */}
              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Location <Text className="text-red-500">*</Text>
                </Text>

                {/* Map Picker Button */}
                <TouchableOpacity
                  onPress={() => setLocationPickerVisible(true)}
                  className={`flex-row items-center rounded-xl px-4 py-4 mb-3 border-2 ${
                    hasLocation
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-400'
                      : 'bg-white dark:bg-[#1E293B] border-dashed border-gray-300 dark:border-[#334155]'
                  }`}
                >
                  <MapPinIcon size={22} color={hasLocation ? '#F57C1F' : '#6B7280'} />
                  <View className="flex-1 ml-3">
                    {hasLocation ? (
                      <>
                        <Text className="text-primary-700 dark:text-primary-400 font-semibold text-sm">
                          Location pinned on map
                        </Text>
                        <Text className="text-xs text-primary-500 mt-0.5">
                          {coords!.latitude.toFixed(5)}, {coords!.longitude.toFixed(5)}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-gray-500">Tap to pick location on map</Text>
                    )}
                  </View>
                  <Text className="text-primary-500 font-semibold text-sm">
                    {hasLocation ? 'Change' : 'Open Map'}
                  </Text>
                </TouchableOpacity>

                {/* Editable location fields */}
                <View className="space-y-3">
                  <View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                      Address
                    </Text>
                    <View className="flex-row items-center bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4">
                      <MapPinIcon size={18} color="#9CA3AF" />
                      <TextInput
                        placeholder="Street / trading centre"
                        placeholderTextColor="#9CA3AF"
                        value={address}
                        onChangeText={setAddress}
                        className="flex-1 py-3 ml-2 text-gray-900 dark:text-white text-sm"
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                      City / Town
                    </Text>
                    <TextInput
                      placeholder="e.g., Gayaza"
                      placeholderTextColor="#9CA3AF"
                      value={city}
                      onChangeText={setCity}
                      className="bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm"
                    />
                  </View>

                  <View className="flex-row space-x-3">
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                        State / Region
                      </Text>
                      <TextInput
                        placeholder="e.g., Wakiso"
                        placeholderTextColor="#9CA3AF"
                        value={stateRegion}
                        onChangeText={setStateRegion}
                        className="bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                        Country
                      </Text>
                      <TextInput
                        placeholder="e.g., Uganda"
                        placeholderTextColor="#9CA3AF"
                        value={country}
                        onChangeText={setCountry}
                        className="bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm"
                      />
                    </View>
                  </View>
                </View>

                <Text className="text-xs text-gray-500 mt-2">
                  Use the map to pin your exact location. Fields auto-fill but can be edited.
                </Text>
              </View>

              {/* Tip */}
              <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">
                  💡 Tip
                </Text>
                <Text className="text-blue-600 dark:text-blue-300 text-xs">
                  A clear description, correct delivery type and precise location helps clients find and trust your business.
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
        initialLocation={
          coords
            ? {
                latitude: coords.latitude,
                longitude: coords.longitude,
                address,
                city,
                state_region: stateRegion,
                country,
                postal_code: '',
              }
            : null
        }
      />
    </SafeAreaView>
  );
}