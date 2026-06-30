import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
} from 'react-native-heroicons/outline';
import type { RootState } from '@/src/store';

export default function RegisterBusinessFirstScreen() {
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.user.user);
  const firstName = userData?.fullName?.split(' ')[0] || 'there';

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 180 }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['#F57C1F', '#E06A0F']}
            className="px-6 pt-8 pb-12 rounded-b-[40px]"
          >
            <View className="items-center mt-4">
              <View className="items-center justify-center mb-4">
                <BuildingStorefrontIcon size={48} color="#FFFFFF" />
              </View>
              <Text className="text-white text-lg font-semibold text-center">
                Welcome , {firstName}!
              </Text>
              <Text className="text-white text-2xl font-bold text-center mt-3">
                Ready to start your journey?
              </Text>
              <Text className="text-white/80 text-sm mt-3 text-center px-4">
                Take the steps to set up your business, company or personal profile and start connecting with clients in your area.
              </Text>
            </View>
          </LinearGradient>

          <View className="px-6 mt-6">
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                What you'll do next
              </Text>
              <View className="space-y-4">
                <View className="flex-row items-start">
                  <View className="mt-1 mr-3 rounded-full bg-primary-50 dark:bg-white/10 w-10 h-10 items-center justify-center">
                    <ClipboardDocumentListIcon size={22} color="#F57C1F" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      1. Add provider information
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Choose individual, business or company brand name, add a description, contact information and pin your location on the map.
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="mt-1 mr-3 rounded-full bg-primary-50 dark:bg-white/10 w-10 h-10 items-center justify-center">
                    <ClockIcon size={22} color="#F57C1F" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      2. Set your availability
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Choose weekly availability, mark days open, closed or 24/7 so clients know when you are ready to serve them.
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="mt-1 mr-3 rounded-full bg-primary-50 dark:bg-white/10 w-10 h-10 items-center justify-center">
                    <BuildingStorefrontIcon size={22} color="#F57C1F" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      3. Pick your service category
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Select the category group that best matches the services you provide from the available list.
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="mt-1 mr-3 rounded-full bg-primary-50 dark:bg-white/10 w-10 h-10 items-center justify-center">
                    <CheckCircleIcon size={22} color="#F57C1F" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      4. Verify and save your info
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Review your details and save them so LookerService clients can identify your business confidently.
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start">
                  <View className="mt-1 mr-3 rounded-full bg-primary-50 dark:bg-white/10 w-10 h-10 items-center justify-center">
                    <ClipboardDocumentListIcon size={22} color="#F57C1F" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      5. Complete your business profile
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      After setup, go to manage business to add services, billing details, and sample images for clients.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="rounded-3xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#111827] p-6 shadow-sm">
              <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Why this matters
              </Text>
              <Text className="text-base text-gray-900 dark:text-white leading-6">
                Clients can only find providers with complete information. Fill in the details carefully — this screen starts your business setup with a simple, guided flow.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="px-6 pb-6 bg-gray-50 dark:bg-[#0F172A]">
          <TouchableOpacity
            onPress={() => router.push('/(business)/register/step1')}
            activeOpacity={0.85}
            className="bg-primary-500 px-6 py-4 rounded-full items-center"
          >
            <Text className="text-white font-semibold text-base">Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
