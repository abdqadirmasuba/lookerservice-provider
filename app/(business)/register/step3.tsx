// File: app/(business)/register/step3.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
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
} from 'react-native-heroicons/outline';

export default function BusinessStep3Screen() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePickImage = () => {
    Alert.alert(
      'Add Photo',
      'Choose photo source',
      [
        {
          text: 'Camera',
          onPress: () => {
            // TODO: Open camera
            Alert.alert('Camera', 'Camera will open here');
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            // TODO: Open gallery
            const mockPhoto = `https://picsum.photos/400/300?random=${Date.now()}`;
            setPhotos([...photos, mockPhoto]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleNext = () => {
    if (photos.length === 0) {
      Alert.alert(
        'Add Photos',
        'Please add at least one photo of your business',
        [
          { text: 'Skip', onPress: () => router.push('/(business)/register/step4') },
          { text: 'Add Photo', onPress: handlePickImage },
        ]
      );
      return;
    }

    router.push('/(business)/register/step4');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={handleBack} className="mr-4">
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

        {/* Progress Bar */}
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
              Add photos to showcase your business
            </Text>
          </View>

          {/* Photo Grid */}
          <View className="flex-row flex-wrap -mx-2 mb-6">
            {/* Add Photo Button */}
            <View className="w-1/2 p-2">
              <TouchableOpacity
                onPress={handlePickImage}
                className="aspect-square bg-white dark:bg-[#1E293B] border-2 border-dashed border-gray-300 dark:border-[#334155] rounded-2xl items-center justify-center"
              >
                <View className="items-center">
                  <View className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-full items-center justify-center mb-2">
                    <CameraIcon size={28} color="#F57C1F" />
                  </View>
                  <Text className="text-gray-600 dark:text-gray-400 font-semibold text-sm">
                    Add Photo
                  </Text>
                  <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    {photos.length}/10
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Existing Photos */}
            {photos.map((photo, index) => (
              <View key={index} className="w-1/2 p-2">
                <View className="aspect-square rounded-2xl overflow-hidden relative">
                  <Image
                    source={{ uri: photo }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {/* Remove Button */}
                  <TouchableOpacity
                    onPress={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full items-center justify-center"
                  >
                    <XMarkIcon size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  {/* Primary Badge */}
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
                • Use clear, well-lit photos
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

          {/* Photo Tips */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-200 dark:border-[#334155]">
            <Text className="text-gray-900 dark:text-white font-bold mb-3">
              What makes a good photo?
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <Text className="text-green-500 mr-2">✓</Text>
                <Text className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                  Professional-looking images that represent your work
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-green-500 mr-2">✓</Text>
                <Text className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                  Before/after shots of your projects
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-green-500 mr-2">✓</Text>
                <Text className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                  Your tools, equipment, or team at work
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-red-500 mr-2">✗</Text>
                <Text className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                  Blurry, dark, or low-quality images
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="px-6 py-4 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-[#334155]">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={handleBack}
            className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-4 rounded-xl items-center"
          >
            <Text className="text-gray-700 dark:text-gray-300 font-bold">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 bg-primary-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Next: Services</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}