import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  TagIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
  ClockIcon,
  InformationCircleIcon,
  BanknotesIcon,
} from 'react-native-heroicons/outline';

// Placeholder data (mirrors the list screen)
const OPEN_REQUESTS: Record<string, any> = {
  '1': {
    id: '1',
    request_number: 'SR-20260001',
    client_name: 'John Doe',
    address: 'Nakawa, Kampala',
    budget_min: 100000,
    budget_max: 300000,
    description: 'Need a professional plumber to fix a leaking pipe in my kitchen and install a new bathroom tap. The leak has been ongoing for a week and is causing water damage.',
    preferred_date: '2026-04-20',
    deadline: '2026-04-21',
    created_at: '2026-04-14T10:30:00Z',
    services: [
      { id: '1', service_name: 'Pipe Repair', category_name: 'Plumbing' },
      { id: '2', service_name: 'Tap Installation', category_name: 'Plumbing' },
    ],
    bid_count: 3,
    has_bid: false,
    my_bid: null,
  },
  '2': {
    id: '2',
    request_number: 'SR-20260002',
    client_name: 'Sarah Kato',
    address: 'Entebbe Road, Entebbe',
    budget_min: 200000,
    budget_max: 500000,
    description: 'Electrical wiring for a new 3-bedroom house. Need a certified electrician to do the full wiring including the meter box installation.',
    preferred_date: '2026-04-22',
    deadline: '2026-04-23',
    created_at: '2026-04-13T14:00:00Z',
    services: [
      { id: '3', service_name: 'Electrical Wiring', category_name: 'Electrical' },
    ],
    bid_count: 1,
    has_bid: true,
    my_bid: {
      amount: 350000,
      message: 'I have 5 years of electrical experience and can complete the job in 2 days.',
      status: 'pending',
      submitted_at: '2026-04-13T18:00:00Z',
    },
  },
  '3': {
    id: '3',
    request_number: 'SR-20260003',
    client_name: 'Moses Otieno',
    address: 'Main Street, Jinja',
    budget_min: 50000,
    budget_max: 150000,
    description: 'Deep cleaning for a 2-bedroom apartment before move-in. Must use eco-friendly products.',
    preferred_date: '2026-04-18',
    deadline: '2026-04-19',
    created_at: '2026-04-12T09:15:00Z',
    services: [
      { id: '4', service_name: 'Deep Cleaning', category_name: 'Cleaning' },
    ],
    bid_count: 5,
    has_bid: false,
    my_bid: null,
  },
  '4': {
    id: '4',
    request_number: 'SR-20260004',
    client_name: 'Grace Namuli',
    address: 'Kololo, Kampala',
    budget_min: 400000,
    budget_max: 800000,
    description: 'Interior painting for a 4-room apartment. Walls and ceiling included.',
    preferred_date: '2026-04-25',
    deadline: '2026-04-26',
    created_at: '2026-04-11T08:00:00Z',
    services: [
      { id: '5', service_name: 'Interior Painting', category_name: 'Painting' },
    ],
    bid_count: 2,
    has_bid: false,
    my_bid: null,
  },
};

