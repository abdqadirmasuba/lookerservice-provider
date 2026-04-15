import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeftIcon,
  PlusIcon,
  StarIcon,
  WrenchScrewdriverIcon,
} from 'react-native-heroicons/outline';
import { StarIcon as StarSolid } from 'react-native-heroicons/solid';

const SERVICES = [
  {
    id: '1',
    name: 'Basic Plumbing Repair',
    category: 'Plumbing',
    price: 150000,
    duration: '2-3 hours',
    rating: 4.8,
    totalBookings: 34,
    isActive: true,
  },
  {
    id: '2',
    name: 'Full Electrical Installation',
    category: 'Electrical',
    price: 580000,
    duration: '1 day',
    rating: 4.6,
    totalBookings: 18,
    isActive: true,
  },
  {
    id: '3',
    name: 'Deep House Cleaning',
    category: 'Cleaning',
    price: 120000,
    duration: '4-5 hours',
    rating: 4.9,
    totalBookings: 62,
    isActive: false,
  },
  {
    id: '4',
    name: 'Interior Painting (per room)',
    category: 'Painting',
    price: 200000,
    duration: '1-2 days',
    rating: 4.7,
    totalBookings: 27,
    isActive: true,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Plumbing: 'bg-blue-100 text-blue-700',
  Electrical: 'bg-yellow-100 text-yellow-700',
  Cleaning: 'bg-green-100 text-green-700',
  Painting: 'bg-purple-100 text-purple-700',
};

export default function ServicesScreen() {
  const router = useRouter();
  const [services, setServices] = useState(SERVICES);

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeftIcon size={22} color="#F57C1F" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 dark:text-white flex-1">My Services</Text>
        <TouchableOpacity className="bg-orange-500 rounded-xl px-3 py-1.5 flex-row items-center">
          <PlusIcon size={16} color="#fff" />
          <Text className="text-white text-sm font-semibold ml-1">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View className="flex-row mx-4 mt-4 mb-2 gap-3">
        <View className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-100 dark:border-slate-700 items-center">
          <Text className="text-2xl font-bold text-orange-500">{services.length}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400">Total</Text>
        </View>
        <View className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-100 dark:border-slate-700 items-center">
          <Text className="text-2xl font-bold text-green-500">{services.filter((s) => s.isActive).length}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400">Active</Text>
        </View>
        <View className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-100 dark:border-slate-700 items-center">
          <Text className="text-2xl font-bold text-slate-400">{services.filter((s) => !s.isActive).length}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400">Inactive</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-2" showsVerticalScrollIndicator={false}>
        {services.map((service) => (
          <View
            key={service.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-gray-100 dark:border-slate-700"
          >
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-base font-semibold text-slate-800 dark:text-white flex-1 mr-2">
                {service.name}
              </Text>
              <TouchableOpacity
                onPress={() => toggleActive(service.id)}
                className={`px-3 py-1 rounded-full ${service.isActive ? 'bg-green-100' : 'bg-gray-100'}`}
              >
                <Text className={`text-xs font-semibold ${service.isActive ? 'text-green-700' : 'text-slate-400'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-2 mb-3">
              <View className={`px-2 py-0.5 rounded-lg ${(CATEGORY_COLORS[service.category] || 'bg-gray-100 text-gray-600').split(' ')[0]}`}>
                <Text className={`text-xs font-medium ${(CATEGORY_COLORS[service.category] || 'bg-gray-100 text-gray-600').split(' ')[1]}`}>
                  {service.category}
                </Text>
              </View>
              <Text className="text-xs text-slate-400">{service.duration}</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-orange-500 font-bold text-base">
                UGX {service.price.toLocaleString()}
              </Text>
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center">
                  <StarSolid size={13} color="#F59E0B" />
                  <Text className="text-xs text-slate-600 dark:text-slate-300 ml-0.5">{service.rating}</Text>
                </View>
                <Text className="text-xs text-slate-400">{service.totalBookings} bookings</Text>
              </View>
            </View>
          </View>
        ))}

        <View className="items-center py-6">
          <WrenchScrewdriverIcon size={36} color="#CBD5E1" />
          <Text className="text-slate-400 mt-2 text-xs">Tap + Add to create a new service</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
