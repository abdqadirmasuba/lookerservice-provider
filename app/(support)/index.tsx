import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { createPayment, createSupportPaymentCallbackUrl } from '@/src/utils/payments';
import ArrowLeftIcon from 'react-native-heroicons/outline/ArrowLeftIcon';
import KeyboardAvoidingWrapper from '@/src/components/common/KeyboardAvoidingWrapper';

export default function SupportPaymentScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const parsedAmount = Number(amount?.toString().replace(/[^0-9]/g, ''));

    if (!parsedAmount || parsedAmount <= 0) {
      return Alert.alert('Invalid amount', 'Please enter a valid amount greater than zero.');
    }

    if (!phoneNumber?.trim()) {
      return Alert.alert('Phone number required', 'Please enter a phone number to continue.');
    }

    setLoading(true);

    try {
      const response = await createPayment(parsedAmount, phoneNumber.trim());
      const redirectUrl = response.data?.data?.redirect_url;
      const callbackUrl = createSupportPaymentCallbackUrl();

      if (!redirectUrl) {
        throw new Error('No redirect URL returned by payment service.');
      }

      await WebBrowser.openAuthSessionAsync(redirectUrl, callbackUrl);
    } catch (error: any) {
      console.error('Payment creation error', error.response?.data);
      Alert.alert('Payment failed', error?.response?.data?.message || error?.message || 'Unable to create payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
      <StatusBar style="auto" />
      <View className="px-6 pt-4 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
            <ArrowLeftIcon size={22} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Support Looker Service
          </Text>
        </View>
      </View>
      <KeyboardAvoidingWrapper>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-6">
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-6">
              Give support to Looker Service to help its services grow and reach wider coverage. Your contribution Means alot in support for Looker Service platform to keep running .
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-6">
              Payments are processed by Pesapal and support Mobile Money and card payments. Enter the amount and phone number below to create the payment.
            </Text>

            <View className="mt-8 bg-white dark:bg-[#1E293B] rounded-3xl p-5 shadow-sm">
              <Text className="text-sm uppercase tracking-[0.2em] text-orange-600 font-semibold">Payment details</Text>

              <View className="mt-5">
                <Text className="text-sm font-semibold text-slate-800 dark:text-white">Amount</Text>
                <View className="mt-2 flex-row items-center rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#111827] px-4 py-3">
                  <Text className="text-slate-600 dark:text-gray-300 mr-2">UGX</Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="amount in UGX"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 text-base text-slate-900 dark:text-white"
                  />
                </View>
              </View>

              <View className="mt-5">
                <Text className="text-sm font-semibold text-slate-800 dark:text-white">Mobile Account Number</Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="07....."
                  placeholderTextColor="#94A3B8"
                  className="mt-2 rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#111827] px-4 py-3 text-base text-slate-900 dark:text-white"
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="mt-6 rounded-2xl bg-orange-500 px-5 py-4 items-center justify-center"
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold text-base">Create payment</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
}
