// File: app/(business)/[id]/services.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
} from 'react-native-heroicons/outline';

interface Service {
  id: string;
  name: string;
  price: string;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  categories: string[];
  isActive: boolean;
}

export default function ManageServicesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Pipe Repair',
      price: '50000',
      priceType: 'fixed',
      categories: ['Plumbing', 'Repairs'],
      isActive: true,
    },
    {
      id: '2',
      name: 'Bathroom Installation',
      price: '150000',
      priceType: 'hourly',
      categories: ['Plumbing', 'Installation'],
      isActive: true,
    },
    {
      id: '3',
      name: 'Emergency Services',
      price: '0',
      priceType: 'negotiable',
      categories: ['Plumbing', 'Repairs'],
      isActive: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [priceType, setPriceType] = useState<'fixed' | 'hourly' | 'negotiable'>('fixed');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const availableCategories = ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Repairs', 'Installation', 'Maintenance'];

  const handleAddService = () => {
    if (!serviceName.trim()) {
      Alert.alert('Required', 'Please enter a service name');
      return;
    }

    const newService: Service = {
      id: Date.now().toString(),
      name: serviceName,
      price: servicePrice || '0',
      priceType,
      categories: selectedCategories,
      isActive: true,
    };

    setServices([...services, newService]);
    resetForm();
    Alert.alert('Success', 'Service added successfully!');
  };

  const handleEditService = (service: Service) => {
    setEditingId(service.id);
    setServiceName(service.name);
    setServicePrice(service.price);
    setPriceType(service.priceType);
    setSelectedCategories(service.categories);
    setShowAddForm(true);
  };

  const handleUpdateService = () => {
    if (!editingId) return;

    setServices(
      services.map((s) =>
        s.id === editingId
          ? { ...s, name: serviceName, price: servicePrice, priceType, categories: selectedCategories }
          : s
      )
    );
    resetForm();
    Alert.alert('Success', 'Service updated successfully!');
  };

  const handleDeleteService = (id: string) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setServices(services.filter((s) => s.id !== id));
            Alert.alert('Success', 'Service deleted successfully!');
          },
        },
      ]
    );
  };

  const toggleServiceStatus = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const resetForm = () => {
    setServiceName('');
    setServicePrice('');
    setPriceType('fixed');
    setSelectedCategories([]);
    setShowAddForm(false);
    setEditingId(null);
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
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
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeftIcon size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Manage Services
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddForm(!showAddForm)}
            className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center"
          >
            <PlusIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6">
          {/* Add/Edit Form */}
          {showAddForm && (
            <View className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-6 border border-gray-200 dark:border-[#334155]">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </Text>

              {/* Service Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Name
                </Text>
                <TextInput
                  placeholder="e.g., Pipe Repair"
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

              {/* Price */}
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

              {/* Buttons */}
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={resetForm}
                  className="flex-1 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#334155] py-3 rounded-xl items-center"
                >
                  <Text className="text-gray-700 dark:text-gray-300 font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={editingId ? handleUpdateService : handleAddService}
                  className="flex-1 bg-primary-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold">
                    {editingId ? 'Update' : 'Add'} Service
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Services List */}
          <View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Your Services ({services.length})
            </Text>

            {services.map((service) => (
              <View
                key={service.id}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 mb-3 border border-gray-200 dark:border-[#334155]"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-base font-bold text-gray-900 dark:text-white flex-1">
                        {service.name}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${
                          service.isActive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            service.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-primary-500 font-bold mb-2">
                      {getPriceDisplay(service)}
                    </Text>
                    <View className="flex-row flex-wrap">
                      {service.categories.map((cat) => (
                        <View
                          key={cat}
                          className="bg-gray-100 dark:bg-[#0F172A] px-2 py-1 rounded-lg mr-2 mb-1"
                        >
                          <Text className="text-xs text-gray-600 dark:text-gray-400">{cat}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-[#334155]">
                  <TouchableOpacity
                    onPress={() => toggleServiceStatus(service.id)}
                    className="flex-1 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-lg"
                  >
                    <Text className="text-blue-600 dark:text-blue-400 font-semibold text-center text-sm">
                      {service.isActive ? 'Deactivate' : 'Activate'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEditService(service)}
                    className="flex-1 bg-gray-50 dark:bg-[#0F172A] py-2 rounded-lg flex-row items-center justify-center"
                  >
                    <PencilIcon size={16} color="#6B7280" />
                    <Text className="text-gray-600 dark:text-gray-400 font-semibold ml-1 text-sm">
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteService(service.id)}
                    className="flex-1 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg flex-row items-center justify-center"
                  >
                    <TrashIcon size={16} color="#EF4444" />
                    <Text className="text-red-600 dark:text-red-400 font-semibold ml-1 text-sm">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {services.length === 0 && (
              <View className="items-center justify-center py-20">
                <Text className="text-gray-400 dark:text-gray-500 mb-4">
                  No services yet
                </Text>
                <TouchableOpacity
                  onPress={() => setShowAddForm(true)}
                  className="bg-primary-500 px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-bold">Add Your First Service</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}