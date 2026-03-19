import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProviderBusiness {
  id: string;
  business_name: string;
  last_accessed?: string;
  is_last_accessed?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  providerBusinesses: ProviderBusiness[];
  activeBusinessId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  providerBusinesses: [],
  activeBusinessId: null,
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
        // Set active business from is_last_accessed flag
        const lastAccessed = action.payload.providerBusinesses.find(b => b.is_last_accessed);
        state.activeBusinessId = lastAccessed?.id || action.payload.providerBusinesses[0]?.id || null;
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
      state.activeBusinessId = null;
      state.error = null;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setActiveBusiness: (state, action: PayloadAction<string>) => {
      state.activeBusinessId = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateToken, setActiveBusiness } = authSlice.actions;
export default authSlice.reducer;