import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProviderBusiness {
  id: string;
  business_name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  providerBusinesses: ProviderBusiness[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  providerBusinesses: [],
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; refreshToken: string; providerBusinesses?: ProviderBusiness[] }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.providerBusinesses) {
        state.providerBusinesses = action.payload.providerBusinesses;
      }
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.providerBusinesses = [];
      state.error = null;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateToken } = authSlice.actions;
export default authSlice.reducer;