// File: app/(business)/[id]/view-service.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  TagIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';
import { useCustomAlert } from '@/src/components/common/CustomAlert';
import { apiRequests } from '@/src/utils/apiRequest';
import { getProviderServiceDetail, updateServiceItems } from '@/src/utils/business';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceItem {
  label: string;
  amount?: number;
  currency?: string;
  image_urls: string[];
}

interface ServiceDetail {
  id: string;
  service_id: string;
  service_list: ServiceItem[];
  status: string;
  service_name: string;
  category_name: string;
}

interface LocalImage {
  uri: string;
  contentType: string;
  fileName: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const presignServiceImage = async (params: {
  file_name: string;
  content_type: string;
  reference_id: string;
  name: string;
}): Promise<{ uploadUrl: string; publicUrl: string }> => {
  const res = await apiRequests.post('/provider/uploads/presign', {
    ...params,
    upload_type: 'service_image',
  });
  const payload = res.data?.data ?? res.data;
  return {
    uploadUrl: payload.upload_url as string,
    publicUrl: payload.public_url as string,
  };
};

const uploadImageToS3 = async (
  uploadUrl: string,
  fileUri: string,
  contentType: string,
): Promise<void> => {
  const imageRes = await fetch(fileUri);
  const blob = await imageRes.blob();
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });
  if (!response.ok) {
    throw new Error(`Image upload failed (status ${response.status})`);
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ViewServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const serviceId = params.service_id as string;

  const { showAlert, AlertComponent } = useCustomAlert();

  // ── Detail state ─────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ServiceDetail | null>(null);

  // ── Toast ─────────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = (message: string, success: boolean) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, success });
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToast(null));
  };

  // ── Edit modal state ──────────────────────────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCurrency, setFormCurrency] = useState<'UGX' | 'USD'>('UGX');
  const [newImages, setNewImages] = useState<LocalImage[]>([]);
  const [removingUrl, setRemovingUrl] = useState<string | null>(null);
  const [savingItem, setSavingItem] = useState(false);

  // ── Derived ───────────────────────────────────────────────────────────────────
  const priceEntered = formPrice.trim() !== '';
  const currentItem =
    editingIndex !== null && detail ? detail.service_list[editingIndex] : null;
  const existingImageCount = currentItem?.image_urls.length ?? 0;
  const canAddMore = existingImageCount + newImages.length < 3;

  // ── Fetch detail ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchDetail();
  }, [serviceId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getProviderServiceDetail(businessId, serviceId);
      // Normalize: ensure every item always has an image_urls array
      const raw = res.data as ServiceDetail;
      const normalized: ServiceDetail = {
        ...raw,
        service_list: (raw.service_list ?? []).map((item) => ({
          ...item,
          image_urls: item.image_urls ?? [],
        })),
      };
      setDetail(normalized);
    } catch (err: any) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to load service details',
        buttons: [{ text: 'OK', style: 'default', onPress: () => router.back() }],
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Open / close edit modal ───────────────────────────────────────────────────
  const openEditModal = (index: number) => {
    if (!detail) return;
    const item = detail.service_list[index];
    setEditingIndex(index);
    setFormLabel(item.label);
    setFormPrice(item.amount !== undefined ? item.amount.toString() : '');
    setFormCurrency((item.currency as 'UGX' | 'USD') ?? 'UGX');
    setNewImages([]);
    setRemovingUrl(null);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingIndex(null);
    setNewImages([]);
    setRemovingUrl(null);
  };

  // ── Remove existing image (immediate PATCH) ───────────────────────────────────
  const handleRemoveExistingImage = async (url: string) => {
    if (!detail || editingIndex === null) return;
    setRemovingUrl(url);
    try {
      const updatedList: ServiceItem[] = detail.service_list.map((item, i) =>
        i === editingIndex
          ? { ...item, image_urls: item.image_urls.filter((u) => u !== url) }
          : item,
      );
      await updateServiceItems(businessId, serviceId, updatedList);
      setDetail((prev) => (prev ? { ...prev, service_list: updatedList } : prev));
      showToast('Image removed', true);
    } catch (err: any) {
      showToast('Failed to remove image', false);
    } finally {
      setRemovingUrl(null);
    }
  };

  // ── Pick new local image ──────────────────────────────────────────────────────
  const handlePickImage = async () => {
    if (!canAddMore) {
      showToast('Maximum 3 images per item', false);
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showAlert({
        type: 'warning',
        title: 'Permission Required',
        message: 'Please allow access to your photo library.',
        buttons: [{ text: 'OK', style: 'default' }],
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setNewImages((prev) => [
      ...prev,
      {
        uri: asset.uri,
        contentType: asset.mimeType ?? 'image/jpeg',
        fileName: asset.fileName ?? `item_${Date.now()}.jpg`,
      },
    ]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Save item edits ───────────────────────────────────────────────────────────
  const handleSaveItem = async () => {
    if (!detail || editingIndex === null) return;
    if (!formLabel.trim()) {
      showAlert({
        type: 'warning',
        title: 'Label Required',
        message: 'Please enter a name or label for this item.',
        buttons: [{ text: 'OK', style: 'default' }],
      });
      return;
    }
    if (priceEntered && isNaN(parseFloat(formPrice))) {
      showAlert({
        type: 'warning',
        title: 'Invalid Price',
        message: 'Please enter a valid numeric price.',
        buttons: [{ text: 'OK', style: 'default' }],
      });
      return;
    }

    setSavingItem(true);
    try {
      // Upload new local images first
      const uploadedUrls: string[] = [];
      for (const img of newImages) {
        const { uploadUrl, publicUrl } = await presignServiceImage({
          file_name: img.fileName,
          content_type: img.contentType,
          reference_id: detail.service_name,
          name: formLabel.trim(),
        });
        await uploadImageToS3(uploadUrl, img.uri, img.contentType);
        uploadedUrls.push(publicUrl);
      }

      // Merge existing server URLs (already updated by any previous remove ops) + new
      const existingUrls = detail.service_list[editingIndex].image_urls;
      const updatedItem: ServiceItem = {
        label: formLabel.trim(),
        amount: priceEntered ? parseFloat(formPrice) : undefined,
        currency: priceEntered ? formCurrency : undefined,
        image_urls: [...existingUrls, ...uploadedUrls],
      };

      const updatedList = detail.service_list.map((item, i) =>
        i === editingIndex ? updatedItem : item,
      );

      await updateServiceItems(businessId, serviceId, updatedList);
      setDetail((prev) => (prev ? { ...prev, service_list: updatedList } : prev));
      closeEditModal();
      showToast('Item updated successfully', true);
    } catch (err: any) {
      showToast(err.message || 'Failed to update item', false);
    } finally {
      setSavingItem(false);
    }
  };

  // ── Status helpers ────────────────────────────────────────────────────────────
  const statusBg =
    detail?.status === 'active'
      ? 'bg-green-100 dark:bg-green-900/20'
      : detail?.status === 'hidden'
      ? 'bg-gray-100 dark:bg-gray-800'
      : 'bg-red-100 dark:bg-red-900/20';

  const statusTextClass =
    detail?.status === 'active'
      ? 'text-green-600 dark:text-green-400'
      : detail?.status === 'hidden'
      ? 'text-gray-600 dark:text-gray-400'
      : 'text-red-600 dark:text-red-400';

  const statusLabel =
    detail?.status === 'active'
      ? 'Active'
      : detail?.status === 'hidden'
      ? 'Hidden'
      : 'Down';

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View className="px-5 pt-5 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3" hitSlop={8}>
            <ArrowLeftIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text
              className="text-xl font-bold text-gray-900 dark:text-white"
              numberOfLines={1}
            >
              {loading ? 'Service Details' : (detail?.service_name ?? 'Service Details')}
            </Text>
            {detail ? (
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {detail.category_name}
              </Text>
            ) : null}
          </View>
          {detail ? (
            <View className={`px-3 py-1.5 rounded-full ${statusBg}`}>
              <Text className={`text-xs font-bold ${statusTextClass}`}>{statusLabel}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* ── Loading ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F57C1F" />
          <Text className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
            Loading details…
          </Text>
        </View>
      ) : !detail ? null : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          {/* ── Info card ─────────────────────────────────────────────────── */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-[#334155] mb-5">
            <View className="flex-row flex-wrap items-center" style={{ gap: 8 }}>
              <View className="bg-secondary-50 dark:bg-secondary-500/20 px-3 py-1.5 rounded-full">
                <Text className="text-xs font-semibold text-secondary-600 dark:text-secondary-400">
                  {detail.category_name}
                </Text>
              </View>
              <View className={`px-3 py-1.5 rounded-full ${statusBg}`}>
                <Text className={`text-xs font-bold ${statusTextClass}`}>{statusLabel}</Text>
              </View>
            </View>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {detail.service_list.length} item
              {detail.service_list.length !== 1 ? 's' : ''} listed under this service
            </Text>
          </View>

          {/* ── Items ─────────────────────────────────────────────────────── */}
          <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
            Service Items
          </Text>

          {detail.service_list.length === 0 ? (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 items-center border border-gray-100 dark:border-[#334155]">
              <TagIcon size={40} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 mt-3 text-sm text-center">
                No items listed yet.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {detail.service_list.map((item, index) => (
                <View
                  key={index}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-[#334155]"
                >
                  {/* Item header */}
                  <View className="flex-row items-start">
                    <View className="flex-1 mr-3">
                      <Text className="text-base font-bold text-gray-900 dark:text-white">
                        {item.label}
                      </Text>
                      {item.amount !== undefined ? (
                        <Text className="text-sm text-primary-500 font-semibold mt-0.5">
                          {item.currency}{' '}
                          {item.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      ) : (
                        <Text className="text-sm text-gray-400 mt-0.5">Negotiable</Text>
                      )}
                    </View>

                    {/* Edit button */}
                    <TouchableOpacity
                      onPress={() => openEditModal(index)}
                      className="bg-secondary-50 dark:bg-secondary-500/20 px-3 py-2 rounded-xl flex-row items-center"
                      style={{ gap: 4 }}
                      activeOpacity={0.8}
                    >
                      <PencilIcon size={14} color="#2DA9E9" />
                      <Text className="text-secondary-600 dark:text-secondary-400 font-semibold text-sm">
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Image thumbnails */}
                  {item.image_urls.length > 0 && (
                    <View className="flex-row mt-3" style={{ gap: 6 }}>
                      {item.image_urls.map((url, imgIdx) => (
                        <Image
                          key={imgIdx}
                          source={{ uri: url }}
                          style={{ width: 72, height: 72, borderRadius: 10 }}
                          resizeMode="cover"
                        />
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* ── Edit Item Modal ──────────────────────────────────────────────────── */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditModal}
      >
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
          {/* Modal header */}
          <View className="px-5 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  Edit Item
                </Text>
                {detail && editingIndex !== null && (
                  <Text className="text-sm text-gray-400 mt-0.5">
                    Item {editingIndex + 1} of {detail.service_list.length} ·{' '}
                    {detail.service_name}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={closeEditModal} hitSlop={8}>
                <XMarkIcon size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            >
              {/* Label */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Item Name / Label <Text className="text-primary-500">*</Text>
                </Text>
                <TextInput
                  placeholder="e.g. Basic Wash, Deep Clean…"
                  placeholderTextColor="#9CA3AF"
                  value={formLabel}
                  onChangeText={setFormLabel}
                  returnKeyType="next"
                  className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                />
              </View>

              {/* Price */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Price{' '}
                  <Text className="text-gray-400 font-normal">(Optional)</Text>
                </Text>
                <TextInput
                  placeholder="e.g. 25000"
                  placeholderTextColor="#9CA3AF"
                  value={formPrice}
                  onChangeText={setFormPrice}
                  keyboardType="numeric"
                  returnKeyType="done"
                  className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                />
              </View>

              {/* Currency — only when price is entered */}
              {priceEntered && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Currency <Text className="text-primary-500">*</Text>
                  </Text>
                  <View className="flex-row" style={{ gap: 10 }}>
                    {(['UGX', 'USD'] as const).map((c) => (
                      <TouchableOpacity
                        key={c}
                        onPress={() => setFormCurrency(c)}
                        className={`flex-1 py-3 rounded-xl border ${
                          formCurrency === c
                            ? 'bg-primary-500 border-primary-500'
                            : 'bg-white dark:bg-[#0F172A] border-gray-200 dark:border-[#334155]'
                        }`}
                      >
                        <Text
                          className={`text-center font-bold ${
                            formCurrency === c
                              ? 'text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {c}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Images */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Photos{' '}
                    <Text className="text-gray-400 font-normal">(max 3)</Text>
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {existingImageCount + newImages.length} / 3
                  </Text>
                </View>

                <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                  {/* Existing remote images (with immediate-remove X) */}
                  {currentItem?.image_urls.map((url, imgIdx) => (
                    <View key={`existing-${imgIdx}`} style={{ position: 'relative' }}>
                      <Image
                        source={{ uri: url }}
                        style={{ width: 90, height: 90, borderRadius: 12 }}
                        resizeMode="cover"
                      />
                      {removingUrl === url ? (
                        /* Loading overlay while removing */
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 12,
                            backgroundColor: 'rgba(0,0,0,0.45)',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleRemoveExistingImage(url)}
                          disabled={removingUrl !== null}
                          style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: '#EF4444',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          hitSlop={4}
                        >
                          <XMarkIcon size={12} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                  {/* Newly picked local images (upload happens on Save) */}
                  {newImages.map((img, idx) => (
                    <View key={`new-${idx}`} style={{ position: 'relative' }}>
                      <Image
                        source={{ uri: img.uri }}
                        style={{ width: 90, height: 90, borderRadius: 12 }}
                        resizeMode="cover"
                      />
                      {/* Orange "NEW" badge */}
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          backgroundColor: '#F57C1F',
                          borderRadius: 4,
                          paddingHorizontal: 4,
                          paddingVertical: 1,
                        }}
                      >
                        <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>
                          NEW
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveNewImage(idx)}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: '#4B5563',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        hitSlop={4}
                      >
                        <XMarkIcon size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Add Photo button */}
                  {canAddMore && (
                    <TouchableOpacity
                      onPress={handlePickImage}
                      style={{ width: 90, height: 90 }}
                      className="rounded-xl bg-gray-100 dark:bg-[#0F172A] border-2 border-dashed border-gray-300 dark:border-[#334155] items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <PhotoIcon size={26} color="#9CA3AF" />
                      <Text className="text-xs text-gray-400 mt-1">Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Save button */}
              <TouchableOpacity
                onPress={handleSaveItem}
                disabled={savingItem || removingUrl !== null}
                className={`py-4 rounded-xl items-center ${
                  savingItem || removingUrl !== null
                    ? 'bg-gray-300 dark:bg-gray-700'
                    : 'bg-primary-500'
                }`}
                activeOpacity={0.85}
              >
                {savingItem ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-base">Save Changes</Text>
                )}
              </TouchableOpacity>

              {removingUrl !== null && (
                <Text className="text-center text-sm text-gray-400 mt-2">
                  Removing image, please wait…
                </Text>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* ── Toast overlay ────────────────────────────────────────────────────── */}
      {toast !== null && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 40,
              left: 16,
              right: 16,
              opacity: toastOpacity,
            },
          ]}
          pointerEvents="none"
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 16,
              backgroundColor: toast.success ? '#10B981' : '#EF4444',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 8,
              gap: 10,
            }}
          >
            {toast.success ? (
              <CheckCircleIcon size={20} color="#FFFFFF" />
            ) : (
              <XCircleIcon size={20} color="#FFFFFF" />
            )}
            <Text style={{ color: '#fff', fontWeight: '600', flex: 1, fontSize: 14 }}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}

      {AlertComponent}
    </SafeAreaView>
  );
}
