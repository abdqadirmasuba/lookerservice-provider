// File: app/(bookings)/[id].tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { apiRequests } from '@/src/utils/apiRequest';
import { showErrorAlert } from '@/src/utils/alerts';
import type { Booking } from '@/app/(tabs)/bookings';
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  HashtagIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  ClockIcon,
  InformationCircleIcon,
} from 'react-native-heroicons/outline';

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

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-UG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <View className="flex-row items-start py-3 border-b border-gray-100 dark:border-[#334155]">
      <View className="w-8 items-center mt-0.5">{icon}</View>
      <View className="flex-1">
        <Text className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</Text>
        <Text className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value}</Text>
      </View>
    </View>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-white dark:bg-[#1E293B] rounded-2xl px-4 pt-3 pb-1 mb-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const activeBusinessId = useSelector(
    (state: RootState) => state.auth.activeBusinessId
  );

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Complete modal state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [providerNotes, setProviderNotes] = useState('');

  const fetchBooking = useCallback(async () => {
    if (!activeBusinessId || !id) return;
    setIsLoading(true);
    try {
      const response = await apiRequests.get(
        `/provider/${activeBusinessId}/bookings/${id}`
      );
      if (response.data.success) {
        setBooking(response.data.data);
      } else {
        showErrorAlert('Error', response.data.message || 'Failed to load booking');
      }
    } catch (error: any) {
      console.error('Booking fetch error:', error);
      showErrorAlert('Error', 'Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  }, [activeBusinessId, id]);

  useFocusEffect(
    useCallback(() => {
      fetchBooking();
    }, [fetchBooking])
  );

  const updateStatus = async (
    newStatus: string,
    extra?: { rejection_reason?: string; provider_notes?: string },
  ) => {
    if (!activeBusinessId || !booking) return;
    setActionLoading(newStatus);
    try {
      const body: Record<string, string> = { status: newStatus };
      if (extra?.rejection_reason) body.rejection_reason = extra.rejection_reason;
      if (extra?.provider_notes) body.provider_notes = extra.provider_notes;

      const response = await apiRequests.patch(
        `/provider/${activeBusinessId}/bookings/${booking.id}/status`,
        body,
      );
      if (response.data.success) {
        setBooking((prev) => (prev ? { ...prev, status: newStatus } : prev));
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
    newStatus: string,
  ) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => updateStatus(newStatus) },
    ]);
  };

  const openRejectModal = () => {
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const submitReject = () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Required', 'Please enter a rejection reason.');
      return;
    }
    setShowRejectModal(false);
    updateStatus('rejected', { rejection_reason: rejectionReason.trim() });
  };

  const openCompleteModal = () => {
    setProviderNotes('');
    setShowCompleteModal(true);
  };

  const submitComplete = () => {
    setShowCompleteModal(false);
    updateStatus('completed', {
      provider_notes: providerNotes.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A] items-center justify-center">
        <ActivityIndicator size="large" color="#F57C1F" />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
        <View className="px-6 pt-4 pb-3 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
            <ArrowLeftIcon size={22} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Booking Details
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 dark:text-gray-500">Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusStyle(booking.status);
  const isPending = booking.status === 'pending';
  const isAccepted = booking.status === 'accepted';
  const isInProgress = booking.status === 'in_progress';
  const isTerminal = ['completed', 'cancelled', 'rejected'].includes(booking.status);

  const initials = booking.client_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
            <ArrowLeftIcon size={22} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Booking Details
          </Text>
        </View>
        <View
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: statusStyle.bg }}
        >
          <Text
            className="text-xs font-bold capitalize"
            style={{ color: statusStyle.text }}
          >
            {booking.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        {/* Client Hero */}
        <View
          className="bg-white dark:bg-[#1E293B] rounded-2xl px-4 py-5 mb-4 items-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <View className="w-16 h-16 rounded-full bg-primary-100 items-center justify-center mb-3">
            <Text className="text-primary-600 font-bold text-2xl">{initials}</Text>
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {booking.client_name}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {booking.service_title}
          </Text>
        </View>

        {/* Booking Info */}
        <SectionCard title="Booking Info">
          <InfoRow
            icon={<HashtagIcon size={16} color="#9CA3AF" />}
            label="Booking Number"
            value={booking.booking_number}
          />
          <InfoRow
            icon={<CalendarIcon size={16} color="#9CA3AF" />}
            label="Booking Date"
            value={formatDate(booking.booking_date)}
          />
          <InfoRow
            icon={<InformationCircleIcon size={16} color="#9CA3AF" />}
            label="Source"
            value={booking.source_type?.booking_source_type?.replace('_', ' ')}
          />
          {booking.agreed_amount && (
            <InfoRow
              icon={<Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '600' }}>UGX</Text>}
              label="Agreed Amount"
              value={`UGX ${Number(booking.agreed_amount).toLocaleString()}`}
            />
          )}
          {booking.payment_method?.valid && (
            <InfoRow
              icon={<InformationCircleIcon size={16} color="#9CA3AF" />}
              label="Payment Method"
              value={booking.payment_method.payment_method}
            />
          )}
        </SectionCard>

        {/* Client Info */}
        <SectionCard title="Client">
          <InfoRow
            icon={<UserIcon size={16} color="#9CA3AF" />}
            label="Name"
            value={booking.client_name}
          />
          <InfoRow
            icon={<EnvelopeIcon size={16} color="#9CA3AF" />}
            label="Email"
            value={booking.client_email}
          />
          <InfoRow
            icon={<PhoneIcon size={16} color="#9CA3AF" />}
            label="Phone"
            value={booking.client_phone}
          />
        </SectionCard>

        {/* Timeline */}
        <SectionCard title="Timeline">
          <InfoRow
            icon={<ClockIcon size={16} color="#9CA3AF" />}
            label="Created"
            value={formatDate(booking.created_at)}
          />
          <InfoRow
            icon={<CheckCircleIcon size={16} color="#2563EB" />}
            label="Accepted"
            value={formatDate(booking.accepted_at)}
          />
          <InfoRow
            icon={<PlayIcon size={16} color="#7C3AED" />}
            label="Started"
            value={formatDate(booking.started_at)}
          />
          <InfoRow
            icon={<CheckCircleIcon size={16} color="#059669" />}
            label="Completed"
            value={formatDate(booking.completed_at)}
          />
          <InfoRow
            icon={<XCircleIcon size={16} color="#DC2626" />}
            label="Cancelled"
            value={formatDate(booking.cancelled_at)}
          />
        </SectionCard>

        {/* Notes */}
        {(booking.client_notes || booking.provider_notes) && (
          <SectionCard title="Notes">
            {booking.client_notes ? (
              <View className="py-3 border-b border-gray-100 dark:border-[#334155]">
                <Text className="text-xs text-gray-400 dark:text-gray-500 mb-1">Client Notes</Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {booking.client_notes}
                </Text>
              </View>
            ) : null}
            {booking.provider_notes ? (
              <View className="py-3">
                <Text className="text-xs text-gray-400 dark:text-gray-500 mb-1">Provider Notes</Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {booking.provider_notes}
                </Text>
              </View>
            ) : null}
          </SectionCard>
        )}

        {/* Rejection / Cancellation reason */}
        {(booking.rejection_reason || booking.cancellation_reason) && (
          <View className="bg-red-50 dark:bg-red-900/20 rounded-2xl px-4 py-4 mb-4">
            <Text className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
              {booking.rejection_reason ? 'Rejection Reason' : 'Cancellation Reason'}
            </Text>
            <Text className="text-sm text-red-700 dark:text-red-300">
              {booking.rejection_reason ?? booking.cancellation_reason}
            </Text>
            {booking.cancelled_by && (
              <Text className="text-xs text-red-400 mt-1">
                Cancelled by: {booking.cancelled_by}
              </Text>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {!isTerminal && (
          <View style={{ gap: 12 }}>
            {isPending && (
              <View className="flex-row" style={{ gap: 12 }}>
                <TouchableOpacity
                  onPress={openRejectModal}
                  disabled={!!actionLoading}
                  className="flex-1 border border-red-400 py-3.5 rounded-2xl flex-row items-center justify-center"
                >
                  {actionLoading === 'rejected' ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                  ) : (
                    <>
                      <XCircleIcon size={20} color="#DC2626" />
                      <Text className="text-red-600 font-bold ml-2">Reject</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    confirmAction(
                      'Accept Booking',
                      'Accept this booking?',
                      'accepted'
                    )
                  }
                  disabled={!!actionLoading}
                  className="flex-1 bg-blue-500 py-3.5 rounded-2xl flex-row items-center justify-center"
                >
                  {actionLoading === 'accepted' ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <CheckCircleIcon size={20} color="#fff" />
                      <Text className="text-white font-bold ml-2">Accept</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {isAccepted && (
              <TouchableOpacity
                onPress={() =>
                  confirmAction(
                    'Start Service',
                    'Mark this booking as in progress?',
                    'in_progress'
                  )
                }
                disabled={!!actionLoading}
                className="bg-primary-500 py-3.5 rounded-2xl flex-row items-center justify-center"
              >
                {actionLoading === 'in_progress' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <PlayIcon size={20} color="#fff" />
                    <Text className="text-white font-bold ml-2">Start Service</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {isInProgress && (
              <TouchableOpacity
                onPress={openCompleteModal}
                disabled={!!actionLoading}
                className="bg-green-500 py-3.5 rounded-2xl flex-row items-center justify-center"
              >
                {actionLoading === 'completed' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <CheckCircleIcon size={20} color="#fff" />
                    <Text className="text-white font-bold ml-2">Mark as Complete</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* ── Reject Modal ─────────────────────────────────────── */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <Pressable
            className="flex-1 bg-black/50 justify-end"
            onPress={() => setShowRejectModal(false)}
          >
            <Pressable onPress={() => {}}>
              <View className="bg-white dark:bg-[#1E293B] rounded-t-3xl px-6 pt-5 pb-8">
                <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#475569] self-center mb-5" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Reject Booking
                </Text>
                {booking && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {booking.booking_number}
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
                    onPress={() => setShowRejectModal(false)}
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
        visible={showCompleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <Pressable
            className="flex-1 bg-black/50 justify-end"
            onPress={() => setShowCompleteModal(false)}
          >
            <Pressable onPress={() => {}}>
              <View className="bg-white dark:bg-[#1E293B] rounded-t-3xl px-6 pt-5 pb-8">
                <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#475569] self-center mb-5" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Complete Booking
                </Text>
                {booking && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {booking.booking_number}
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
                    onPress={() => setShowCompleteModal(false)}
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
