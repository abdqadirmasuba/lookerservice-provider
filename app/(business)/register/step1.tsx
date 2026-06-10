// File: app/(business)/register/step1.tsx

import React, { useState } from 'react';
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
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BuildingStorefrontIcon,
  DocumentTextIcon,
  MapPinIcon,
  TruckIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  CameraIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UserIcon,
  BuildingOffice2Icon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import LocationPicker from '@/src/components/forms/LocationPicker';
import {
  setBusinessInfo,
  setLocation,
  setBusinessLogo,
  setContactDetails,
  ServiceDeliveryType,
  ProviderType,
} from '@/src/store/slices/businessRegistrationSlice';
import { RootState } from '@/src/store';

const TOTAL_STEPS = 4;
const CURRENT_STEP = 1;
const STEP_LABELS = ['Business Info', 'Hours', 'Service Area', 'Review'];

const DELIVERY_TYPES: {
  value: ServiceDeliveryType;
  label: string;
  description: string;
  dotColor: string;
}[] = [
  {
    value: 'onsite',
    label: 'On-site',
    description: "You travel to the client's location",
    dotColor: '#EF4444',
  },
  {
    value: 'remote',
    label: 'Remote',
    description: 'Service delivered online or remotely',
    dotColor: '#3B82F6',
  },
  {
    value: 'both',
    label: 'Both',
    description: 'On-site and remote options available',
    dotColor: '#10B981',
  },
];

const PROVIDER_TYPES: {
  value: ProviderType;
  label: string;
  description: string;
  icon: (color: string) => React.ReactNode;
}[] = [
  {
    value: 'individual',
    label: 'Individual',
    description: 'Solo service provider',
    icon: (color) => <UserIcon size={22} color={color} />,
  },
  {
    value: 'business',
    label: 'Business',
    description: 'Registered small business',
    icon: (color) => <BuildingStorefrontIcon size={22} color={color} />,
  },
  {
    value: 'company',
    label: 'Company',
    description: 'Incorporated company',
    icon: (color) => <BuildingOffice2Icon size={22} color={color} />,
  },
];

