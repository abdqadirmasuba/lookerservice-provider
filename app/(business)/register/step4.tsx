// File: app/(business)/register/step4.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  RectangleGroupIcon,
  ClockIcon,
  TruckIcon,
  EnvelopeIcon,
  XMarkIcon,
  CameraIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon as CheckCircleSolid } from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import {
  registerBusiness,
  presignUpload,
  uploadToS3,
  getMe,
} from '@/src/utils/business';
import {
  resetBusinessRegistration,
  DayHoursState,
} from '@/src/store/slices/businessRegistrationSlice';
import { addProviderBusiness, loginSuccess } from '@/src/store/slices/authSlice';
import { setUser } from '@/src/store/slices/userSlice';

const TOTAL_STEPS = 4;
const CURRENT_STEP = 4;
const STEP_LABELS = ['Business Info', 'Hours', 'Service Area', 'Review'];

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
};
const DAY_FULL_NAMES: Record<string, string> = {
  mon: 'monday', tue: 'tuesday', wed: 'wednesday', thu: 'thursday',
  fri: 'friday', sat: 'saturday', sun: 'sunday',
};
const DELIVERY_LABELS: Record<string, string> = {
  onsite: 'On-site',
  remote: 'Remote',
  both: 'Both (On-site & Remote)',
};

const PROVIDER_TYPE_LABELS: Record<string, string> = {
  individual: 'Individual',
  business: 'Business',
  company: 'Company',
};

function buildHoursPayload(
  hours: Record<string, DayHoursState>,
): Record<string, { open: string | null; close: string | null; is_open: boolean }> {
  const payload: Record<string, { open: string | null; close: string | null; is_open: boolean }> = {};
  DAYS.forEach((day) => {
    const d = hours[day];
    const fullName = DAY_FULL_NAMES[day];
    if (!d || !fullName) return;
    if (d.mode === 'closed') {
      payload[fullName] = { open: null, close: null, is_open: false };
    } else if (d.mode === 'working') {
      payload[fullName] = { open: d.open, close: d.close, is_open: true };
    } else if (d.mode === 'fullday') {
      payload[fullName] = { open: '00:00', close: '23:59', is_open: true };
    }
  });
  return payload;
}

