import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ServiceDeliveryType = 'onsite' | 'remote' | 'both' | '';

export type DayMode = 'closed' | 'working' | 'fullday';

export interface DayHoursState {
  mode: DayMode;
  open: string;
  close: string;
}

export interface BusinessRegistrationState {
  // Step 1: Business Info, Service Delivery & Location
  business_name: string;
  business_description: string;
  service_delivery_type: ServiceDeliveryType;
  longitude: number | null;
  latitude: number | null;
  address: string;
  city: string;
  state_region: string;
  country: string;

  // Step 2: Business Hours (per-day mode + times)
  business_hours: { [day: string]: DayHoursState };

  // Step 1: Business Logo (local URI before upload, public URL after)
  business_logo: string;

  // Step 3: Business Photos (server URLs)
  business_photos: string[];

  // Step 3 (new): Groups — single selection
  group_id: string;
  group_name: string;

  // Current step
  currentStep: number;
}

const initialState: BusinessRegistrationState = {
  business_name: '',
  business_description: '',
  service_delivery_type: '',
  longitude: null,
  latitude: null,
  address: '',
  city: '',
  state_region: '',
  country: '',
  business_logo: '',
  business_hours: {},
  business_photos: [],
  group_id: '',
  group_name: '',
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
        service_delivery_type: ServiceDeliveryType;
      }>
    ) => {
      state.business_name = action.payload.business_name;
      state.business_description = action.payload.business_description;
      state.service_delivery_type = action.payload.service_delivery_type;
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
      }>
    ) => {
      state.longitude = action.payload.longitude;
      state.latitude = action.payload.latitude;
      state.address = action.payload.address;
      state.city = action.payload.city;
      state.state_region = action.payload.state_region;
      state.country = action.payload.country;
    },

    setBusinessHours: (
      state,
      action: PayloadAction<{ [day: string]: DayHoursState }>
    ) => {
      state.business_hours = action.payload;
    },

    setBusinessLogo: (state, action: PayloadAction<string>) => {
      state.business_logo = action.payload;
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

    setGroupIds: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.group_id = action.payload.id;
      state.group_name = action.payload.name;
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
  setBusinessLogo,
  setBusinessHours,
  setBusinessPhotos,
  addBusinessPhoto,
  removeBusinessPhoto,
  setGroupIds,
  setCurrentStep,
  nextStep,
  previousStep,
  resetBusinessRegistration,
} = businessRegistrationSlice.actions;

export default businessRegistrationSlice.reducer;