export default function BusinessStep1Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const reg = useSelector((state: RootState) => state.businessRegistration);

  const [businessName, setBusinessName] = useState(reg.business_name);
  const [description, setDescription] = useState(reg.business_description);
  const [deliveryType, setDeliveryType] = useState<ServiceDeliveryType>(
    reg.service_delivery_type || 'onsite',
  );
  const [providerType, setProviderType] = useState<ProviderType>(
    reg.provider_type || '',
  );
  const [logoUri, setLogoUri] = useState<string | null>(reg.business_logo || null);
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(
    reg.latitude && reg.longitude
      ? { latitude: reg.latitude, longitude: reg.longitude }
      : null,
  );
  const [address, setAddress] = useState(reg.address);
  const [city, setCity] = useState(reg.city);
  const [stateRegion, setStateRegion] = useState(reg.state_region);
  const [country, setCountry] = useState(reg.country || 'Uganda');
  const [contactEmail, setContactEmail] = useState(reg.contact_details?.email || '');
  const [contactPhone, setContactPhone] = useState(reg.contact_details?.phone || '');
  const [contactWhatsapp, setContactWhatsapp] = useState(reg.contact_details?.whatsapp || '');
  const [activeField, setActiveField] = useState<string | null>(null);

  const hasLocation = !!coords;
  const inactiveBorder = isDark ? '#334155' : '#D1D5DB';
  const activeBorder = '#06B6D4';
  const borderColor = (field: string) => (activeField === field ? activeBorder : inactiveBorder);

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

  const handleLocationSelect = (location: any) => {
    setCoords({ latitude: location.latitude, longitude: location.longitude });
    setAddress(location.address || '');
    setCity(location.city || '');
    setStateRegion(location.state_region || '');
    setCountry(location.country || 'Uganda');
  };

  const handlePickLogo = () => {
    Alert.alert('Business Logo', 'Choose photo source', [
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera access is needed');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
          });
          if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            setLogoUri(uri);
            dispatch(setBusinessLogo(uri));
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Photo library access is needed');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
          });
          if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            setLogoUri(uri);
            dispatch(setBusinessLogo(uri));
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
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
    if (!providerType) {
      Alert.alert('Required', 'Please select a provider type');
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

    if (!contactEmail.trim() && !contactPhone.trim() && !contactWhatsapp.trim()) {
      Alert.alert(
        'Required',
        'Please provide at least one contact detail: email, phone, or WhatsApp.',
      );
      return;
    }

    dispatch(
      setBusinessInfo({
        business_name: businessName,
        business_description: description,
        service_delivery_type: deliveryType,
        provider_type: providerType,
      }),
    );
    dispatch(
      setContactDetails({
        email: contactEmail.trim(),
        phone: contactPhone.trim(),
        whatsapp: contactWhatsapp.trim(),
      }),
    );
    dispatch(
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: address.trim(),
        city: city.trim(),
        state_region: stateRegion.trim(),
        country: country.trim(),
      }),
    );
    router.push('/(business)/register/step2');
  };

  const navigateToStep = (step: number) => {
    if (step < CURRENT_STEP) {
      router.push(`/(business)/register/step${step}` as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Fixed Header */}
      <View className="px-5 pt-3 pb-3 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-base font-bold text-gray-900 dark:text-white">
              Register Business
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

        {/* Segmented progress — tappable to navigate back */}
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="px-5 pt-6">

            {/* Logo Picker */}
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
                      width: 96,
                      height: 96,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderStyle: 'dashed',
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

            {/* Business Name */}
            <View className="mb-5">
              <View className="flex-row items-center mb-2">
                <BuildingStorefrontIcon size={14} color="#0891B2" />
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1.5">
                  Business Name <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TextInput
                placeholder="e.g, Brand name"
                placeholderTextColor="#9CA3AF"
                value={businessName}
                onChangeText={setBusinessName}
                onFocus={() => setActiveField('name')}
                onBlur={() => setActiveField(null)}
                className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                style={{ borderWidth: 2, borderColor: borderColor('name'), paddingVertical: 14 }}
              />
              {/* Name lock warning */}
              <View className="flex-row items-start mt-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                <ExclamationTriangleIcon size={13} color="#D97706" />
                <Text className="text-xs text-amber-700 dark:text-amber-400 ml-1.5 flex-1">
                  This cannot be changed after registration. Contact admin support if you need it updated.
                </Text>
              </View>
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

            {/* Provider Type */}
            <View className="mb-7">
              <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-gray-200 dark:bg-[#334155]" />
                <View className="flex-row items-center mx-3">
                  <UserIcon size={12} color="#8B5CF6" />
                  <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1.5">
                    Provider Type <Text className="text-red-500">*</Text>
                  </Text>
                </View>
                <View className="flex-1 h-px bg-gray-200 dark:bg-[#334155]" />
              </View>
              <View className="flex-row" style={{ gap: 8 }}>
                {PROVIDER_TYPES.map((type) => {
                  const isSelected = providerType === type.value;
                  return (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setProviderType(type.value)}
                      activeOpacity={0.75}
                      className={`flex-1 items-center py-4 px-2 rounded-xl ${
                        isSelected
                          ? 'bg-violet-50 dark:bg-violet-900/20'
                          : 'bg-white dark:bg-[#1E293B]'
                      }`}
                      style={{ borderWidth: 2, borderColor: isSelected ? '#8B5CF6' : inactiveBorder }}
                    >
                      {type.icon(isSelected ? '#8B5CF6' : '#9CA3AF')}
                      <Text
                        className={`text-xs font-bold mt-2 text-center ${
                          isSelected
                            ? 'text-violet-600 dark:text-violet-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {type.label}
                      </Text>
                      <Text
                        className={`text-xs mt-0.5 text-center ${
                          isSelected ? 'text-violet-500' : 'text-gray-400'
                        }`}
                        numberOfLines={1}
                      >
                        {type.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Separator: Service Delivery */}
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

            {/* Delivery description */}
            <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4 px-4">
              {DELIVERY_TYPES.find((t) => t.value === deliveryType)?.description}
            </Text>

            {/* Delivery Type — horizontal radio cards */}
            <View className="flex-row mb-7" style={{ gap: 8 }}>
              {DELIVERY_TYPES.map((type) => {
                const isSelected = deliveryType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    onPress={() => setDeliveryType(type.value)}
                    activeOpacity={0.75}
                    className={`flex-1 items-center py-3 px-1 rounded-xl ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-900/20'
                        : 'bg-white dark:bg-[#1E293B]'
                    }`}
                    style={{ borderWidth: 2, borderColor: isSelected ? '#F97316' : inactiveBorder }}
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: isSelected ? type.dotColor : '#D1D5DB',
                        backgroundColor: isSelected ? type.dotColor : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 6,
                      }}
                    >
                      {isSelected && (
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' }} />
                      )}
                    </View>
                    <Text
                      className={`text-xs font-bold text-center ${
                        isSelected
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-gray-600 dark:text-gray-400'
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

            {/* Contact Details */}
            <View className="mb-7">
              <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-gray-200 dark:bg-[#334155]" />
                <View className="flex-row items-center mx-3">
                  <EnvelopeIcon size={12} color="#0891B2" />
                  <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1.5">
                    Contact Details
                  </Text>
                </View>
                <View className="flex-1 h-px bg-gray-200 dark:bg-[#334155]" />
              </View>

              <View style={{ gap: 14 }}>
                <View>
                  <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Email
                  </Text>
                  <TextInput
                    placeholder="business@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={contactEmail}
                    onChangeText={setContactEmail}
                    onFocus={() => setActiveField('contactEmail')}
                    onBlur={() => setActiveField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                    style={{ borderWidth: 2, borderColor: borderColor('contactEmail'), paddingVertical: 12 }}
                  />
                </View>

                <View>
                  <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Phone
                  </Text>
                  <TextInput
                    placeholder="e.g., +256 700 000000"
                    placeholderTextColor="#9CA3AF"
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    onFocus={() => setActiveField('contactPhone')}
                    onBlur={() => setActiveField(null)}
                    keyboardType="phone-pad"
                    className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                    style={{ borderWidth: 2, borderColor: borderColor('contactPhone'), paddingVertical: 12 }}
                  />
                </View>

                <View>
                  <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    WhatsApp
                  </Text>
                  <TextInput
                    placeholder="e.g., +256 700 000000"
                    placeholderTextColor="#9CA3AF"
                    value={contactWhatsapp}
                    onChangeText={setContactWhatsapp}
                    onFocus={() => setActiveField('contactWhatsapp')}
                    onBlur={() => setActiveField(null)}
                    keyboardType="phone-pad"
                    className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                    style={{ borderWidth: 2, borderColor: borderColor('contactWhatsapp'), paddingVertical: 12 }}
                  />
                </View>
              </View>
            </View>

            {/* Separator: Location */}
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
              <MapPinIcon size={20} color={hasLocation ? '#0891B2' : '#9CA3AF'} />
              <View className="flex-1 ml-3">
                {hasLocation ? (
                  <>
                    <Text className="text-cyan-700 dark:text-cyan-400 font-semibold text-sm">
                      Location pinned
                    </Text>
                    <Text className="text-xs text-cyan-500 mt-0.5">
                      {coords!.latitude.toFixed(5)}, {coords!.longitude.toFixed(5)}
                    </Text>
                  </>
                ) : (
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">Tap to pin on map</Text>
                )}
              </View>
              <Text
                className={`font-semibold text-sm ${hasLocation ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'}`}
              >
                {hasLocation ? 'Change' : 'Open Map'}
              </Text>
            </TouchableOpacity>

            {/* Location text fields */}
            <View style={{ gap: 14 }} className="mb-3">
              <View>
                <View className="flex-row items-center mb-2">
                  <MapPinIcon size={12} color="#0891B2" />
                  <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                    Address <Text className="text-red-500">*</Text>
                  </Text>
                </View>
                <TextInput
                  placeholder="Street / trading centre"
                  placeholderTextColor="#9CA3AF"
                  value={address}
                  onChangeText={setAddress}
                  onFocus={() => setActiveField('address')}
                  onBlur={() => setActiveField(null)}
                  className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                  style={{ borderWidth: 2, borderColor: borderColor('address'), paddingVertical: 12 }}
                />
              </View>

              <View>
                <View className="flex-row items-center mb-2">
                  <MapPinIcon size={12} color="#0891B2" />
                  <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                    City / Town <Text className="text-red-500">*</Text>
                  </Text>
                </View>
                <TextInput
                  placeholder="e.g., Gayaza"
                  placeholderTextColor="#9CA3AF"
                  value={city}
                  onChangeText={setCity}
                  onFocus={() => setActiveField('city')}
                  onBlur={() => setActiveField(null)}
                  className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                  style={{ borderWidth: 2, borderColor: borderColor('city'), paddingVertical: 12 }}
                />
              </View>

              <View className="flex-row" style={{ gap: 10 }}>
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <MapPinIcon size={12} color="#0891B2" />
                    <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                      State / Region <Text className="text-red-500">*</Text>
                    </Text>
                  </View>
                  <TextInput
                    placeholder="e.g., Wakiso"
                    placeholderTextColor="#9CA3AF"
                    value={stateRegion}
                    onChangeText={setStateRegion}
                    onFocus={() => setActiveField('state')}
                    onBlur={() => setActiveField(null)}
                    className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                    style={{ borderWidth: 2, borderColor: borderColor('state'), paddingVertical: 12 }}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <GlobeAltIcon size={12} color="#0891B2" />
                    <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                      Country <Text className="text-red-500">*</Text>
                    </Text>
                  </View>
                  <TextInput
                    placeholder="e.g., Uganda"
                    placeholderTextColor="#9CA3AF"
                    value={country}
                    onChangeText={setCountry}
                    onFocus={() => setActiveField('country')}
                    onBlur={() => setActiveField(null)}
                    className="bg-white dark:bg-[#1E293B] rounded-xl px-4 text-gray-900 dark:text-white text-sm"
                    style={{ borderWidth: 2, borderColor: borderColor('country'), paddingVertical: 12 }}
                  />
                </View>
              </View>
            </View>

            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-2">
              Use the map pin to set exact coordinates. Fields auto-fill but can be edited.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Navigation */}
      <View className="px-5 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        <TouchableOpacity
          onPress={handleNext}
          className="bg-orange-500 py-4 rounded-xl items-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">Next: Business Hours</Text>
        </TouchableOpacity>
      </View>

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
