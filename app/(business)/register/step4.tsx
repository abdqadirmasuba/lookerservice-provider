// File: app/(business)/register/step4.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
} from 'react-native-heroicons/outline';

interface Service {
  id: string;
  name: string;
  price: string;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  categories: string[];
}

export default function BusinessStep4Screen() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [priceType, setPriceType] = useState<'fixed' | 'hourly' | 'negotiable'>('fixed');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Mock categories
  const availableCategories = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Cleaning',
    'Repairs',
    'Installation',
    'Maintenance',
  ];

  const handleAddService = () => {
    if (!serviceName.trim()) {
      Alert.alert('Required', 'Please enter a service name');
      return;
    }
    if (selectedCategories.length === 0) {
      Alert.alert('Required', 'Please select at least one category');
      return;
    }

    const newService: Service = {
      id: Date.now().toString(),
      name: serviceName,
      price: servicePrice || '0',
      priceType,
      categories: selectedCategories,
    };

    setServices([...services, newService]);
    setServiceName('');
    setServicePrice('');
    setPriceType('fixed');
    setSelectedCategories([]);

    Alert.alert('Success', 'Service added successfully!');
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleNext = () => {
    if (services.length === 0) {
      Alert.alert('Required', 'Please add at least one service');
      return;
    }

    router.push('/(business)/register/step5');
  };

  const handleBack = () => {
    router.back();
  };

  const getPriceDisplay = (service: Service) => {
    if (service.priceType === 'negotiable') return 'Negotiable';
    if (service.priceType === 'hourly') return `UGX ${service.price}/hr`;
    return `UGX ${service.price}`;
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
              Step 4 of 5
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-2 bg-gray-200 dark:bg-[#334155] rounded-full overflow-hidden">
          <View className="h-full w-[80%] bg-primary-500 rounded-full" />
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
              <WrenchScrewdriverIcon size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Services
            </Text>
            <Text className="text-sm text-center text-gray-600 dark:text-gray-400 px-8">
              Add the services you offer
            </Text>
          </View>

          {/* Add Service Form */}
          <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-6 border border-gray-200 dark:border-[#334155]">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Add New Service
            </Text>

            {/* Service Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Name
              </Text>
              <TextInput
                placeholder="e.g., Pipe Repair, Bathroom Installation"
                placeholderTextColor="#6B7280"
                value={serviceName}
                onChangeText={setServiceName}
                className="bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
              />
            </View>

            {/* Price Type */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pricing Type
              </Text>
              <View className="flex-row space-x-2">
                {(['fixed', 'hourly', 'negotiable'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setPriceType(type)}
                    className={`flex-1 py-3 rounded-xl border ${
                      priceType === type
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-white dark:bg-[#0F172A] border-gray-300 dark:border-[#334155]'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold capitalize ${
                        priceType === type ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Input */}
            {priceType !== 'negotiable' && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (UGX) {priceType === 'hourly' && '/ hour'}
                </Text>
                <TextInput
                  placeholder="Enter price"
                  placeholderTextColor="#6B7280"
                  value={servicePrice}
                  onChangeText={setServicePrice}
                  keyboardType="numeric"
                  className="bg-gray-50 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                />
              </View>
            )}

            {/* Categories */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </Text>
              <View className="flex-row flex-wrap -mx-1">
                {availableCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => toggleCategory(category)}
                    className={`m-1 px-3 py-2 rounded-full border ${
                      selectedCategories.includes(category)
                        ? 'bg-primary-500 border-primary-500'
                        : 'bg-white dark:bg-[#0F172A] border-gray-300 dark:border-[#334155]'
                    }`}
                  >
                    <View className="flex-row items-center">
                      {selectedCategories.includes(category) && (
                        <CheckIcon size={14} color="#FFFFFF" />
                      )}
                      <Text
                        className={`text-sm font-medium ${
                          selectedCategories.includes(category)
                            ? 'text-white ml-1'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {category}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              onPress={handleAddService}
              className="bg-primary-500 py-3 rounded-xl flex-row items-center justify-center"
            >
              <PlusIcon size={20} color="#FFFFFF" />
              <Text className="text-white font-bold ml-2">Add Service</Text>
            </TouchableOpacity>
          </View>

          {/* Services List */}
          {services.length > 0 && (
            <View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Added Services ({services.length})
              </Text>
              {services.map((service) => (
                <View
                  key={service.id}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3 border border-gray-200 dark:border-[#334155]"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <Text className="text-base font-bold text-gray-900 dark:text-white flex-1">
                      {service.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveService(service.id)}
                      className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-full items-center justify-center"
                    >
                      <XMarkIcon size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-primary-500 font-bold mb-2">
                    {getPriceDisplay(service)}
                  </Text>
                  <View className="flex-row flex-wrap">
                    {service.categories.map((cat) => (
                      <View
                        key={cat}
                        className="bg-gray-100 dark:bg-[#0F172A] px-2 py-1 rounded-lg mr-2 mb-2"
                      >
                        <Text className="text-xs text-gray-600 dark:text-gray-400">{cat}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
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
            <Text className="text-white font-bold">Next: Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}