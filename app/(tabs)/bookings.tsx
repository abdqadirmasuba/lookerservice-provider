// File: app/(tabs)/bookings.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { apiRequests } from '@/src/utils/apiRequest';
import { showErrorAlert } from '@/src/utils/alerts';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  HashtagIcon,
} from 'react-native-heroicons/outline';

export interface Booking {
  id: string;
  booking_number: string;
  client_id: string;
  provider_id: string;
  service_request_id: string;
  bid_id: string | null;
  source_type: { booking_source_type: string; valid: boolean };
  booking_date: string;
  reschedule: string | null;
  status: string;
  client_notes: string | null;
  provider_notes: string;
  rejection_reason: string | null;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  agreed_amount: string | null;
  payment_method: { payment_method: string; valid: boolean };
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_picture: string | null;
  service_title: string;
}

type FilterTab =
  | 'all'
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'rejected', label: 'Rejected' },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706' },
  accepted: { bg: '#DBEAFE', text: '#2563EB' },
  in_progress: { bg: '#EDE9FE', text: '#7C3AED' },
  completed: { bg: '#D1FAE5', text: '#059669' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  rejected: { bg: '#FFE4E6', text: '#BE123C' },
};

function getStatusStyle(status: string) {
  return STATUS_STYLE[status] ?? { bg: '#F3F4F6', text: '#6B7280' };
}

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-UG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: string }) {
  const style = getStatusStyle(status);
  const label = status.replace('_', ' ');
  return (
    <View
      className="px-2.5 py-1 rounded-full"
      style={{ backgroundColor: style.bg }}
    >
      <Text
        className="text-xs font-semibold capitalize"
        style={{ color: style.text }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function BookingsScreen() {
  const router = useRouter();
  const activeBusinessId = useSelector(
    (state: RootState) => state.auth.activeBusinessId
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Reject modal
  const [rejectModal, setRejectModal] = useState<{ bookingId: string; bookingNumber: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Complete with notes modal
  const [completeModal, setCompleteModal] = useState<{ bookingId: string; bookingNumber: string } | null>(null);
  const [providerNotes, setProviderNotes] = useState('');

  const fetchBookings = useCallback(async () => {
    if (!activeBusinessId) return;
    setIsLoading(true);
    try {
      const response = await apiRequests.get(
        `/provider/${activeBusinessId}/bookings`
      );
      if (response.data.success) {
        setBookings(response.data.data ?? []);
      } else {
        showErrorAlert('Error', response.data.message || 'Failed to fetch bookings');
      }
    } catch (error: any) {
      console.error('Bookings fetch error:', error);
      showErrorAlert('Error', 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  }, [activeBusinessId]);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [fetchBookings])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  }, [fetchBookings]);

  const updateStatus = async (
    bookingId: string,
    newStatus: string,
    extra?: { rejection_reason?: string; provider_notes?: string },
  ) => {
    if (!activeBusinessId) return;
    setActionLoading(bookingId + newStatus);
    try {
      const body: Record<string, string> = { status: newStatus };
      if (extra?.rejection_reason) body.rejection_reason = extra.rejection_reason;
      if (extra?.provider_notes) body.provider_notes = extra.provider_notes;

      const response = await apiRequests.patch(
        `/provider/${activeBusinessId}/bookings/${bookingId}/status`,
        body,
      );
      if (response.data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus } : b,
          ),
        );
      } else {
        showErrorAlert('Error', response.data.message || 'Action failed');
      }
    } catch (error: any) {
      console.error('Status update error:', error);
      showErrorAlert('Error', 'Failed to update booking status');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmAction = (
    title: string,
    message: string,
    bookingId: string,
    newStatus: string,
  ) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => updateStatus(bookingId, newStatus),
      },
    ]);
  };

  const handleReject = (bookingId: string, bookingNumber: string) => {
    setRejectionReason('');
    setRejectModal({ bookingId, bookingNumber });
  };

  const submitReject = () => {
    if (!rejectModal) return;
    if (!rejectionReason.trim()) {
      Alert.alert('Required', 'Please enter a rejection reason.');
      return;
    }
    const { bookingId } = rejectModal;
    setRejectModal(null);
    updateStatus(bookingId, 'rejected', { rejection_reason: rejectionReason.trim() });
  };

  const handleComplete = (bookingId: string, bookingNumber: string) => {
    setProviderNotes('');
    setCompleteModal({ bookingId, bookingNumber });
  };

  const submitComplete = () => {
    if (!completeModal) return;
    const { bookingId } = completeModal;
    setCompleteModal(null);
    updateStatus(bookingId, 'completed', {
      provider_notes: providerNotes.trim() || undefined,
    });
  };

  const filtered =
    activeTab === 'all'
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  const countFor = (key: FilterTab) =>
    key === 'all' ? bookings.length : bookings.filter((b) => b.status === key).length;

  if (isLoading && bookings.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A] items-center justify-center">
        <ActivityIndicator size="large" color="#F57C1F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Bookings
        </Text>
        <Text className="text-sm mt-1 text-gray-600 dark:text-gray-400">
          Manage all your service bookings
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 4 }}
        className="mb-3"
      >
        <View className="flex-row" style={{ gap: 8 }}>
          {FILTER_TABS.map(({ key, label }) => {
            const count = countFor(key);
            const isActive = activeTab === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-full flex-row items-center ${
                  isActive ? 'bg-primary-500' : 'bg-white dark:bg-[#1E293B]'
                }`}
                style={{
                  borderWidth: isActive ? 0 : 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {label}
                </Text>
                {count > 0 && (
                  <View
                    className="ml-1.5 rounded-full px-1.5 py-0.5"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#F3F4F6',
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: isActive ? '#fff' : '#6B7280' }}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F57C1F"
          />
        }
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
      >
        {filtered.length === 0 ? (
          <View className="items-center justify-center py-24">
            <CalendarIcon size={48} color="#D1D5DB" />
            <Text className="mt-4 text-base text-gray-400 dark:text-gray-500">
              No {activeTab !== 'all' ? activeTab.replace('_', ' ') : ''} bookings
            </Text>
          </View>
        ) : (
          filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              actionLoading={actionLoading}
              onPress={() => router.push(`/(bookings)/${booking.id}`)}
              onAccept={() =>
                confirmAction(
                  'Accept Booking',
                  `Accept booking ${booking.booking_number}?`,
                  booking.id,
                  'accepted'
                )
              }
              onReject={() => handleReject(booking.id, booking.booking_number)}
              onStart={() =>
                confirmAction(
                  'Start Service',
                  `Start service for booking ${booking.booking_number}?`,
                  booking.id,
                  'in_progress'
                )
              }
              onComplete={() => handleComplete(booking.id, booking.booking_number)}
            />
          ))
        )}
      </ScrollView>

      {/* ── Reject Modal ─────────────────────────────────────── */}
      <Modal
        visible={!!rejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModal(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <Pressable
            className="flex-1 bg-black/50 justify-end"
            onPress={() => setRejectModal(null)}
          >
            <Pressable onPress={() => {}}>
              <View className="bg-white dark:bg-[#1E293B] rounded-t-3xl px-6 pt-5 pb-8">
                <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#475569] self-center mb-5" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Reject Booking
                </Text>
                {rejectModal && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {rejectModal.bookingNumber}
                  </Text>
                )}
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rejection Reason <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={rejectionReason}
                  onChangeText={setRejectionReason}
                  placeholder="Enter reason for rejection…"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="bg-gray-100 dark:bg-[#0F172A] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm"
                  style={{ minHeight: 80 }}
                />
                <View className="flex-row mt-5" style={{ gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => setRejectModal(null)}
                    className="flex-1 border border-gray-300 dark:border-[#334155] py-3.5 rounded-2xl items-center"
                  >
                    <Text className="font-semibold text-gray-600 dark:text-gray-400">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={submitReject}
                    className="flex-1 bg-red-500 py-3.5 rounded-2xl flex-row items-center justify-center"
                  >
                    <XCircleIcon size={18} color="#fff" />
                    <Text className="text-white font-bold ml-2">Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Complete Modal ────────────────────────────────────── */}
      <Modal
        visible={!!completeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setCompleteModal(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <Pressable
            className="flex-1 bg-black/50 justify-end"
            onPress={() => setCompleteModal(null)}
          >
            <Pressable onPress={() => {}}>
              <View className="bg-white dark:bg-[#1E293B] rounded-t-3xl px-6 pt-5 pb-8">
                <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#475569] self-center mb-5" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Complete Booking
                </Text>
                {completeModal && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {completeModal.bookingNumber}
                  </Text>
                )}
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Provider Notes <Text className="text-gray-400">(optional)</Text>
                </Text>
                <TextInput
                  value={providerNotes}
                  onChangeText={setProviderNotes}
                  placeholder="Add any completion notes…"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="bg-gray-100 dark:bg-[#0F172A] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm"
                  style={{ minHeight: 80 }}
                />
                <View className="flex-row mt-5" style={{ gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => setCompleteModal(null)}
                    className="flex-1 border border-gray-300 dark:border-[#334155] py-3.5 rounded-2xl items-center"
                  >
                    <Text className="font-semibold text-gray-600 dark:text-gray-400">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={submitComplete}
                    className="flex-1 bg-green-500 py-3.5 rounded-2xl flex-row items-center justify-center"
                  >
                    <CheckCircleIcon size={18} color="#fff" />
                    <Text className="text-white font-bold ml-2">Complete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

interface BookingCardProps {
  booking: Booking;
  actionLoading: string | null;
  onPress: () => void;
  onAccept: () => void;
  onReject: () => void;
  onStart: () => void;
  onComplete: () => void;
}

function BookingCard({
  booking,
  actionLoading,
  onPress,
  onAccept,
  onReject,
  onStart,
  onComplete,
}: BookingCardProps) {
  const isPending = booking.status === 'pending';
  const isAccepted = booking.status === 'accepted';
  const isInProgress = booking.status === 'in_progress';
  const isTerminal = ['completed', 'cancelled', 'rejected'].includes(booking.status);

  const isActionLoading = (suffix: string) =>
    actionLoading === booking.id + suffix;

  const initials = booking.client_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white dark:bg-[#1E293B] rounded-2xl mb-4 overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Card Header */}
      <View className="px-4 pt-4 pb-3 flex-row items-start justify-between">
        <View className="flex-row items-center flex-1 mr-3">
          <View className="w-11 h-11 rounded-full bg-primary-100 items-center justify-center mr-3">
            <Text className="text-primary-600 font-bold text-base">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text
              className="font-bold text-gray-900 dark:text-white text-base"
              numberOfLines={1}
            >
              {booking.client_name}
            </Text>
            <Text className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
              {booking.service_title}
            </Text>
          </View>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-100 dark:bg-[#334155] mx-4" />

      {/* Meta info */}
      <View className="px-4 py-3" style={{ gap: 8 }}>
        <View className="flex-row items-center">
          <HashtagIcon size={14} color="#9CA3AF" />
          <Text className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {booking.booking_number}
          </Text>
        </View>
        <View className="flex-row items-center">
          <CalendarIcon size={14} color="#9CA3AF" />
          <Text className="text-xs text-gray-600 dark:text-gray-400 ml-2">
            {formatDate(booking.booking_date)}
          </Text>
        </View>
        {booking.client_phone && (
          <View className="flex-row items-center">
            <PhoneIcon size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-600 dark:text-gray-400 ml-2">
              {booking.client_phone}
            </Text>
          </View>
        )}
        {booking.agreed_amount && (
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-500 dark:text-gray-400 mr-1">UGX</Text>
            <Text className="text-xs font-bold text-gray-900 dark:text-white">
              {Number(booking.agreed_amount).toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      {/* Rejection / Cancellation reason */}
      {(booking.rejection_reason || booking.cancellation_reason) && (
        <View className="mx-4 mb-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
          <Text className="text-xs text-red-600 dark:text-red-400">
            {booking.rejection_reason
              ? `Rejection reason: ${booking.rejection_reason}`
              : `Cancellation reason: ${booking.cancellation_reason}`}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      {!isTerminal && (
        <View className="px-4 pb-4 pt-1" style={{ gap: 10 }}>
          {isPending && (
            <View className="flex-row" style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={onReject}
                disabled={!!actionLoading}
                className="flex-1 border border-red-400 py-3 rounded-xl flex-row items-center justify-center"
              >
                {isActionLoading('rejected') ? (
                  <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                  <>
                    <XCircleIcon size={18} color="#DC2626" />
                    <Text className="text-red-600 font-semibold ml-2">Reject</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onAccept}
                disabled={!!actionLoading}
                className="flex-1 bg-blue-500 py-3 rounded-xl flex-row items-center justify-center"
              >
                {isActionLoading('accepted') ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <CheckCircleIcon size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Accept</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {isAccepted && (
            <TouchableOpacity
              onPress={onStart}
              disabled={!!actionLoading}
              className="bg-primary-500 py-3 rounded-xl flex-row items-center justify-center"
            >
              {isActionLoading('in_progress') ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <PlayIcon size={18} color="#fff" />
                  <Text className="text-white font-bold ml-2">Start Service</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {isInProgress && (
            <TouchableOpacity
              onPress={onComplete}
              disabled={!!actionLoading}
              className="bg-green-500 py-3 rounded-xl flex-row items-center justify-center"
            >
              {isActionLoading('completed') ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <CheckCircleIcon size={18} color="#fff" />
                  <Text className="text-white font-bold ml-2">Mark as Complete</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}