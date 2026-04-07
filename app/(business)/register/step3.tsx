// File: app/(business)/register/step3.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  CameraIcon,
  CloudArrowUpIcon,
} from 'react-native-heroicons/outline';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { setBusinessPhotos } from '@/src/store/slices/businessRegistrationSlice';
import { RootState } from '@/src/store';
import { uploadBusinessPhoto } from '@/src/utils/business';

export default function BusinessStep3Screen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const reg = useSelector((state: RootState) => state.businessRegistration);

  // Photos are server URLs after upload
  const [photos, setPhotos] = useState<string[]>(reg.business_photos);
  // Track which indices are currently uploading
  const [uploading, setUploading] = useState<boolean>(false);

  const uploadAndAdd = async (localUri: string) => {
    if (photos.length >= 10) {
      Alert.alert('Limit Reached', 'You can only add up to 10 photos');
      return;
    }
    setUploading(true);
    try {
      const result = await uploadBusinessPhoto(localUri);
      // Server returns { url: '...' } or { data: { url: '...' } }
      const url: string = result?.url ?? result?.data?.url ?? result;
      if (!url || typeof url !== 'string') throw new Error('Invalid upload response');
      const updated = [...photos, url];
      setPhotos(updated);
      dispatch(setBusinessPhotos(updated));
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message || 'Could not upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant access to your photo library');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAndAdd(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant access to your camera');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAndAdd(result.assets[0].uri);
    }
  };

  const showImagePickerOptions = () => {
    if (uploading) return;
    Alert.alert('Add Photo', 'Choose photo source', [
      { text: 'Camera', onPress: handleTakePhoto },
      { text: 'Gallery', onPress: handlePickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    dispatch(setBusinessPhotos(updated));
  };

  const handleNext = () => {
    if (photos.length === 0) {
      Alert.alert(
        'No Photos',
        'Adding photos helps clients trust your business. Skip for now?',
        [
          { text: 'Add Photos', onPress: showImagePickerOptions },
          {
            text: 'Skip',
            onPress: () => router.push('/(business)/register/step4'),
            style: 'cancel',
          },
        ]
      );
      return;
    }
    router.push('/(business)/register/step4');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeftIcon size={24} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Register Business
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Step 3 of 5
            </Text>
          </View>
        </View>
        <View className="h-2 bg-gray-200 dark:bg-[#334155] rounded-full overflow-hidden">
          <View className="h-full w-[60%] bg-primary-500 rounded-full" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6">
          {/* Step Icon */}
          <View className="items-center mb-6">
            <LinearGradient
              colors={['#F57C1F', '#E06A0F']}
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
            >
              <PhotoIcon size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Business Photos
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-400 px-8">
              Add photos to showcase your business (optional)
            </Text>
          </View>

          {/* Upload Status Banner */}
          {uploading && (
            <View className="flex-row items-center bg-primary-50 dark:bg-primary-900/20 border border-primary-300 dark:border-primary-700 rounded-xl p-3 mb-4">
              <ActivityIndicator size="small" color="#F57C1F" />
              <Text className="ml-3 text-primary-700 dark:text-primary-400 text-sm font-medium">
                Uploading photo to server...
              </Text>
            </View>
          )}

          {/* Photo Grid */}
          <View className="flex-row flex-wrap -mx-2 mb-6">
            {/* Add Photo Button */}
            <View className="w-1/2 p-2">
              <TouchableOpacity
                onPress={showImagePickerOptions}
                disabled={photos.length >= 10 || uploading}
                className={`aspect-square bg-white dark:bg-[#1E293B] border-2 border-dashed rounded-2xl items-center justify-center ${
                  photos.length >= 10 || uploading
                    ? 'border-gray-200 dark:border-[#334155]'
                    : 'border-primary-300 dark:border-primary-700'
                }`}
              >
                <View className="items-center">
                  <View className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center mb-2">
                    {uploading ? (
                      <CloudArrowUpIcon size={28} color="#F57C1F" />
                    ) : (
                      <CameraIcon size={28} color="#F57C1F" />
                    )}
                  </View>
                  <Text className="text-gray-600 dark:text-gray-400 font-semibold text-sm">
                    {uploading ? 'Uploading…' : 'Add Photo'}
                  </Text>
                  <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    {photos.length}/10
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Uploaded Photos */}
            {photos.map((photo, index) => (
              <View key={index} className="w-1/2 p-2">
                <View className="aspect-square rounded-2xl overflow-hidden relative">
                  <Image
                    source={{ uri: photo }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full items-center justify-center"
                  >
                    <XMarkIcon size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  {index === 0 && (
                    <View className="absolute bottom-2 left-2 bg-primary-500 px-2 py-1 rounded-lg">
                      <Text className="text-white text-xs font-bold">Primary</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Guidelines */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mb-4">
            <Text className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-2">
              📸 Photo Guidelines
            </Text>
            <View className="space-y-1">
              <Text className="text-blue-600 dark:text-blue-300 text-xs">
                • Photos are uploaded directly to secure cloud storage
              </Text>
              <Text className="text-blue-600 dark:text-blue-300 text-xs">
                • Show your workspace, equipment, or completed projects
              </Text>
              <Text className="text-blue-600 dark:text-blue-300 text-xs">
                • First photo will be your primary business photo
              </Text>
              <Text className="text-blue-600 dark:text-blue-300 text-xs">
                • Maximum 10 photos allowed
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-4 rounded-xl items-center"
          >
            <Text className="text-gray-700 dark:text-gray-300 font-bold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={uploading}
            className="flex-1 bg-primary-500 py-4 rounded-xl items-center"
            style={{ opacity: uploading ? 0.6 : 1 }}
          >
            <Text className="text-white font-bold">Next: Groups</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}