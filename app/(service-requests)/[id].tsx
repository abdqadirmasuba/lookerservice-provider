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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { apiRequests } from '@/src/utils/apiRequest';
import { showErrorAlert } from '@/src/utils/alerts';
import { ServiceRequest } from '@/src/types/serviceRequest';
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
  const [request, setRequest] = useState<ServiceRequest | null>(null);
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
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this service request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: confirmRejectRequest,
        },
      ]
    );
  };

  const confirmRejectRequest = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiRequests.post(
        `/provider/${activeBusinessId}/service-requests/${id}/reject`
      );
      if (response.data.success) {
        Alert.alert('Success', 'Service request rejected', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
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

  const formatCurrency = (amount: number) => {
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

  const parseImages = (imagesString: string): string[] => {
    try {
      // The images field appears to be a base64 encoded JSON array
      const decoded = atob(imagesString);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error parsing images:', error);
      return [];
    }
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

  const images = request.images ? parseImages(request.images) : [];
  const isPending = request.provider_response.provider_response_type === 'pending';

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

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
          request.provider_response.provider_response_type === 'pending' 
            ? 'bg-orange-100' 
            : request.provider_response.provider_response_type === 'accepted'
            ? 'bg-green-100'
            : 'bg-red-100'
        }`}>
          <Text className={`text-xs font-bold ${
            request.provider_response.provider_response_type === 'pending'
              ? 'text-orange-600'
              : request.provider_response.provider_response_type === 'accepted'
              ? 'text-green-600'
              : 'text-red-600'
          }`}>
            {request.provider_response.provider_response_type.toUpperCase()}
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
                className={`flex-row items-center py-3 ${
                  index < request.services.length - 1 ? 'border-b border-gray-200 dark:border-[#334155]' : ''
                }`}
              >
                {service.service_icon ? (
                  <Image 
                    source={{ uri: service.service_icon }}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <View className="w-10 h-10 bg-primary-50 rounded-full items-center justify-center mr-3">
                    <Text className="text-primary-500 font-bold">
                      {service.service_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="font-bold text-gray-900 dark:text-white">
                    {service.service_name}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {service.category_name}
                  </Text>
                </View>
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
            
            <View className="space-y-3">
              <View className="flex-row items-start">
                <MapPinIcon size={20} color="#F57C1F" />
                <View className="ml-3 flex-1">
                  <Text className="text-gray-900 dark:text-white font-medium">
                    {request.address}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {request.city}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <CalendarIcon size={20} color="#F57C1F" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Preferred Date
                  </Text>
                  <Text className="text-gray-900 dark:text-white font-medium">
                    {formatDate(request.preferred_date)}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <ClockIcon size={20} color="#F57C1F" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Deadline
                  </Text>
                  <Text className="text-gray-900 dark:text-white font-medium">
                    {formatDate(request.deadline)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Budget */}
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

          {/* Images */}
          {images.length > 0 && (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-4">
              <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
                IMAGES
              </Text>
              <View className="flex-row flex-wrap">
                {images.map((imageUrl, index) => (
                  <View key={index} className="w-1/3 p-1">
                    <Image 
                      source={{ uri: imageUrl }}
                      className="w-full h-24 rounded-lg"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

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
