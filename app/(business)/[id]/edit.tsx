// File: app/(business)/[id]/edit.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  MapPinIcon,
  TruckIcon,
  CameraIcon,
  LockClosedIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'expo-image-picker';
import LocationPicker from '@/src/components/forms/LocationPicker';
import { getProviderProfile, updateBusinessProfile } from '@/src/utils/business';

const DELIVERY_TYPES: {
  value: 'onsite' | 'remote' | 'both';
  label: string;
  description: string;
  dotColor: string;
}[] = [
  { value: 'onsite', label: 'On-site',  description: "You travel to the client's location",  dotColor: '#EF4444' },
  { value: 'remote', label: 'Remote',   description: 'Service delivered online or remotely', dotColor: '#3B82F6' },
  { value: 'both',   label: 'Both',     description: 'On-site and remote options available',  dotColor: '#10B981' },
];

export default function EditBusinessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const isDark = useColorScheme() === 'dark';

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  // Read-only
  const [businessName, setBusinessName] = useState('');

  // Editable
  const [description, setDescription] = useState('');
  const [deliveryType, setDeliveryType] = useState<'onsite' | 'remote' | 'both'>('onsite');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [country, setCountry] = useState('Uganda');
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const inactiveBorder = isDark ? '#334155' : '#D1D5DB';
  const activeBorder = '#06B6D4';
  const borderColor = (field: string) => activeField === field ? activeBorder : inactiveBorder;
  const hasLocation = !!coords;

  useEffect(() => {
    getProviderProfile(businessId)
      .then((res) => {
        const d = res.data;
        if (d) {
          setBusinessName(d.business_name || '');
          setDescription(d.business_description || '');
          setDeliveryType(d.service_delivery_type || 'onsite');
          setLogoUri(d.logo_url || null);
          setAddress(d.address || '');
          setCity(d.city || '');
          setStateRegion(d.state_region || '');
          setCountry(d.country || 'Uganda');
          if (d.location?.latitude && d.location?.longitude) {
            setCoords({ latitude: d.location.latitude, longitude: d.location.longitude });
          }
        }
      })
      .catch(() => Alert.alert('Error', 'Failed to load profile data'))
      .finally(() => setLoadingProfile(false));
  }, [businessId]);

  const handlePickLogo = () => {
    Alert.alert('Business Logo', 'Choose photo source', [
      {
        text: 'Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission Required', 'Photo library access is needed'); return; }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.85,
          });
          if (!result.canceled && result.assets[0]) setLogoUri(result.assets[0].uri);
        },
      },
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission Required', 'Camera access is needed'); return; }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true, aspect: [1, 1], quality: 0.85,
          });
          if (!result.canceled && result.assets[0]) setLogoUri(result.assets[0].uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLocationSelect = (location: any) => {
    setCoords({ latitude: location.latitude, longitude: location.longitude });
    setAddress(location.address || '');
    setCity(location.city || '');
    setStateRegion(location.state_region || '');
    setCountry(location.country || 'Uganda');
  };

  const handleSave = async () => {
    if (!description.trim()) {
      Alert.alert('Required', 'Please enter a business description');
      return;
    }
    if (!coords) {
      Alert.alert('Required', 'Please pin your business location on the map');
      return;
    }
    if (!address.trim() || !city.trim() || !stateRegion.trim()) {
      Alert.alert('Required', 'Please fill in all location fields');
      return;
    }

    try {
      setSaving(true);
      await updateBusinessProfile(businessId, {
        business_description: description.trim(),
        service_delivery_type: deliveryType,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: address.trim(),
        city: city.trim(),
        state_region: stateRegion.trim(),
        country: country.trim(),
      });
      Alert.alert('Saved', 'Business profile updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
        <StatusBar style="auto" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F57C1F" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Update your business information
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="px-5 pt-6">

            {/* Logo picker */}
            <View className="items-center mb-8">
              <TouchableOpacity onPress={handlePickLogo}>
                {logoUri ? (
                  <View>
                    <Image
                      source={{ uri: logoUri }}
                      style={{ width: 96, height: 96, borderRadius: 20 }}
                      resizeMode="cover"
                    />
                    <View
                      style={{ position: 'absolute', bottom: -6, right: -6 }}
                      className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center"
                    >
                      <CameraIcon size={14} color="#fff" />
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      width: 96, height: 96, borderRadius: 20,
                      borderWidth: 2, borderStyle: 'dashed',
                      borderColor: isDark ? '#475569' : '#D1D5DB',
                    }}
                    className="bg-gray-100 dark:bg-[#1E293B] items-center justify-center"
                  >
                    <CameraIcon size={30} color="#9CA3AF" />
                    <View
                      style={{ position: 'absolute', bottom: -6, right: -6 }}
                      className="w-7 h-7 bg-orange-500 rounded-full items-center justify-center"
                    >
                      <CameraIcon size={12} color="#fff" />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                {logoUri ? 'Tap to change business logo' : 'Add business logo (optional)'}
              </Text>
            </View>

            {/* Business Name — read-only */}
            <View className="mb-5">
              <View className="flex-row items-center mb-2">
                <LockClosedIcon size={14} color="#9CA3AF" />
                <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1.5">
                  Business Name
                </Text>
              </View>
              <View
                className="bg-gray-100 dark:bg-[#1E293B] rounded-xl px-4 py-4 flex-row items-center"
                style={{ borderWidth: 2, borderColor: isDark ? '#334155' : '#E5E7EB' }}
              >
                <Text className="text-gray-500 dark:text-gray-400 text-sm flex-1">
                  {businessName}
                </Text>
                <LockClosedIcon size={16} color="#9CA3AF" />
              </View>
              <Text className="text-xs text-gray-400 mt-1.5 ml-1">
                Business name cannot be changed after registration
              </Text>
            </View>

            {/* Description */}
            <View className="mb-7">
              <View className="flex-row items-center mb-2">
                <DocumentTextIcon size={14} color="#8B5CF6" />
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1.5">
                  Business Description <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TextInput
                placeholder="Describe what your business does, services offered, specialisations..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={(t) => { if (t.length <= 500) setDescription(t); }}
                onFocus={() => setActiveField('description')}
                onBlur={() => setActiveField(null)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                style={{ borderWidth: 2, borderColor: borderColor('description'), minHeight: 105, paddingVertical: 12 }}
              />
              <Text className="text-xs text-gray-400 mt-1.5 text-right">
                {description.length}/500
              </Text>
            </View>

            {/* Service Delivery Type */}
            <View className="flex-row items-center mb-4">
              <View className="flex-1 h-px bg-gray-200 dark:bg-[#334155]" />
              <View className="flex-row items-center mx-3">
                <TruckIcon size={12} color="#F97316" />
                <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1.5">
                  Service Delivery Type
                </Text>
              </View>
              <View className="flex-1 h-px bg-gray-200 dark:bg-[#334155]" />
            </View>

            <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4 px-4">
              {DELIVERY_TYPES.find((t) => t.value === deliveryType)?.description}
            </Text>

            <View className="flex-row mb-7" style={{ gap: 8 }}>
              {DELIVERY_TYPES.map((type) => {
                const isSelected = deliveryType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    onPress={() => setDeliveryType(type.value)}
                    activeOpacity={0.75}
                    className={`flex-1 items-center py-3 px-1 rounded-xl ${
                      isSelected ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-[#1E293B]'
                    }`}
                    style={{ borderWidth: 2, borderColor: isSelected ? '#F97316' : inactiveBorder }}
                  >
                    <View
                      style={{
                        width: 16, height: 16, borderRadius: 8,
                        borderWidth: 2,
                        borderColor: isSelected ? type.dotColor : '#D1D5DB',
                        backgroundColor: isSelected ? type.dotColor : 'transparent',
                        alignItems: 'center', justifyContent: 'center', marginBottom: 6,
                      }}
                    >
                      {isSelected && (
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' }} />
                      )}
                    </View>
                    <Text
                      className={`text-xs font-bold text-center ${
                        isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {type.label}
                    </Text>
                    {isSelected && (
                      <View style={{ marginTop: 6 }}>
                        <CheckCircleIcon size={14} color="#F97316" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Business Location */}
            <View className="flex-row items-center mb-4">
              <View className="flex-1 h-px bg-gray-200 dark:bg-[#334155]" />
              <View className="flex-row items-center mx-3">
                <MapPinIcon size={12} color="#0891B2" />
                <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1.5">
                  Business Location
                </Text>
              </View>
              <View className="flex-1 h-px bg-gray-200 dark:bg-[#334155]" />
            </View>

            {/* Map pin button */}
            <TouchableOpacity
              onPress={() => setLocationPickerVisible(true)}
              className={`flex-row items-center rounded-xl px-4 py-4 mb-5 ${
                hasLocation ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'bg-white dark:bg-[#1E293B]'
              }`}
              style={{
                borderWidth: 2,
                borderStyle: hasLocation ? 'solid' : 'dashed',
                borderColor: hasLocation ? '#06B6D4' : inactiveBorder,
              }}
            >
              <View
                className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                  hasLocation ? 'bg-cyan-100 dark:bg-cyan-900/30' : 'bg-gray-100 dark:bg-[#334155]'
                }`}
              >
                <MapPinIcon size={20} color={hasLocation ? '#06B6D4' : '#9CA3AF'} />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-sm font-semibold ${
                    hasLocation ? 'text-cyan-700 dark:text-cyan-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {hasLocation ? 'Location Pinned — tap to update' : 'Pin Business Location on Map'}
                </Text>
                {hasLocation && (
                  <Text className="text-xs text-cyan-600 dark:text-cyan-300 mt-0.5" numberOfLines={1}>
                    {address}
                  </Text>
                )}
              </View>
              {hasLocation && <CheckCircleIcon size={20} color="#06B6D4" />}
            </TouchableOpacity>

            {/* Address fields */}
            {(
              [
                { key: 'address',      label: 'Street Address', value: address,      setter: setAddress      },
                { key: 'city',         label: 'City',           value: city,         setter: setCity         },
                { key: 'state_region', label: 'State / Region', value: stateRegion,  setter: setStateRegion  },
                { key: 'country',      label: 'Country',        value: country,      setter: setCountry      },
              ] as const
            ).map((f) => (
              <View key={f.key} className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {f.label}
                </Text>
                <TextInput
                  placeholder={f.label}
                  placeholderTextColor="#9CA3AF"
                  value={f.value}
                  onChangeText={f.setter}
                  onFocus={() => setActiveField(f.key)}
                  onBlur={() => setActiveField(null)}
                  className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                  style={{ borderWidth: 2, borderColor: borderColor(f.key), paddingVertical: 14 }}
                />
              </View>
            ))}

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
              <Text className="text-white font-bold text-base">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <LocationPicker
        visible={locationPickerVisible}
        onClose={() => setLocationPickerVisible(false)}
        onSelect={handleLocationSelect}
        initialLocation={coords || undefined}
      />
    </SafeAreaView>
  );
}
