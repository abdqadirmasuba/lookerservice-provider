import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
  Dimensions,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { apiRequests } from '@/src/utils/apiRequest';
import { showErrorAlert } from '@/src/utils/alerts';
import { DirectRequestDetail } from '@/src/types/serviceRequest';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
} from 'react-native-heroicons/outline';

export default function ServiceRequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [request, setRequest] = useState<DirectRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<{
    id: string;
    booking_number: string;
    status: string;
    booking_date: string;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  
  const activeBusinessId = useSelector((state: RootState) => state.auth.activeBusinessId);

  useEffect(() => {
    if (activeBusinessId && id) {
      fetchRequestDetails();
    }
  }, [activeBusinessId, id]);

  const fetchRequestDetails = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequests.get(
        `/provider/${activeBusinessId}/service-requests/${id}`
      );
      if (response.data.success) {
        setRequest(response.data.data);
      } else {
        showErrorAlert('Error', response.data.message || 'Failed to fetch request details');
      }
    } catch (error: any) {
      console.error('Request details fetch error:', error);
      showErrorAlert('Error', 'Failed to fetch request details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = () => {
    setShowConfirmModal(true);
  };

  const confirmAcceptRequest = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      const response = await apiRequests.post(
        `/provider/${activeBusinessId}/service-requests/${id}/accept`
      );
      if (response.data.success) {
        setCreatedBooking(response.data.data);
        setShowSuccessModal(true);
      } else {
        showErrorAlert('Error', response.data.message || 'Failed to accept request');
      }
    } catch (error: any) {
      console.error('Accept request error:', error);
      showErrorAlert('Error', 'Failed to accept request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectRequest = () => {
    setRejectionReason('');
    setRejectionError('');
    setShowRejectModal(true);
  };

  const confirmRejectRequest = async () => {
    const trimmed = rejectionReason.trim();
    if (trimmed.length < 10) {
      setRejectionError('Reason must be at least 10 characters.');
      return;
    }
    setShowRejectModal(false);
    setIsSubmitting(true);
    try {
      const response = await apiRequests.post(
        `/provider/${activeBusinessId}/service-requests/${id}/reject`,
        { rejection_reason: trimmed }
      );
      if (response.data.success) {
        Alert.alert('Request Rejected', 'The service request has been rejected.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        showErrorAlert('Error', response.data.message || 'Failed to reject request');
      }
    } catch (error: any) {
      console.error('Reject request error:', error);
      showErrorAlert('Error', 'Failed to reject request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount == null) return 'UGX N/A';
    return `UGX ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseImages = (imagesField: any): string[] => {
    if (!imagesField) return [];
    // API may return an array directly
    if (Array.isArray(imagesField)) return imagesField.filter(Boolean);
    if (typeof imagesField !== 'string') return [];
    if (imagesField.trim() === '' || imagesField === 'null') return [];
    // Try direct JSON parse first (e.g. '["url1","url2"]')
    try {
      const parsed = JSON.parse(imagesField);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      if (typeof parsed === 'string') return [parsed];
    } catch {
      // not a JSON string
    }
    // Try base64-encoded JSON
    try {
      const decoded = atob(imagesField);
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      // not base64 JSON
    }
    // Fallback: treat as single URL or comma-separated URLs
    return imagesField.split(',').map((s) => s.trim()).filter(Boolean);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A] items-center justify-center">
        <ActivityIndicator size="large" color="#F57C1F" />
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A] items-center justify-center">
        <Text className="text-gray-600 dark:text-gray-400">Request not found</Text>
      </SafeAreaView>
    );
  }

  const images = parseImages(request.images);
  const isPending = request.provider_response === 'pending';

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Full-screen image viewer */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' }}
          onPress={() => setSelectedImage(null)}
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: screenWidth, height: screenHeight * 0.75 }}
              resizeMode="contain"
            />
          )}
          <View style={{ position: 'absolute', top: 48, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Tap to close</Text>
          </View>
        </Pressable>
      </Modal>

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 w-full">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3">
                <XCircleIcon size={32} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Reject Request
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                Please provide a reason for rejecting this request.
              </Text>
            </View>

            <TextInput
              value={rejectionReason}
              onChangeText={(t) => {
                setRejectionReason(t);
                if (rejectionError) setRejectionError('');
              }}
              placeholder="e.g. I am fully booked for the requested dates…"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm mb-1"
              style={{ minHeight: 96 }}
            />
            <View className="flex-row justify-between mb-4">
              {rejectionError ? (
                <Text className="text-xs text-red-500">{rejectionError}</Text>
              ) : (
                <Text className="text-xs text-gray-400">Minimum 10 characters</Text>
              )}
              <Text className="text-xs text-gray-400">{rejectionReason.trim().length} chars</Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowRejectModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-[#334155] rounded-xl items-center"
              >
                <Text className="font-semibold text-gray-600 dark:text-gray-400">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmRejectRequest}
                className="flex-1 py-3 bg-red-500 rounded-xl items-center"
              >
                <Text className="font-semibold text-white">Confirm Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Accept Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 w-full">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-3">
                <CheckCircleIcon size={32} color="#F57C1F" />
              </View>
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Accept Request?
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                By accepting, a new booking will be created from this service request.
              </Text>
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-[#334155] rounded-xl items-center"
              >
                <Text className="font-semibold text-gray-600 dark:text-gray-400">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmAcceptRequest}
                className="flex-1 py-3 bg-primary-500 rounded-xl items-center"
              >
                <Text className="font-semibold text-white">Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 w-full">
            <View className="items-center mb-5">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
                <CheckCircleIcon size={32} color="#10B981" />
              </View>
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Booking Created!
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                You have accepted this service request.
              </Text>
            </View>
            {createdBooking && (
              <View className="bg-gray-50 dark:bg-[#0F172A] rounded-xl p-4 mb-5">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">Booking Number</Text>
                  <Text className="text-xs font-bold text-primary-500">
                    {createdBooking.booking_number}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">Status</Text>
                  <View className="px-2 py-0.5 bg-orange-100 rounded-full">
                    <Text className="text-xs font-bold text-orange-600 capitalize">
                      {createdBooking.status}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">Booking Date</Text>
                  <Text className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatBookingDate(createdBooking.booking_date)}
                  </Text>
                </View>
              </View>
            )}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowSuccessModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-[#334155] rounded-xl items-center"
              >
                <Text className="font-semibold text-gray-600 dark:text-gray-400">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowSuccessModal(false);
                  router.replace('/(tabs)/bookings');
                }}
                className="flex-1 py-3 bg-primary-500 rounded-xl items-center"
              >
                <Text className="font-semibold text-white">Go to Bookings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View className="px-6 py-4 bg-white dark:bg-[#1E293B] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeftIcon size={24} color="#F57C1F" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Request Details
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {request.request_number}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          request.provider_response === 'pending' 
            ? 'bg-orange-100' 
            : request.provider_response === 'accepted'
            ? 'bg-green-100'
            : 'bg-red-100'
        }`}>
          <Text className={`text-xs font-bold ${
            request.provider_response === 'pending'
              ? 'text-orange-600'
              : request.provider_response === 'accepted'
              ? 'text-green-600'
              : 'text-red-600'
          }`}>
            {request.provider_response.toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-4">
          {/* Client Information */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4">
            <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
              CLIENT INFORMATION
            </Text>
            
            <View className="flex-row items-center mb-3">
              {request.client_picture ? (
                <Image 
                  source={{ uri: request.client_picture }}
                  className="w-12 h-12 rounded-full mr-3"
                />
              ) : (
                <View className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-500 font-bold text-lg">
                    {request.client_name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="font-bold text-gray-900 dark:text-white">
                  {request.client_name}
                </Text>
                {request.client_email && (
                  <View className="flex-row items-center mt-1">
                    <EnvelopeIcon size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {request.client_email}
                    </Text>
                  </View>
                )}
                {request.client_phone && (
                  <View className="flex-row items-center mt-1">
                    <PhoneIcon size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {request.client_phone}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Services */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4">
            <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
              REQUESTED SERVICES
            </Text>
            {request.services.map((service, index) => (
              <View
                key={service.id}
                className={`pb-3 ${
                  index < request.services.length - 1 ? 'border-b border-gray-100 dark:border-[#334155] mb-3' : ''
                }`}
              >
                {/* Service header */}
                <View className="flex-row items-center mb-2">
                  <View className="w-9 h-9 bg-primary-50 rounded-full items-center justify-center mr-3">
                    <Text className="text-primary-500 font-bold text-base">
                      {service.service_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text className="font-bold text-gray-900 dark:text-white flex-1" numberOfLines={2}>
                    {service.service_name}
                  </Text>
                </View>

                {/* Items */}
                {service.items && service.items.length > 0 && (
                  <View className="ml-12 bg-gray-50 dark:bg-[#0F172A] rounded-xl overflow-hidden">
                    {service.items.map((item, idx) => (
                      <View
                        key={idx}
                        className={`flex-row items-center justify-between px-3 py-2 ${
                          idx < service.items.length - 1 ? 'border-b border-gray-100 dark:border-[#1E293B]' : ''
                        }`}
                      >
                        <Text className="text-sm text-gray-700 dark:text-gray-300 flex-1" numberOfLines={1}>
                          {item.label}
                        </Text>
                        <Text className="text-sm font-semibold text-primary-500 ml-2">
                          {item.currency} {item.amount.toLocaleString()}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Description */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4">
            <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
              DESCRIPTION
            </Text>
            <Text className="text-gray-900 dark:text-white leading-6">
              {request.description}
            </Text>
          </View>

          {/* Location & Schedule */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4">
            <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
              LOCATION & SCHEDULE
            </Text>
            
            <View style={{ gap: 12 }}>
              {(request.address || request.city) ? (
                <View className="flex-row items-start">
                  <MapPinIcon size={20} color="#F57C1F" />
                  <View className="ml-3 flex-1">
                    {request.address ? (
                      <Text className="text-gray-900 dark:text-white font-medium">{request.address}</Text>
                    ) : null}
                    {request.city ? (
                      <Text className="text-sm text-gray-500 dark:text-gray-400">{request.city}</Text>
                    ) : null}
                  </View>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <MapPinIcon size={20} color="#D1D5DB" />
                  <Text className="ml-3 text-sm text-gray-400 dark:text-gray-500">No location specified</Text>
                </View>
              )}

              {request.preferred_date ? (
                <View className="flex-row items-center">
                  <CalendarIcon size={20} color="#F57C1F" />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">Preferred Date</Text>
                    <Text className="text-gray-900 dark:text-white font-medium">
                      {formatDate(request.preferred_date)}
                    </Text>
                  </View>
                </View>
              ) : null}

              {request.deadline ? (
                <View className="flex-row items-center">
                  <ClockIcon size={20} color="#F57C1F" />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">Deadline</Text>
                    <Text className="text-gray-900 dark:text-white font-medium">
                      {formatDate(request.deadline)}
                    </Text>
                  </View>
                </View>
              ) : null}

              {!request.preferred_date && !request.deadline && !request.address && !request.city && (
                <Text className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
                  No schedule or location details provided
                </Text>
              )}
            </View>
          </View>

          {/* Budget */}
          {(request.budget_min != null || request.budget_max != null) && (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4">
              <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
                BUDGET RANGE
              </Text>
              <View className="flex-row items-center">
                <CurrencyDollarIcon size={24} color="#F57C1F" />
                <View className="ml-3">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Images */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-bold text-gray-500 dark:text-gray-400">
                IMAGES
              </Text>
              {images.length > 0 && (
                <Text className="text-xs text-gray-400">{images.length} photo{images.length !== 1 ? 's' : ''}</Text>
              )}
            </View>
            {images.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row" style={{ gap: 8 }}>
                  {images.map((imageUrl, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedImage(imageUrl)}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        style={{ width: 120, height: 120, borderRadius: 12 }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View className="items-center py-6">
                <PhotoIcon size={32} color="#CBD5E1" />
                <Text className="text-sm text-gray-400 dark:text-gray-500 mt-2">No images attached</Text>
              </View>
            )}
          </View>

          {/* Additional Info */}
          {request.has_bid !== undefined && (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4">
              <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
                BIDDING STATUS
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-900 dark:text-white">
                  Total Bids
                </Text>
                <Text className="font-bold text-gray-900 dark:text-white">
                  {request.bid_count || 0}
                </Text>
              </View>
              {request.has_bid && (
                <View className="mt-2 px-3 py-2 bg-green-50 rounded-lg">
                  <Text className="text-green-600 text-sm font-medium">
                    You have submitted a bid for this request
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons - Only show if pending */}
      {isPending && (
        <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={handleAcceptRequest}
              disabled={isSubmitting}
              className="flex-1 bg-primary-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <CheckCircleIcon size={20} color="#FFFFFF" />
                  <Text className="text-white font-bold ml-2 text-base">Accept Request</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRejectRequest}
              disabled={isSubmitting}
              className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-4 rounded-xl flex-row items-center justify-center"
            >
              <XCircleIcon size={20} color="#6B7280" />
              <Text className="font-bold ml-2 text-gray-600 dark:text-gray-400 text-base">
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