export default function BusinessStep4Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const reg = useSelector((state: RootState) => state.businessRegistration);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const handleEdit = (step: number) => {
    router.push(`/(business)/register/step${step}` as any);
  };

  const formatHoursSummary = () => {
    const h = reg.business_hours;
    if (!h || Object.keys(h).length === 0) return 'Not configured';
    const working = DAYS.filter((d) => h[d]?.mode === 'working').length;
    const fullday = DAYS.filter((d) => h[d]?.mode === 'fullday').length;
    const closed = DAYS.filter((d) => h[d]?.mode === 'closed').length;
    const parts: string[] = [];
    if (working > 0) parts.push(`${working} working`);
    if (fullday > 0) parts.push(`${fullday} 24/7`);
    if (closed > 0) parts.push(`${closed} closed`);
    return parts.join(' · ') || 'Not configured';
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions');
      return;
    }
    if (!reg.business_name || !reg.business_description) {
      Alert.alert('Error', 'Business name and description are required');
      return;
    }
    if (!reg.latitude || !reg.longitude) {
      Alert.alert('Error', 'Business location is required');
      return;
    }
    if (!reg.group_id) {
      Alert.alert('Error', 'Please select an area of service');
      return;
    }

    setIsSubmitting(true);
    try {
      let logoUrl: string | undefined;

      // Upload logo to S3 if a local URI is stored
      if (reg.business_logo && !reg.business_logo.startsWith('http')) {
        setSubmitStatus('Uploading business logo...');
        const uri = reg.business_logo;
        const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
        const fileName = `logo_${Date.now()}.${ext}`;

        const presignResponse = await presignUpload({
          file_name: fileName,
          content_type: contentType,
          upload_type: 'business_logo',
          reference_id: reg.business_name.toLowerCase().replace(/\s+/g, '-'),
        });

        await uploadToS3(presignResponse.data.upload_url, uri, contentType);
        logoUrl = presignResponse.data.public_url;
      } else if (reg.business_logo?.startsWith('http')) {
        logoUrl = reg.business_logo;
      }

      setSubmitStatus('Registering your business...');
      const payload = {
        business_name: reg.business_name,
        business_description: reg.business_description,
        service_delivery_type: reg.service_delivery_type,
        provider_type: reg.provider_type,
        contact_details: reg.contact_details,
        longitude: reg.longitude!,
        latitude: reg.latitude!,
        address: reg.address,
        city: reg.city,
        state_region: reg.state_region,
        country: reg.country,
        business_hours: buildHoursPayload(reg.business_hours),
        group_id: reg.group_id,
        ...(logoUrl && { logo_url: logoUrl }),
      };

      const registerResponse = await registerBusiness(payload);
      const registeredBusiness = registerResponse?.data;
      if (registeredBusiness?.id) {
        dispatch(addProviderBusiness({
          id: registeredBusiness.id,
          business_name: registeredBusiness.business_name,
          address: registeredBusiness.address,
          logo_url: registeredBusiness.logo_url,
          verification_status: registeredBusiness.verification_status ?? registeredBusiness.status,
          status: registeredBusiness.verification_status ?? registeredBusiness.status,
          provider_type: registeredBusiness.provider_type,
          created_at: registeredBusiness.created_at,
        }));
      }
      dispatch(resetBusinessRegistration());

      Alert.alert(
        'Business Registered!',
        "Your business has been submitted for review. You'll be notified once approved.",
        [{
          text: 'OK',
          onPress: async () => {
            try {
              const meRes = await getMe();
              if (meRes?.success && meRes?.data) {
                dispatch(loginSuccess({
                  token: meRes.data.access_token ?? meRes.data.token,
                  refreshToken: meRes.data.refresh_token,
                  providerBusinesses: meRes.data.provider_businesses || [],
                  providerTier: meRes.data.user?.provider_tier === 'pro' ? 'pro' : 'free',
                }));
                dispatch(setUser({
                  id: meRes.data.user.id,
                  fullName: meRes.data.user.full_name,
                  email: meRes.data.user.email,
                  phone: meRes.data.user.phone,
                  profileImage: meRes.data.user.profile_picture_url ?? undefined,
                  isEmailVerified: meRes.data.user.email_verified,
                  isPhoneVerified: meRes.data.user.phone_verified,
                  createdAt: meRes.data.user.created_at,
                }));
              }
            } catch (_) {
              // silent — navigate regardless
            }
            router.replace('/(tabs)');
          },
        }],
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to register business. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmitStatus('');
    }
  };

  const sectionCard = (children: React.ReactNode) => (
    <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]">
      {children}
    </View>
  );

  const sectionHeader = (icon: React.ReactNode, title: string, editStep: number) => (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center">
        {icon}
        <Text className="text-sm font-bold text-gray-900 dark:text-white ml-2">{title}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleEdit(editStep)}
        className="flex-row items-center px-2.5 py-1 bg-gray-100 dark:bg-[#0F172A] rounded-lg"
      >
        <PencilSquareIcon size={13} color="#F97316" />
        <Text className="text-xs text-orange-500 font-semibold ml-1">Edit</Text>
      </TouchableOpacity>
    </View>
  );

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

          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Review & Submit
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Please review your information before submitting
          </Text>

          {/* Business Info card */}
          {sectionCard(
            <>
              {sectionHeader(<BuildingStorefrontIcon size={18} color="#0891B2" />, 'Business Info', 1)}
              {/* Logo */}
              {reg.business_logo ? (
                <View className="flex-row items-center mb-3">
                  <Image
                    source={{ uri: reg.business_logo }}
                    style={{ width: 52, height: 52, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                  <Text className="text-xs text-gray-400 ml-2">Business logo</Text>
                </View>
              ) : null}
              <View style={{ gap: 8 }}>
                <View>
                  <Text className="text-xs text-gray-400 mb-0.5">Business Name</Text>
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    {reg.business_name}
                  </Text>
                </View>
                <View>                  <Text className="text-xs text-gray-400 mb-0.5">Provider Type</Text>
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                    {PROVIDER_TYPE_LABELS[reg.provider_type] || reg.provider_type || '—'}
                  </Text>
                </View>
                <View>                  <Text className="text-xs text-gray-400 mb-0.5">Description</Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300" numberOfLines={3}>
                    {reg.business_description}
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Service Delivery */}
          {sectionCard(
            <>
              {sectionHeader(<TruckIcon size={18} color="#F97316" />, 'Service Delivery', 1)}
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {DELIVERY_LABELS[reg.service_delivery_type] || reg.service_delivery_type}
              </Text>
            </>
          )}

          {sectionCard(
            <>
              {sectionHeader(<EnvelopeIcon size={18} color="#0891B2" />, 'Contact Details', 1)}
              <View style={{ gap: 8 }}>
                <View>
                  <Text className="text-xs text-gray-400">Email</Text>
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    {reg.contact_details?.email || 'Not provided'}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-400">Phone</Text>
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    {reg.contact_details?.phone || 'Not provided'}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-400">WhatsApp</Text>
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    {reg.contact_details?.whatsapp || 'Not provided'}
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Location */}
          {sectionCard(
            <>
              {sectionHeader(<MapPinIcon size={18} color="#0891B2" />, 'Location', 1)}
              <View style={{ gap: 3 }}>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {reg.address}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {reg.city}, {reg.state_region}
                </Text>
                <Text className="text-xs text-gray-400">{reg.country}</Text>
                {reg.latitude && reg.longitude && (
                  <Text className="text-xs text-gray-400">
                    {reg.latitude.toFixed(5)}, {reg.longitude.toFixed(5)}
                  </Text>
                )}
              </View>
            </>
          )}

          {/* Business Hours */}
          {sectionCard(
            <>
              {sectionHeader(<ClockIcon size={18} color="#8B5CF6" />, 'Business Hours', 2)}
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {formatHoursSummary()}
              </Text>
              <View style={{ gap: 4 }}>
                {DAYS.map((day) => {
                  const d = reg.business_hours[day];
                  if (!d) return null;
                  return (
                    <View key={day} className="flex-row items-center">
                      <Text className="text-xs font-semibold text-gray-400 w-9">
                        {DAY_LABELS[day]}
                      </Text>
                      {d.mode === 'working' && (
                        <Text className="text-xs text-gray-800 dark:text-gray-200 ml-2">
                          {d.open} – {d.close}
                        </Text>
                      )}
                      {d.mode === 'closed' && (
                        <Text className="text-xs text-red-500 ml-2">Closed</Text>
                      )}
                      {d.mode === 'fullday' && (
                        <Text className="text-xs text-green-600 dark:text-green-400 ml-2">24 / 7</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* Area of Service */}
          {sectionCard(
            <>
              {sectionHeader(<RectangleGroupIcon size={18} color="#10B981" />, 'Area of Service', 3)}
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {reg.group_name ? reg.group_name : 'None selected'}
              </Text>
            </>
          )}

          {/* Terms */}
          <TouchableOpacity
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            className="flex-row items-start bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[#334155]"
          >
            <View className="mr-3 mt-0.5">
              {agreedToTerms ? (
                <CheckCircleSolid size={22} color="#F97316" />
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
            <View className="flex-1">
              <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                I confirm that the information provided is accurate
              </Text>
            </View>
          </TouchableOpacity>

          {/* Info note */}
          <View className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border border-sky-200 dark:border-sky-800">
            <Text className="text-sky-700 dark:text-sky-400 text-xs leading-5">
              After submission your business will be reviewed. You'll receive a notification
              once approved, typically within 24–48 hours.
            </Text>
          </View>

          {/* Immutability warning */}
          <View className="flex-row items-start mt-3 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800">
            <ExclamationTriangleIcon size={14} color="#D97706" />
            <Text className="text-xs text-amber-700 dark:text-amber-400 ml-2 flex-1 leading-4">
              Some details (business name, service group) cannot be changed after submission. Please review carefully. Contact our support team if you ever need assistance.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View className="px-5 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        {isSubmitting ? (
          <View className="items-center py-3">
            <ActivityIndicator size="large" color="#F97316" />
            <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{submitStatus}</Text>
          </View>
        ) : (
          <View className="flex-row" style={{ gap: 10 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] py-4 rounded-xl items-center"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-bold">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!agreedToTerms}
              style={{ opacity: agreedToTerms ? 1 : 0.45 }}
              className="flex-1 bg-orange-500 py-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Submit Business</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
