// File: app/(business)/[id]/register-service.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  ListBulletIcon,
} from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { useCustomAlert } from '@/src/components/common/CustomAlert';
import { apiRequests } from '@/src/utils/apiRequest';
import { registerServiceItems } from '@/src/utils/business';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocalImage {
  uri: string;
  contentType: string;
  fileName: string;
}

interface ServiceItem {
  label: string;
  amount?: number;
  currency?: string;
  images: LocalImage[];
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

export default function RegisterServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const serviceId = params.service_id as string;
  const serviceName = decodeURIComponent((params.service_name as string) ?? '');

  const { showAlert, AlertComponent } = useCustomAlert();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [formLabel, setFormLabel] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCurrency, setFormCurrency] = useState<'UGX' | 'USD'>('UGX');
  const [formImages, setFormImages] = useState<LocalImage[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // ── Items list ───────────────────────────────────────────────────────────────
  const [items, setItems] = useState<ServiceItem[]>([]);

  // ── Submission state ─────────────────────────────────────────────────────────
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // ── Derived ──────────────────────────────────────────────────────────────────
  const formHasContent =
    formLabel.trim() !== '' || formPrice.trim() !== '' || formImages.length > 0;
  const priceEntered = formPrice.trim() !== '';

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormLabel('');
    setFormPrice('');
    setFormCurrency('UGX');
    setFormImages([]);
    setEditingIndex(null);
  };

  const handlePickImage = async () => {
    if (formImages.length >= 3) {
      showAlert({
        type: 'warning',
        title: 'Limit Reached',
        message: 'You can add up to 3 images per item.',
        buttons: [{ text: 'OK', style: 'default' }],
      });
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showAlert({
        type: 'warning',
        title: 'Permission Required',
        message: 'Please allow access to your photo library to add images.',
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
    const newImage: LocalImage = {
      uri: asset.uri,
      contentType: asset.mimeType ?? 'image/jpeg',
      fileName: asset.fileName ?? `item_${Date.now()}.jpg`,
    };
    setFormImages((prev) => [...prev, newImage]);
  };

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
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

    const newItem: ServiceItem = {
      label: formLabel.trim(),
      amount: priceEntered ? parseFloat(formPrice) : undefined,
      currency: priceEntered ? formCurrency : undefined,
      images: formImages,
    };

    if (editingIndex !== null) {
      setItems((prev) => prev.map((item, i) => (i === editingIndex ? newItem : item)));
    } else {
      setItems((prev) => [...prev, newItem]);
    }

    resetForm();
  };

  const handleEditItem = (index: number) => {
    const item = items[index];
    setFormLabel(item.label);
    setFormPrice(item.amount !== undefined ? item.amount.toString() : '');
    setFormCurrency((item.currency as 'UGX' | 'USD') ?? 'UGX');
    setFormImages(item.images);
    setEditingIndex(index);
  };

  const handleDeleteItem = (index: number) => {
    showAlert({
      type: 'warning',
      title: 'Remove Item',
      message: 'Remove this item from the list?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setItems((prev) => prev.filter((_, i) => i !== index)),
        },
      ],
    });
  };

  const handleSave = () => {
    if (formHasContent) {
      showAlert({
        type: 'warning',
        title: 'Unsaved Item',
        message:
          'The information currently in the form will be discarded if you continue. Proceed without saving it?',
        buttons: [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            style: 'default',
            onPress: () => setShowConfirm(true),
          },
        ],
      });
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    try {
      const serviceList: Array<{
        label: string;
        amount?: number;
        currency?: string;
        image_urls: string[];
      }> = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const imageUrls: string[] = [];

        if (item.images.length > 0) {
          setUploadStatus(
            `Uploading images for "${item.label}" (${i + 1}/${items.length})…`,
          );

          for (const img of item.images) {
            const { uploadUrl, publicUrl } = await presignServiceImage({
              file_name: img.fileName,
              content_type: img.contentType,
              reference_id: serviceName,
              name: item.label,
            });
            await uploadImageToS3(uploadUrl, img.uri, img.contentType);
            imageUrls.push(publicUrl);
          }
        }

        serviceList.push({
          label: item.label,
          amount: item.amount,
          currency: item.currency,
          image_urls: imageUrls,
        });
      }

      setUploadStatus('Saving service items…');
      await registerServiceItems(businessId, serviceId, serviceList);

      showAlert({
        type: 'success',
        title: 'Service Registered!',
        message: `${items.length} item${items.length !== 1 ? 's' : ''} have been successfully registered under "${serviceName}".`,
        buttons: [
          {
            text: 'Done',
            style: 'default',
            onPress: () => router.back(),
          },
        ],
      });
    } catch (err: any) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to register service items. Please try again.',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    } finally {
      setSubmitting(false);
      setUploadStatus('');
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-5 pt-5 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3" hitSlop={8}>
            <ArrowLeftIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-white" numberOfLines={1}>
              {serviceName}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              List the items / activities you offer
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* ── Instruction Banner ─────────────────────────────────────────── */}
          <View className="mx-4 mt-4 bg-secondary-50 dark:bg-secondary-500/10 rounded-2xl px-4 py-3 flex-row items-start">
            <ListBulletIcon size={18} color="#2DA9E9" style={{ marginTop: 1 }} />
            <Text className="text-secondary-700 dark:text-secondary-400 text-sm ml-2 flex-1 leading-5">
              Fill in the form below for each item, activity, or product you offer under this
              service. Add it to the list, then tap{' '}
              <Text className="font-bold">Save</Text> when done.
            </Text>
          </View>

          {/* ── Form Card ──────────────────────────────────────────────────── */}
          <View className="mx-4 mt-4 bg-white dark:bg-[#1E293B] rounded-2xl p-5 border border-gray-100 dark:border-[#334155]">
            <Text className="text-base font-bold text-gray-900 dark:text-white mb-4">
              {editingIndex !== null ? `Editing Item #${editingIndex + 1}` : 'New Item'}
            </Text>

            {/* Label */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Item Name / Label{' '}
                <Text className="text-primary-500">*</Text>
              </Text>
              <TextInput
                placeholder="a unit of service/package you provide"
                placeholderTextColor="#9CA3AF"
                value={formLabel}
                onChangeText={setFormLabel}
                returnKeyType="next"
                className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
              />
            </View>

            {/* Price (optional) */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Price{' '}
                <Text className="text-gray-400 font-normal">(Optional — leave empty if negotiable)</Text>
              </Text>
              <TextInput
                placeholder="amount"
                placeholderTextColor="#9CA3AF"
                value={formPrice}
                onChangeText={setFormPrice}
                keyboardType="numeric"
                returnKeyType="done"
                className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
              />
            </View>

            {/* Currency — only shown when price is entered */}
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
                          : 'bg-gray-50 dark:bg-[#0F172A] border-gray-200 dark:border-[#334155]'
                      }`}
                    >
                      <Text
                        className={`text-center font-bold ${
                          formCurrency === c ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Images (up to 3) */}
            <View className="mb-5">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Photos{' '}
                  <Text className="text-gray-400 font-normal">(Optional, max 3)</Text>
                </Text>
                <Text className="text-xs text-gray-400">{formImages.length} / 3</Text>
              </View>

              <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                {formImages.map((img, idx) => (
                  <View key={idx} className="relative">
                    <Image
                      source={{ uri: img.uri }}
                      style={{ width: 90, height: 90, borderRadius: 12 }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                      hitSlop={4}
                    >
                      <XMarkIcon size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}

                {formImages.length < 3 && (
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

            {/* Add / Update Button */}
            <TouchableOpacity
              onPress={handleAddItem}
              className="bg-primary-500 py-4 rounded-xl flex-row items-center justify-center"
              style={{ gap: 8 }}
              activeOpacity={0.85}
            >
              <PlusIcon size={20} color="#FFFFFF" />
              <Text className="text-white font-bold text-base">
                {editingIndex !== null ? 'Update Item' : 'Add to List'}
              </Text>
            </TouchableOpacity>

            {editingIndex !== null && (
              <TouchableOpacity onPress={resetForm} className="mt-3 py-2 items-center">
                <Text className="text-gray-500 dark:text-gray-400 font-semibold text-sm">
                  Cancel Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Items List ─────────────────────────────────────────────────── */}
          {items.length > 0 && (
            <View className="mx-4 mt-6">
              <Text className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">
                Items Added ({items.length})
              </Text>

              <View style={{ gap: 10 }}>
                {items.map((item, index) => (
                  <View
                    key={index}
                    className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-[#334155]"
                  >
                    {/* Top row: info + actions */}
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
                        {item.images.length > 0 && (
                          <Text className="text-xs text-gray-400 mt-1">
                            {item.images.length} photo{item.images.length > 1 ? 's' : ''}
                          </Text>
                        )}
                      </View>

                      {/* Edit / Delete */}
                      <View className="flex-row" style={{ gap: 8 }}>
                        <TouchableOpacity
                          onPress={() => handleEditItem(index)}
                          className="w-9 h-9 bg-secondary-50 dark:bg-secondary-500/20 rounded-full items-center justify-center"
                          hitSlop={4}
                        >
                          <PencilIcon size={16} color="#2DA9E9" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteItem(index)}
                          className="w-9 h-9 bg-red-50 dark:bg-red-900/20 rounded-full items-center justify-center"
                          hitSlop={4}
                        >
                          <TrashIcon size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Image thumbnails */}
                    {item.images.length > 0 && (
                      <View className="flex-row mt-3" style={{ gap: 6 }}>
                        {item.images.map((img, imgIdx) => (
                          <Image
                            key={imgIdx}
                            source={{ uri: img.uri }}
                            style={{ width: 64, height: 64, borderRadius: 10 }}
                            resizeMode="cover"
                          />
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Save Button (floating footer) ──────────────────────────────────── */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-white dark:bg-[#1E293B] border-t border-gray-100 dark:border-[#334155]">
        <TouchableOpacity
          onPress={handleSave}
          disabled={submitting}
          className="bg-primary-500 py-4 rounded-2xl items-center justify-center"
          style={{ minHeight: 54 }}
          activeOpacity={0.85}
        >
          {submitting ? (
            <View className="items-center" style={{ gap: 4 }}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              {uploadStatus ? (
                <Text className="text-white text-xs">{uploadStatus}</Text>
              ) : null}
            </View>
          ) : (
            <Text className="text-white font-bold text-base">
              {items.length > 0
                ? `Save  ·  ${items.length} item${items.length > 1 ? 's' : ''}`
                : 'Save'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Confirm Save Modal ─────────────────────────────────────────────── */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
          <View className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 w-full max-w-sm">
            <View className="w-16 h-16 bg-primary-50 dark:bg-primary-500/20 rounded-full items-center justify-center mb-4 self-center">
              <CheckCircleIcon size={36} color="#F57C1F" />
            </View>

            <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Confirm & Save
            </Text>

            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6 leading-5">
              You are adding{' '}
              <Text className="font-bold text-gray-900 dark:text-white">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </Text>{' '}
              to{' '}
              <Text className="font-bold text-gray-900 dark:text-white">
                "{serviceName}"
              </Text>
              {'. '}
              {items.some((i) => i.images.length > 0) &&
                ' '}
            </Text>

            <View className="flex-row" style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#0F172A] items-center"
              >
                <Text className="font-semibold text-gray-700 dark:text-gray-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmSubmit}
                className="flex-1 py-3 rounded-xl bg-primary-500 items-center"
              >
                <Text className="font-semibold text-white">Yes, Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {AlertComponent}
    </SafeAreaView>
  );
}
