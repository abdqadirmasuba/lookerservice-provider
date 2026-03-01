import { apiRequests } from './apiRequest';

export const registerBusiness = async (data: {
  business_name: string;
  business_description: string;
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  state_region: string;
  country: string;
  postal_code: string;
  business_hours?: object;
  business_photos?: string[];
  category_ids: string[];
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
