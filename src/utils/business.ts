import { apiRequests } from './apiRequest';

export const presignUpload = async (params: {
  file_name: string;
  content_type: string;
  upload_type: string;
  reference_id?: string;
  name?: string;
}) => {
  try {
    const response = await apiRequests.post('/provider/uploads/presign', params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload a local file to an S3 pre-signed URL as raw binary.
 * Uses XMLHttpRequest so React Native can read the local file URI directly.
 * No auth headers — S3 presigned URLs are self-contained.
 */
export const uploadToS3 = (
  uploadUrl: string,
  fileUri: string,
  contentType: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('S3 upload network error'));
    // React Native resolves local file URIs when passed as { uri } to XHR body
    xhr.send({ uri: fileUri, type: contentType, name: 'upload' } as any);
  });
};

export const registerBusiness = async (data: {
  business_name: string;
  business_description: string;
  service_delivery_type: string;
  provider_type: string;
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  state_region: string;
  country: string;
  business_hours?: object;
  business_photos?: string[];
  group_id: string;
  logo_url?: string;
}) => {
  try {
    const response = await apiRequests.post('/provider/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await apiRequests.get('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActiveGroups = async () => {
  try {
    const response = await apiRequests.get('/provider/groups/active');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActiveCategories = async () => {
  try {
    const response = await apiRequests.get('/provider/categories/active');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServicesByCategory = async (categoryId: string) => {
  try {
    const response = await apiRequests.get(`/categories/${categoryId}/services`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadBusinessPhoto = async (photoUri: string) => {
  try {
    const formData = new FormData();
    const filename = photoUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('photo', {
      uri: photoUri,
      name: filename,
      type,
    } as any);

    const response = await apiRequests.post('/upload/business-photo', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProviderBusinesses = async () => {
  try {
    const response = await apiRequests.get('/provider/businesses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProviderProfile = async (providerId: string) => {
  try {
    const response = await apiRequests.get(`/provider/profile/${providerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const disableBusiness = async (providerId: string) => {
  try {
    const response = await apiRequests.post(`/provider/${providerId}/disable`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const enableBusiness = async (providerId: string) => {
  try {
    const response = await apiRequests.post(`/provider/${providerId}/reactivate`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProviderCategories = async (providerId: string) => {
  try {
    const response = await apiRequests.get(`/provider/${providerId}/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailableProviderCategories = async (providerId: string) => {
  try {
    const response = await apiRequests.get(`/provider/${providerId}/categories/available`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addProviderCategory = async (providerId: string, categoryId: string) => {
  try {
    const response = await apiRequests.post(`/provider/${providerId}/categories`, {
      category_id: categoryId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProviderServices = async (providerId: string) => {
  try {
    const response = await apiRequests.get(`/provider/${providerId}/services`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailableServices = async (providerId: string) => {
  try {
    const response = await apiRequests.get(`/provider/${providerId}/services/available`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServicesByCategories = async (categoryIds: string[]) => {
  try {
    const response = await apiRequests.post('/provider/services/by-categories', {
      category_ids: categoryIds,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProviderService = async (
  providerId: string,
  data: {
    service_id: string;
    category_id: string;
    description?: string;
    pricing_type: string;
    base_price?: number;
    currency?: string;
    images?: string[];
  }
) => {
  try {
    const response = await apiRequests.post(
      `/provider/${providerId}/services/register`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProviderService = async (
  providerId: string,
  serviceId: string,
  categoryId: string,
  data: {
    description?: string;
    pricing_type?: string;
    base_price?: number;
    currency?: string;
    images?: string[];
  }
) => {
  try {
    const response = await apiRequests.patch(
      `/provider/${providerId}/services/${serviceId}/${categoryId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deactivateProviderService = async (serviceId: string, categoryId: string, providerId: string) => {
  try {
    const response = await apiRequests.post(`/provider/${providerId}/services/deactivate`, {
      service_id: serviceId,
      category_id: categoryId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const activateProviderService = async (serviceId: string, categoryId: string, providerId: string) => {
  try {
    const response = await apiRequests.post(`/provider/${providerId}/services/activate`, {
      service_id: serviceId,
      category_id: categoryId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProviderService = async (serviceId: string, categoryId: string, providerId: string) => {
  try {
    const response = await apiRequests.delete(`/provider/${providerId}/services/delete`, {
      data: {
        service_id: serviceId,
        category_id: categoryId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBusinessHours = async (
  providerId: string,
  business_hours: { [day: string]: string },
) => {
  try {
    const response = await apiRequests.patch(`/provider/profile/${providerId}/business-hours`, {
      business_hours,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBusinessProfile = async (
  providerId: string,
  data: {
    business_description?: string;
    service_delivery_type?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    city?: string;
    state_region?: string;
    country?: string;
    logo_url?: string;
  },
) => {
  try {
    const response = await apiRequests.put(`/provider/profile/${providerId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerServiceItems = async (
  providerId: string,
  serviceId: string,
  serviceList: Array<{
    label: string;
    amount?: number;
    currency?: string;
    image_urls: string[];
  }>,
) => {
  try {
    const response = await apiRequests.post(`/provider/${providerId}/services/register`, {
      service_id: serviceId,
      service_list: serviceList,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProviderServiceDetail = async (providerId: string, serviceId: string) => {
  try {
    const response = await apiRequests.get(`/provider/${providerId}/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateServiceItems = async (
  providerId: string,
  serviceId: string,
  serviceList: Array<{
    label: string;
    amount?: number;
    currency?: string;
    image_urls: string[];
  }>,
) => {
  try {
    const response = await apiRequests.patch(`/provider/${providerId}/services/${serviceId}`, {
      service_list: serviceList,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await apiRequests.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};