export default function BidDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const requestId = params.id as string;

  const request = OPEN_REQUESTS[requestId];
  const [bidAmount, setBidAmount] = useState(
    request?.my_bid?.amount ? request.my_bid.amount.toString() : ''
  );
  const [bidMessage, setBidMessage] = useState(request?.my_bid?.message || '');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(!request?.has_bid);

  if (!request) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A] items-center justify-center">
        <Text className="text-gray-500">Request not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary-500 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const hasBid = request.has_bid;

  const handleSubmit = () => {
    const amount = parseInt(bidAmount, 10);
    if (!bidAmount || isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid bid amount.');
      return;
    }
    if (amount < request.budget_min) {
      Alert.alert(
        'Amount Too Low',
        `Your bid must be at least UGX ${request.budget_min.toLocaleString()}.`
      );
      return;
    }
    setSubmitting(true);
    // Simulated submit — replace with actual API call
    setTimeout(() => {
      setSubmitting(false);
      setIsEditing(false);
      Alert.alert(
        hasBid ? 'Bid Updated' : 'Bid Submitted',
        hasBid
          ? 'Your bid has been updated successfully.'
          : 'Your bid has been placed. You will be notified when the client responds.',
        [{ text: 'OK' }]
      );
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <LinearGradient colors={['#F57C1F', '#E06A0F']} className="px-6 pt-4 pb-6">
          <View className="flex-row items-center mb-3">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
              <ArrowLeftIcon size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">Service Request</Text>
              <Text className="text-white/70 text-xs">{request.request_number}</Text>
            </View>
            {hasBid && (
              <View className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full">
                <CheckBadgeIcon size={14} color="#FFFFFF" />
                <Text className="text-white text-xs font-semibold ml-1">Bid Placed</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Request Details Card */}
          <View className="mx-4 -mt-3 bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-[#334155]">
            {/* Client */}
            <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100 dark:border-[#334155]">
              <View className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center mr-3">
                <Text className="text-primary-500 font-bold text-lg">
                  {request.client_name.charAt(0)}
                </Text>
              </View>
              <View>
                <Text className="font-bold text-gray-900 dark:text-white text-base">
                  {request.client_name}
                </Text>
                <Text className="text-xs text-gray-400">Client</Text>
              </View>
            </View>

            {/* Services */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                Services Needed
              </Text>
              <View className="flex-row flex-wrap">
                {request.services.map((svc: any) => (
                  <View
                    key={svc.id}
                    className="bg-primary-50 dark:bg-primary-900/20 rounded-lg px-2 py-1 mr-2 mb-1 flex-row items-center"
                  >
                    <TagIcon size={10} color="#F57C1F" />
                    <Text className="text-primary-600 text-xs font-semibold ml-1">
                      {svc.service_name}
                    </Text>
                    <Text className="text-gray-400 text-xs ml-1">· {svc.category_name}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                Description
              </Text>
              <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {request.description}
              </Text>
            </View>

            {/* Info grid */}
            <View className="flex-row flex-wrap -mx-1">
              <InfoTile
                icon={<MapPinIcon size={16} color="#F57C1F" />}
                label="Location"
                value={request.address}
              />
              <InfoTile
                icon={<CalendarDaysIcon size={16} color="#F57C1F" />}
                label="Preferred Date"
                value={request.preferred_date}
              />
              <InfoTile
                icon={<CurrencyDollarIcon size={16} color="#F57C1F" />}
                label="Budget"
                value={`UGX ${request.budget_min.toLocaleString()} – ${request.budget_max.toLocaleString()}`}
              />
              <InfoTile
                icon={<ClockIcon size={16} color="#F57C1F" />}
                label="Bids So Far"
                value={`${request.bid_count} bid${request.bid_count !== 1 ? 's' : ''}`}
              />
            </View>
          </View>

          {/* Existing Bid Display */}
          {hasBid && !isEditing && (
            <View className="mx-4 mb-4 bg-green-50 dark:bg-green-900/10 rounded-2xl p-4 border border-green-200 dark:border-green-800">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <CheckBadgeIcon size={20} color="#10B981" />
                  <Text className="font-bold text-green-700 dark:text-green-400 ml-2">Your Bid</Text>
                </View>
                <View className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Text className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 capitalize">
                    {request.my_bid.status}
                  </Text>
                </View>
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                UGX {parseInt(bidAmount || request.my_bid.amount).toLocaleString()}
              </Text>
              {(bidMessage || request.my_bid.message) !== '' && (
                <Text className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {bidMessage || request.my_bid.message}
                </Text>
              )}
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-400">
                  Submitted {new Date(request.my_bid.submitted_at).toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="flex-row items-center bg-white dark:bg-[#1E293B] px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <PencilSquareIcon size={14} color="#10B981" />
                  <Text className="text-green-600 text-xs font-semibold ml-1">Update Bid</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Bid Form */}
          {(!hasBid || isEditing) && (
            <View className="mx-4 mb-4 bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-[#334155]">
              <View className="flex-row items-center mb-4">
                <BanknotesIcon size={20} color="#F57C1F" />
                <Text className="font-bold text-gray-900 dark:text-white ml-2 text-base">
                  {hasBid ? 'Update Your Bid' : 'Place Your Bid'}
                </Text>
              </View>

              {/* Hint */}
              <View className="flex-row items-start bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-4">
                <InformationCircleIcon size={16} color="#2DA9E9" />
                <Text className="text-xs text-blue-600 dark:text-blue-400 ml-2 flex-1">
                  Budget range: UGX {request.budget_min.toLocaleString()} –{' '}
                  {request.budget_max.toLocaleString()}. You can submit one bid per request and update it anytime before it is accepted.
                </Text>
              </View>

              {/* Amount Input */}
              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                Your Bid Amount (UGX)
              </Text>
              <View className="border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 mb-4 flex-row items-center bg-gray-50 dark:bg-[#0F172A]">
                <Text className="text-gray-400 mr-2 font-semibold">UGX</Text>
                <TextInput
                  value={bidAmount}
                  onChangeText={setBidAmount}
                  keyboardType="numeric"
                  placeholder="e.g. 200000"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-gray-900 dark:text-white text-base font-semibold"
                />
              </View>

              {/* Message Input */}
              <Text className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                Cover Message (Optional)
              </Text>
              <TextInput
                value={bidMessage}
                onChangeText={setBidMessage}
                placeholder="Describe your approach, experience, or timeline..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-[#0F172A] text-sm"
                style={{ minHeight: 100 }}
              />

              {/* Action Buttons */}
              <View className="flex-row mt-4">
                {isEditing && hasBid && (
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-[#334155] mr-2 items-center"
                  >
                    <Text className="text-gray-600 dark:text-gray-300 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={submitting}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    submitting ? 'bg-primary-300' : 'bg-primary-500'
                  }`}
                >
                  <Text className="text-white font-bold text-base">
                    {submitting
                      ? 'Submitting...'
                      : hasBid
                      ? 'Update Bid'
                      : 'Submit Bid'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="w-1/2 px-1 mb-3">
      <View className="bg-gray-50 dark:bg-[#0F172A] rounded-xl p-3">
        <View className="flex-row items-center mb-1">
          {icon}
          <Text className="text-xs text-gray-400 ml-1">{label}</Text>
        </View>
        <Text className="text-sm font-semibold text-gray-900 dark:text-white">{value}</Text>
      </View>
    </View>
  );
}
