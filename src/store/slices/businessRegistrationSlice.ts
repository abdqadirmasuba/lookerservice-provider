import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BusinessHours {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}

export interface BusinessRegistrationState {
  // Step 1: Business Info & Location
  business_name: string;
  business_description: string;
  longitude: number | null;
  latitude: number | null;
  address: string;
  city: string;
  state_region: string;
  country: string;
  postal_code: string;

  // Step 2: Business Hours (optional)
  business_hours: BusinessHours;

  // Step 3: Business Photos (optional)
  business_photos: string[];

  // Step 4: Categories
  categories: string[];

  // Step 5: Services
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category_id: string;
  }>;

  // Current step
  currentStep: number;
}

const initialState: BusinessRegistrationState = {
  business_name: '',
  business_description: '',
  longitude: null,
  latitude: null,
  address: '',
  city: '',
  state_region: '',
  country: '',
  postal_code: '',
  business_hours: {},
  business_photos: [],
  categories: [],
  services: [],
  currentStep: 1,
};

const businessRegistrationSlice = createSlice({
  name: 'businessRegistration',
  initialState,
  reducers: {
    setBusinessInfo: (
      state,
      action: PayloadAction<{
        business_name: string;
        business_description: string;
      }>
    ) => {
      state.business_name = action.payload.business_name;
      state.business_description = action.payload.business_description;
    },

    setLocation: (
      state,
      action: PayloadAction<{
        longitude: number;
        latitude: number;
        address: string;
        city: string;
        state_region: string;
        country: string;
        postal_code: string;
      }>
    ) => {
      state.longitude = action.payload.longitude;
      state.latitude = action.payload.latitude;
      state.address = action.payload.address;
      state.city = action.payload.city;
      state.state_region = action.payload.state_region;
      state.country = action.payload.country;
      state.postal_code = action.payload.postal_code;
    },

    setBusinessHours: (state, action: PayloadAction<BusinessHours>) => {
      state.business_hours = action.payload;
    },

    setBusinessPhotos: (state, action: PayloadAction<string[]>) => {
      state.business_photos = action.payload;
    },

    addBusinessPhoto: (state, action: PayloadAction<string>) => {
      state.business_photos.push(action.payload);
    },

    removeBusinessPhoto: (state, action: PayloadAction<number>) => {
      state.business_photos.splice(action.payload, 1);
    },

    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },

    setServices: (
      state,
      action: PayloadAction<BusinessRegistrationState['services']>
    ) => {
      state.services = action.payload;
    },

    addService: (
      state,
      action: PayloadAction<BusinessRegistrationState['services'][0]>
    ) => {
      state.services.push(action.payload);
    },

    removeService: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter(
        (service) => service.id !== action.payload
      );
    },

    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    nextStep: (state) => {
      if (state.currentStep < 5) {
        state.currentStep += 1;
      }
    },

    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },

    resetBusinessRegistration: () => initialState,
  },
});

export const {
  setBusinessInfo,
  setLocation,
  setBusinessHours,
  setBusinessPhotos,
  addBusinessPhoto,
  removeBusinessPhoto,
  setCategories,
  setServices,
  addService,
  removeService,
  setCurrentStep,
  nextStep,
  previousStep,
  resetBusinessRegistration,
} = businessRegistrationSlice.actions;

export default businessRegistrationSlice.reducer;
