// File: app/(business)/[id]/services.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  TagIcon,
} from 'react-native-heroicons/outline';
import {
  getProviderCategories,
  getServicesByCategories,
  createProviderService,
  updateProviderService,
  deactivateProviderService,
  activateProviderService,
  deleteProviderService,
  getProviderProfile,
} from '@/src/utils/business';
import { useCustomAlert } from '@/src/components/common/CustomAlert';

interface ServiceOption {
  id: string;
  name: string;
  description: string;
}

interface CategoryWithServices {
  category_id: string;
  category_name: string;
  category_description: string;
  services: ServiceOption[];
}

interface ProviderService {
  id: string;
  service_id: string;
  category_id: string;
  service_name: string;
  description?: string;
  pricing_type: string;
  base_price?: number;
  currency?: string;
  status: string;
}

export default function ManageServicesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const businessId = params.id as string;
  const { showAlert, AlertComponent } = useCustomAlert();

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ProviderService[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [categoriesWithServices, setCategoriesWithServices] = useState<CategoryWithServices[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingServices, setLoadingServices] = useState(false);

  // Form states
  const [editingService, setEditingService] = useState<ProviderService | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [pricingType, setPricingType] = useState<'negotiable' | 'fixed' | 'hourly'>('negotiable');
  const [basePrice, setBasePrice] = useState('');
  const [currency, setCurrency] = useState<'UGX' | 'USD'>('UGX');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProviderServices();
  }, [businessId]);

  const fetchProviderServices = async () => {
    try {
      setLoading(true);
      const response = await getProviderProfile(businessId);
      setServices(response.data.services || []);
    } catch (err: any) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load services',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableServices = async () => {
    try {
      setLoadingServices(true);
      // First get provider categories
      const categoriesResponse = await getProviderCategories(businessId);
      const categories = categoriesResponse.data || [];
      
      if (categories.length === 0) {
        showAlert({
          type: 'warning',
          title: 'No Categories Added',
          message: 'You need to add categories to your business before managing services. Would you like to add categories now?',
          buttons: [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Add Categories', 
              style: 'default',
              onPress: () => router.push(`/(business)/${businessId}/categories`)
            },
          ],
        });
        return;
      }

      // Extract category IDs
      const categoryIds = categories.map((cat: any) => cat.category_id);
      
      // Fetch services for those categories
      const servicesResponse = await getServicesByCategories(categoryIds);
      setCategoriesWithServices(servicesResponse.data || []);
      setShowServiceModal(true);
    } catch (err: any) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to load available services',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    } finally {
      setLoadingServices(false);
    }
  };

  const handleSelectService = (service: ServiceOption, categoryId: string) => {
    setSelectedService(service);
    setSelectedCategoryId(categoryId);
    setShowServiceModal(false);
    setShowServiceForm(true);
    setDescription('');
    setPricingType('negotiable');
    setBasePrice('');
    setCurrency('UGX');
  };

  const handleEditService = (service: ProviderService) => {
    setEditingService(service);
    setSelectedService({ id: service.service_id, name: service.service_name, description: '' });
    setSelectedCategoryId(service.category_id);
    setDescription(service.description || '');
    setPricingType(service.pricing_type as any);
    setBasePrice(service.base_price?.toString() || '');
    setCurrency((service.currency as any) || 'UGX');
    setShowServiceForm(true);
  };

  const handleSubmitService = async () => {
    if (!selectedService || !selectedCategoryId) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Please select a service',
        buttons: [{ text: 'OK', style: 'default' }],
      });
      return;
    }

    if (pricingType !== 'negotiable' && !basePrice) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'Please enter a price',
        buttons: [{ text: 'OK', style: 'default' }],
      });
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingService) {
        const updateData = {
          description,
          pricing_type: pricingType,
          base_price: pricingType !== 'negotiable' ? parseFloat(basePrice) : undefined,
          currency: pricingType !== 'negotiable' ? currency : undefined,
        };
        await updateProviderService(businessId, editingService.service_id, editingService.category_id, updateData);
        showAlert({
          type: 'success',
          title: 'Success',
          message: 'Service updated successfully!',
          buttons: [{ text: 'OK', style: 'default' }],
        });
      } else {
        const createData = {
          service_id: selectedService.id,
          category_id: selectedCategoryId,
          description,
          pricing_type: pricingType,
          base_price: pricingType !== 'negotiable' ? parseFloat(basePrice) : undefined,
          currency: pricingType !== 'negotiable' ? currency : undefined,
        };
        await createProviderService(businessId, createData);
        showAlert({
          type: 'success',
          title: 'Success',
          message: 'Service added successfully!',
          buttons: [{ text: 'OK', style: 'default' }],
        });
      }

      resetForm();
      fetchProviderServices();
    } catch (err: any) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to save service',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (service: ProviderService) => {
    const isActive = service.status === 'active';
    
    showAlert({
      type: 'warning',
      title: isActive ? 'Hide Service' : 'Activate Service',
      message: `Are you sure you want to ${isActive ? 'hide' : 'activate'} this service?`,
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isActive ? 'Hide' : 'Activate',
          style: 'default',
          onPress: async () => {
            try {
              if (isActive) {
                await deactivateProviderService(service.service_id, service.category_id, businessId);
              } else {
                await activateProviderService(service.service_id, service.category_id, businessId);
              }
              showAlert({
                type: 'success',
                title: 'Success',
                message: `Service ${isActive ? 'hidden' : 'activated'} successfully!`,
                buttons: [{ text: 'OK', style: 'default' }],
              });
              fetchProviderServices();
            } catch (err: any) {
              showAlert({
                type: 'error',
                title: 'Error',
                message: err.message || 'Failed to update service status',
                buttons: [{ text: 'OK', style: 'default' }],
              });
            }
          },
        },
      ],
    });
  };

  const handleDeleteService = (service: ProviderService) => {
    showAlert({
      type: 'warning',
      title: 'Delete Service',
      message: 'Are you sure you want to delete this service? This action cannot be undone.',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProviderService(service.service_id, service.category_id, businessId);
              showAlert({
                type: 'success',
                title: 'Success',
                message: 'Service deleted successfully!',
                buttons: [{ text: 'OK', style: 'default' }],
              });
              fetchProviderServices();
            } catch (err: any) {
              showAlert({
                type: 'error',
                title: 'Error',
                message: err.message || 'Failed to delete service',
                buttons: [{ text: 'OK', style: 'default' }],
              });
            }
          },
        },
      ],
    });
  };

  const resetForm = () => {
    setSelectedService(null);
    setSelectedCategoryId('');
    setDescription('');
    setPricingType('negotiable');
    setBasePrice('');
    setCurrency('UGX');
    setShowServiceForm(false);
    setEditingService(null);
  };

  const getPriceDisplay = (service: ProviderService) => {
    if (service.pricing_type === 'negotiable') return 'Negotiable';
    const currencySymbol = service.currency === 'USD' ? '$' : 'UGX';
    const suffix = service.pricing_type === 'hourly' ? '/hr' : '';
    return `${currencySymbol} ${service.base_price}${suffix}`;
  };

  const filteredCategories = categoriesWithServices.filter(
    (cat) =>
      cat.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.services.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          {loadingServices ? (
            <ActivityIndicator size="small" color="#F57C1F" />
          ) : (
            <TouchableOpacity
              onPress={loadAvailableServices}
              className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center"
            >
              <PlusIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-6 py-6">
          {/* Loading State */}
          {loading && (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color="#F57C1F" />
              <Text className="text-gray-600 dark:text-gray-400 mt-4">
                Loading services...
              </Text>
            </View>
          )}

          {/* Services List */}
          {!loading && (
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
                          {service.service_name}
                        </Text>
                        <View
                          className={`px-2 py-1 rounded-full ${
                            service.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/20'
                              : service.status === 'hidden'
                              ? 'bg-gray-100 dark:bg-gray-800'
                              : 'bg-red-100 dark:bg-red-900/20'
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              service.status === 'active'
                                ? 'text-green-600 dark:text-green-400'
                                : service.status === 'hidden'
                                ? 'text-gray-600 dark:text-gray-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {service.status === 'active' ? 'Active' : service.status === 'hidden' ? 'Hidden' : 'Down'}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-primary-500 font-bold mb-2">
                        {getPriceDisplay(service)}
                      </Text>
                      {service.description && (
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          {service.description}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Actions */}
                  <View className="flex-row space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-[#334155]">
                    <TouchableOpacity
                      key="toggle"
                      onPress={() => handleToggleActive(service)}
                      className="flex-1 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-lg"
                      disabled={service.status === 'down'}
                    >
                      <Text className={`font-semibold text-center text-sm ${
                        service.status === 'down' 
                          ? 'text-gray-400 dark:text-gray-600' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {service.status === 'active' ? 'Hide' : service.status === 'hidden' ? 'Activate' : 'Down'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      key="edit"
                      onPress={() => handleEditService(service)}
                      className="flex-1 bg-gray-50 dark:bg-[#0F172A] py-2 rounded-lg flex-row items-center justify-center"
                    >
                      <PencilIcon size={16} color="#6B7280" />
                      <Text className="text-gray-600 dark:text-gray-400 font-semibold ml-1 text-sm">
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      key="delete"
                      onPress={() => handleDeleteService(service)}
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
                <View className="items-center justify-center py-10">
                  {/* Info Card */}
                  <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6 w-full">
                    <Text className="text-blue-900 dark:text-blue-300 font-semibold mb-2 text-center">
                      Getting Started
                    </Text>
                    <Text className="text-blue-700 dark:text-blue-400 text-sm text-center leading-6">
                      Before adding services, make sure you have added categories to your business profile. Then select services from those categories.
                    </Text>
                  </View>

                  <TagIcon size={64} color="#9CA3AF" />
                  <Text className="text-gray-600 dark:text-gray-400 mt-4 mb-2 text-center font-semibold">
                    No services yet
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-500 text-sm text-center mb-6 px-8">
                    Add your first service to start receiving bookings
                  </Text>
                  <TouchableOpacity
                    onPress={loadAvailableServices}
                    className="bg-primary-500 px-6 py-3 rounded-xl mb-3"
                    disabled={loadingServices}
                  >
                    {loadingServices ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text className="text-white font-bold">Add Your First Service</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push(`/(business)/${businessId}/categories`)}
                    className="px-6 py-2"
                  >
                    <Text className="text-primary-500 font-semibold text-sm">Manage Categories First</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Service Selection Modal */}
      <Modal
        visible={showServiceModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowServiceModal(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
          {/* Modal Header */}
          <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                Select Service
              </Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                <XMarkIcon size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="mt-4 bg-gray-100 dark:bg-[#0F172A] rounded-xl px-4 py-3 flex-row items-center">
              <MagnifyingGlassIcon size={20} color="#6B7280" />
              <TextInput
                placeholder="Search services..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-2 text-gray-900 dark:text-white"
              />
            </View>
          </View>

          {/* Services List */}
          <ScrollView className="flex-1">
            <View className="px-6 py-4">
              {loadingServices ? (
                <View className="py-20 items-center">
                  <ActivityIndicator size="large" color="#F57C1F" />
                  <Text className="text-gray-600 dark:text-gray-400 mt-4">
                    Loading services...
                  </Text>
                </View>
              ) : filteredCategories.length === 0 ? (
                <View className="py-20 items-center">
                  <TagIcon size={64} color="#9CA3AF" />
                  <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
                    {searchQuery ? 'No services found' : 'No services available'}
                  </Text>
                </View>
              ) : (
                filteredCategories.map((category) => (
                  <View key={category.category_id} className="mb-6">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      {category.category_name}
                    </Text>
                    {category.services.map((service) => (
                      <TouchableOpacity
                        key={service.id}
                        onPress={() => handleSelectService(service, category.category_id)}
                        className="bg-white dark:bg-[#1E293B] rounded-xl p-4 mb-2 border border-gray-200 dark:border-[#334155] active:bg-gray-50 dark:active:bg-[#0F172A]"
                      >
                        <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">
                          {service.name}
                        </Text>
                        {service.description && (
                          <Text className="text-sm text-gray-600 dark:text-gray-400">
                            {service.description}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Service Form Modal */}
      <Modal
        visible={showServiceForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowServiceForm(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F172A]">
          {/* Modal Header */}
          <View className="px-6 pt-4 pb-4 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-[#334155]">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                {editingService ? 'Edit Service' : 'Add Service'}
              </Text>
              <TouchableOpacity onPress={() => setShowServiceForm(false)}>
                <XMarkIcon size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1">
            <View className="px-6 py-6">
              {/* Service Name (Disabled) */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Name
                </Text>
                <TextInput
                  value={selectedService?.name || editingService?.service_name || ''}
                  editable={false}
                  className="bg-gray-200 dark:bg-[#334155] border border-gray-300 dark:border-[#475569] rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400"
                />
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </Text>
                <TextInput
                  placeholder="Add a description..."
                  placeholderTextColor="#6B7280"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                />
              </View>

              {/* Pricing Type */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pricing Type
                </Text>
                <View className="flex-row space-x-2">
                  {(['negotiable', 'fixed', 'hourly'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setPricingType(type)}
                      className={`flex-1 py-3 rounded-xl border ${
                        pricingType === type
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white dark:bg-[#1E293B] border-gray-300 dark:border-[#334155]'
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold text-xs capitalize ${
                          pricingType === type
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Currency & Price (only for fixed/hourly) */}
              {pricingType !== 'negotiable' && (
                <>
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </Text>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        key="ugx"
                        onPress={() => setCurrency('UGX')}
                        className={`flex-1 py-3 rounded-xl border ${
                          currency === 'UGX'
                            ? 'bg-primary-500 border-primary-500'
                            : 'bg-white dark:bg-[#1E293B] border-gray-300 dark:border-[#334155]'
                        }`}
                      >
                        <Text
                          className={`text-center font-semibold ${
                            currency === 'UGX'
                              ? 'text-white'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          UGX
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        key="usd"
                        onPress={() => setCurrency('USD')}
                        className={`flex-1 py-3 rounded-xl border ${
                          currency === 'USD'
                            ? 'bg-primary-500 border-primary-500'
                            : 'bg-white dark:bg-[#1E293B] border-gray-300 dark:border-[#334155]'
                        }`}
                      >
                        <Text
                          className={`text-center font-semibold ${
                            currency === 'USD'
                              ? 'text-white'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          USD
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Base Price {pricingType === 'hourly' && '(per hour)'}
                    </Text>
                    <TextInput
                      placeholder="Enter price"
                      placeholderTextColor="#6B7280"
                      value={basePrice}
                      onChangeText={setBasePrice}
                      keyboardType="numeric"
                      className="bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                    />
                  </View>
                </>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitService}
                disabled={submitting}
                className="bg-primary-500 py-4 rounded-xl items-center mt-4"
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    {editingService ? 'Update Service' : 'Add Service'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Custom Alert */}
      {AlertComponent}
    </SafeAreaView>
  );
}