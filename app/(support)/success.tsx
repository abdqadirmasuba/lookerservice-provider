import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SupportPaymentSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const merchantReference = params.merchant_reference as string | undefined;
  const orderTrackingId = params.order_tracking_id as string | undefined;
  const paymentStatus = params.status as string | undefined;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />
      <View className="flex-1 px-6 py-10 justify-between">
        <View>
          <Text className="text-3xl font-bold text-slate-900 dark:text-white">Payment completed</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Thank you for processing your payment. Your support helps LookerService keep serving providers and clients.
          </Text>

          <View className="mt-8 rounded-3xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 shadow-sm">
            <Text className="text-sm text-gray-500 dark:text-gray-400">Status</Text>
            <Text className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{paymentStatus || 'Success'}</Text>

            {merchantReference ? (
              <>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-5">Merchant reference</Text>
                <Text className="text-base text-slate-900 dark:text-white mt-1">{merchantReference}</Text>
              </>
            ) : null}

            {orderTrackingId ? (
              <>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-5">Order tracking id</Text>
                <Text className="text-base text-slate-900 dark:text-white mt-1">{orderTrackingId}</Text>
              </>
            ) : null}
          </View>
        </View>

        <View className="gap-3">
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/account')}
            className="rounded-2xl bg-orange-500 px-5 py-4 items-center justify-center"
            activeOpacity={0.85}
          >
            <Text className="text-white font-semibold text-base">Return to app</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] px-5 py-4 items-center justify-center"
            activeOpacity={0.85}
          >
            <Text className="text-slate-900 dark:text-white font-semibold text-base">Go home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace('/(support)')}
            className="rounded-2xl border border-orange-200 dark:border-orange-500/40 bg-orange-50 dark:bg-orange-500/10 px-5 py-4 items-center justify-center"
            activeOpacity={0.85}
          >
            <Text className="text-orange-600 dark:text-orange-300 font-semibold text-base">Process another payment</Text>
          </TouchableOpacity>
          <Text className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            If you are not redirected automatically, please close the browser and return to the app.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
