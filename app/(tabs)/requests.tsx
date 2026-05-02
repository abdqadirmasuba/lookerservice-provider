// File: app/(tabs)/requests.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { apiRequests } from '@/src/utils/apiRequest';
import { showErrorAlert } from '@/src/utils/alerts';
import { ServiceRequest } from '@/src/types/serviceRequest';
import {
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  TagIcon,
  UserGroupIcon,
} from 'react-native-heroicons/outline';

// ── Dummy open requests ────────────────────────────────────────────────────────
interface OpenRequest {
  id: string;
  request_number: string;
  title: string;
  category: string;
  description: string;
  location: string;
  distance_km: number;
  budget_min: number;
  budget_max: number;
  preferred_date: string;
  bid_count: number;
  client_name: string;
}

const DUMMY_OPEN_REQUESTS: OpenRequest[] = [
  {
    id: 'or-1',
    request_number: 'SR-8810234',
    title: 'Bathroom Plumbing Fix',
    category: 'Plumbing',
    description: 'Need a plumber to fix a leaking shower and replace bathroom sink taps. Materials will be provided.',
    location: 'Ntinda, Kampala',
    distance_km: 2.4,
    budget_min: 80000,
    budget_max: 200000,
    preferred_date: '2026-04-27T10:00:00Z',
    bid_count: 3,
    client_name: 'Sarah M.',
  },
  {
    id: 'or-2',
    request_number: 'SR-7745911',
    title: 'Electrical Wiring — New Office',
    category: 'Electrical',
    description: 'Full electrical installation for a small office — 4 rooms. Power outlets, lighting and DB board.',
    location: 'Nakawa, Kampala',
    distance_km: 3.1,
    budget_min: 500000,
    budget_max: 1200000,
    preferred_date: '2026-04-29T08:00:00Z',
    bid_count: 7,
    client_name: 'Peter K.',
  },
  {
    id: 'or-3',
    request_number: 'SR-6621009',
    title: 'House Deep Cleaning',
    category: 'Cleaning',
    description: '4-bedroom house full deep clean before a move-in. Carpets, windows and kitchen included.',
    location: 'Kololo, Kampala',
    distance_km: 4.8,
    budget_min: 150000,
    budget_max: 300000,
    preferred_date: '2026-04-26T07:00:00Z',
    bid_count: 5,
    client_name: 'Grace A.',
  },
  {
    id: 'or-4',
    request_number: 'SR-5530112',
    title: 'Garden & Compound Landscaping',
    category: 'Landscaping',
    description: 'Trim overgrown hedges, replant flower beds and general compound cleanup. About 300sqm.',
    location: 'Muyenga, Kampala',
    distance_km: 1.9,
    budget_min: 120000,
    budget_max: 250000,
    preferred_date: '2026-04-28T09:00:00Z',
    bid_count: 2,
    client_name: 'James O.',
  },
  {
    id: 'or-5',
    request_number: 'SR-4419873',
    title: 'Painting — 3-Bedroom Apartment',
    category: 'Painting',
    description: 'Interior painting for 3 bedrooms, lounge and corridor. Client supplies paint, need labour.',
    location: 'Bugolobi, Kampala',
    distance_km: 5.2,
    budget_min: 200000,
    budget_max: 450000,
    preferred_date: '2026-05-02T08:30:00Z',
    bid_count: 4,
    client_name: 'Fatuma N.',
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatCurrency(amount: number) {
  return `UGX ${amount?.toLocaleString()}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

// ── Bid Form Modal ─────────────────────────────────────────────────────────────
interface BidFormModalProps {
  visible: boolean;
  request: OpenRequest | null;
  onClose: () => void;
  onSubmit: (bid: { price: string; timeFrom: string; timeTo: string; description: string }) => void;
}

function BidFormModal({ visible, request, onClose, onSubmit }: BidFormModalProps) {
  const [price, setPrice] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setPrice('');
    setTimeFrom('');
    setTimeTo('');
    setDescription('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!price.trim()) {
      showErrorAlert('Missing Field', 'Please enter your price estimate.');
      return;
    }
    if (!timeFrom.trim() || !timeTo.trim()) {
      showErrorAlert('Missing Field', 'Please enter your estimated time range.');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    setSubmitting(false);
    onSubmit({ price, timeFrom, timeTo, description });
    reset();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <TouchableOpacity className="flex-1" onPress={handleClose} activeOpacity={1} />
          <View className="bg-white dark:bg-[#1E293B] rounded-t-3xl px-6 pt-4 pb-8">
            {/* Handle */}
            <View className="w-10 h-1 bg-gray-200 dark:bg-gray-600 rounded-full self-center mb-4" />

            {/* Header */}
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Submit a Bid</Text>
              <TouchableOpacity onPress={handleClose} className="p-1">
                <XMarkIcon size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            {request && (
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                {request.request_number} · {request.title}
              </Text>
            )}

            {/* Price */}
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Price Estimate (UGX) <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. 150000"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white mb-4"
            />

            {/* Time range */}
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Estimated Completion Time <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row mb-4" style={{ gap: 10 }}>
              <View className="flex-1">
                <Text className="text-xs text-gray-400 mb-1">From (e.g. 2 hours)</Text>
                <TextInput
                  value={timeFrom}
                  onChangeText={setTimeFrom}
                  placeholder="e.g. 2 hours"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-400 mb-1">To (e.g. 1 day)</Text>
                <TextInput
                  value={timeTo}
                  onChangeText={setTimeTo}
                  placeholder="e.g. 1 day"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white"
                />
              </View>
            </View>

            {/* Description */}
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description{' '}
              <Text className="text-gray-400 font-normal">(optional)</Text>
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Briefly describe your approach, experience or any notes..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white mb-5"
              style={{ minHeight: 80 }}
            />

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              className="bg-primary-500 rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Submit Bid</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Request Detail sheet inside explorer ─────────────────────────────────────
interface RequestDetailSheetProps {
  visible: boolean;
  request: OpenRequest | null;
  onClose: () => void;
  onBid: () => void;
}

function RequestDetailSheet({ visible, request, onClose, onBid }: RequestDetailSheetProps) {
  if (!request) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
        <TouchableOpacity className="flex-1" onPress={onClose} activeOpacity={1} />
        <View className="bg-white dark:bg-[#1E293B] rounded-t-3xl px-6 pt-4 pb-8">
          <View className="w-10 h-1 bg-gray-200 dark:bg-gray-600 rounded-full self-center mb-4" />
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-white flex-1 mr-2" numberOfLines={2}>
              {request.title}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <XMarkIcon size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap mb-4" style={{ gap: 6 }}>
            <View className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-semibold">{request.category}</Text>
            </View>
            <View className="bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
              <Text className="text-orange-600 dark:text-orange-400 text-xs font-semibold">{request.distance_km} km away</Text>
            </View>
            <View className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <Text className="text-gray-600 dark:text-gray-300 text-xs font-semibold">{request.bid_count} bids</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5 mb-4">{request.description}</Text>

          {/* Details grid */}
          <View className="bg-gray-50 dark:bg-[#0F172A] rounded-2xl p-4 mb-5" style={{ gap: 10 }}>
            <View className="flex-row items-center">
              <MapPinIcon size={16} color="#9CA3AF" />
              <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">{request.location}</Text>
            </View>
            <View className="flex-row items-center">
              <CalendarIcon size={16} color="#9CA3AF" />
              <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {formatDate(request.preferred_date)} at {formatTime(request.preferred_date)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <CurrencyDollarIcon size={16} color="#9CA3AF" />
              <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {formatCurrency(request.budget_min)} – {formatCurrency(request.budget_max)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <UserGroupIcon size={16} color="#9CA3AF" />
              <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                Client: {request.client_name}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onBid}
            className="bg-primary-500 rounded-xl py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">Make a Bid</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Explore Open Requests Modal ────────────────────────────────────────────────
interface ExploreModalProps {
  visible: boolean;
  onClose: () => void;
}

function ExploreModal({ visible, onClose }: ExploreModalProps) {
  const [selectedRequest, setSelectedRequest] = useState<OpenRequest | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [bidVisible, setBidVisible] = useState(false);

  const handleCardPress = (req: OpenRequest) => {
    setSelectedRequest(req);
    setDetailVisible(true);
  };

  const handleViewDetails = () => {
    // detailVisible already open
  };

  const handleBidFromDetail = () => {
    setDetailVisible(false);
    setBidVisible(true);
  };

  const handleBidDirect = (req: OpenRequest) => {
    setSelectedRequest(req);
    setBidVisible(true);
  };

  const handleBidSubmit = (bid: any) => {
    setBidVisible(false);
    setSelectedRequest(null);
    showErrorAlert('Bid Submitted!', `Your bid for "${selectedRequest?.title}" has been submitted.`);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
          <StatusBar style="auto" />

          {/* Header */}
          <View className="px-4 pt-4 pb-3 bg-white dark:bg-[#1E293B] border-b border-gray-100 dark:border-[#334155] flex-row items-center">
            <TouchableOpacity onPress={onClose} className="mr-3 p-1">
              <ArrowLeftIcon size={22} color="#F57C1F" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">Open Requests</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Nearby gigs matching your services
              </Text>
            </View>
            <View className="bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full">
              <Text className="text-primary-500 font-bold text-xs">{DUMMY_OPEN_REQUESTS.length} available</Text>
            </View>
          </View>

          <FlatList
            data={DUMMY_OPEN_REQUESTS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-white dark:bg-[#1E293B] rounded-2xl mb-4 overflow-hidden border border-gray-100 dark:border-[#334155]">
                {/* Top bar */}
                <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
                  <View className="flex-row items-center" style={{ gap: 6 }}>
                    <View className="bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                      <Text className="text-blue-600 dark:text-blue-400 text-xs font-semibold">{item.category}</Text>
                    </View>
                    <View className="bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-full flex-row items-center">
                      <MapPinIcon size={11} color="#F57C1F" />
                      <Text className="text-orange-500 text-xs font-semibold ml-0.5">{item.distance_km} km</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-gray-400">{item.request_number}</Text>
                </View>

                {/* Title & description */}
                <View className="px-4 pb-3">
                  <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">{item.title}</Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 leading-4" numberOfLines={2}>{item.description}</Text>
                </View>

                {/* Info row */}
                <View className="flex-row items-center px-4 pb-3" style={{ gap: 14 }}>
                  <View className="flex-row items-center">
                    <CurrencyDollarIcon size={13} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {formatCurrency(item.budget_min)}–{formatCurrency(item.budget_max)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <CalendarIcon size={13} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {formatDate(item.preferred_date)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <DocumentTextIcon size={13} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {item.bid_count} bids
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row border-t border-gray-100 dark:border-[#334155]">
                  <TouchableOpacity
                    onPress={() => handleCardPress(item)}
                    className="flex-1 py-3 items-center border-r border-gray-100 dark:border-[#334155]"
                    activeOpacity={0.7}
                  >
                    <Text className="text-sm font-semibold text-gray-600 dark:text-gray-300">View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleBidDirect(item)}
                    className="flex-1 py-3 items-center"
                    activeOpacity={0.7}
                  >
                    <Text className="text-sm font-bold text-primary-500">Make a Bid</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Detail Sheet */}
      <RequestDetailSheet
        visible={detailVisible}
        request={selectedRequest}
        onClose={() => setDetailVisible(false)}
        onBid={handleBidFromDetail}
      />

      {/* Bid Form */}
      <BidFormModal
        visible={bidVisible}
        request={selectedRequest}
        onClose={() => setBidVisible(false)}
        onSubmit={handleBidSubmit}
      />
    </>
  );
}

// ── Main Requests Screen ───────────────────────────────────────────────────────
export default function RequestsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [directRequests, setDirectRequests] = useState<ServiceRequest[]>([]);
  const [exploreVisible, setExploreVisible] = useState(false);

  const activeBusinessId = useSelector((state: RootState) => state.auth.activeBusinessId);

  const fetchDirectRequests = useCallback(async () => {
    if (!activeBusinessId) return;
    setIsLoading(true);
    try {
      const response = await apiRequests.get(
        `/provider/${activeBusinessId}/service-requests/direct`
      );
      if (response.data.success) {
        setDirectRequests(response.data.data);
      } else {
        showErrorAlert('Error', response.data.message || 'Failed to fetch service requests');
      }
    } catch (error: any) {
      console.error('Service requests fetch error:', error);
      showErrorAlert('Error', 'Failed to fetch service requests');
    } finally {
      setIsLoading(false);
    }
  }, [activeBusinessId]);

  useEffect(() => {
    fetchDirectRequests();
  }, [fetchDirectRequests]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDirectRequests();
    setRefreshing(false);
  }, [fetchDirectRequests]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Direct Requests</Text>
        <Text className="text-sm mt-1 text-gray-500 dark:text-gray-400">
          Clients requesting your services directly
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F57C1F" />
        }
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-6">
          {isLoading ? (
            <View className="py-16 items-center">
              <ActivityIndicator size="large" color="#F57C1F" />
            </View>
          ) : directRequests.length === 0 ? (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-10 items-center mt-4">
              <View className="w-16 h-16 bg-gray-100 dark:bg-[#0F172A] rounded-full items-center justify-center mb-4">
                <ClipboardDocumentListIconPlaceholder />
              </View>
              <Text className="text-base font-bold text-gray-700 dark:text-gray-300 mb-1">
                No direct requests yet
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                When a client sends you a direct service request it will appear here.
              </Text>
            </View>
          ) : (
            directRequests.map((request) => (
              <DirectRequestCard
                key={request.id}
                request={request}
                onPress={() => router.push(`/(service-requests)/${request.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB — Explore Open Requests */}
      <TouchableOpacity
        onPress={() => setExploreVisible(true)}
        activeOpacity={0.85}
        className="absolute bottom-8 right-5 bg-primary-500 rounded-2xl px-5 py-4 flex-row items-center shadow-lg"
        style={{
          shadowColor: '#F57C1F',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <SparklesIcon size={20} color="#fff" />
        <Text className="text-white font-bold ml-2 text-sm">Explore Open Requests</Text>
      </TouchableOpacity>

      <ExploreModal visible={exploreVisible} onClose={() => setExploreVisible(false)} />
    </SafeAreaView>
  );
}

// ── Direct Request Card ────────────────────────────────────────────────────────
function ClipboardDocumentListIconPlaceholder() {
  return (
    <DocumentTextIcon size={32} color="#9CA3AF" />
  );
}

interface DirectRequestCardProps {
  request: ServiceRequest;
  onPress: () => void;
}

function DirectRequestCard({ request, onPress }: DirectRequestCardProps) {
  const statusConfig = {
    pending: { bg: 'bg-orange-100 dark:bg-orange-900/30', icon: <ClockIcon size={15} color="#F59E0B" />, label: 'Pending', textColor: 'text-orange-600' },
    accepted: { bg: 'bg-green-100 dark:bg-green-900/30', icon: <CheckIcon size={15} color="#10B981" />, label: 'Accepted', textColor: 'text-green-600' },
    rejected: { bg: 'bg-red-100 dark:bg-red-900/30', icon: <XMarkIcon size={15} color="#EF4444" />, label: 'Rejected', textColor: 'text-red-500' },
  };

  const resp = request.provider_response?.provider_response_type ?? 'pending';
  const config = statusConfig[resp] ?? statusConfig.pending;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="bg-white dark:bg-[#1E293B] rounded-2xl mb-4 overflow-hidden border border-gray-100 dark:border-[#334155]"
    >
      {/* Header */}
      <View className="flex-row items-center px-4 pt-4 pb-3 border-b border-gray-50 dark:border-[#334155]">
        <View className="w-11 h-11 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center mr-3">
          <Text className="text-primary-500 font-bold text-lg">
            {request.client_name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-bold text-gray-900 dark:text-white text-sm">{request.client_name}</Text>
          <Text className="text-xs text-gray-400">{timeAgo(request.created_at)}</Text>
        </View>
        <View className={`flex-row items-center px-2.5 py-1 rounded-full ${config.bg}`}>
          {config.icon}
          <Text className={`text-xs font-semibold ml-1 ${config.textColor}`}>{config.label}</Text>
        </View>
      </View>

      <View className="px-4 py-3">
        {/* Request number */}
        <Text className="text-xs text-gray-400 mb-2">{request.request_number}</Text>

        {/* Services */}
        <View className="flex-row flex-wrap mb-2" style={{ gap: 5 }}>
          {request.services.map((s) => (
            <View key={s.id} className="bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 rounded-full flex-row items-center">
              <TagIcon size={10} color="#3B82F6" />
              <Text className="text-blue-600 dark:text-blue-400 text-xs ml-1">{s.service_name}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-4" numberOfLines={2}>
          {request.description}
        </Text>

        {/* Details */}
        <View style={{ gap: 5 }}>
          <View className="flex-row items-center">
            <MapPinIcon size={13} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">
              {request.address}, {request.city}
            </Text>
          </View>
          <View className="flex-row items-center">
            <CalendarIcon size={13} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">
              {formatDate(request.preferred_date)} at {formatTime(request.preferred_date)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <CurrencyDollarIcon size={13} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">
              Budget: {formatCurrency(request.budget_min)} – {formatCurrency(request.budget_max)}
            </Text>
          </View>
        </View>

        {/* Responded message */}
        {resp !== 'pending' && (
          <View className={`mt-3 px-3 py-2 rounded-lg ${resp === 'accepted' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <Text className={`text-xs font-medium ${resp === 'accepted' ? 'text-green-600' : 'text-red-500'}`}>
              {resp === 'accepted' ? 'You accepted this request' : 'You rejected this request'}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-end px-4 pb-3">
        <Text className="text-xs text-primary-500 font-semibold mr-1">View Details</Text>
        <ChevronRightIcon size={14} color="#F57C1F" />
      </View>
    </TouchableOpacity>
  );
}
