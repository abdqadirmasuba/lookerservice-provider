import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProviderBusiness {
  id: string;
  business_name: string;
  last_accessed?: string;
  is_last_accessed?: boolean;
  logo_url?: string;
  address?: string;
  verification_status?: string;
  status?: string;
  provider_type?: string;
  created_at?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  tempToken: string | null;
  installationId: string | null;
  providerBusinesses: ProviderBusiness[];
  activeBusinessId: string | null;
  providerTier: 'free' | 'pro';
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  tempToken: null,
  installationId: null,
  providerBusinesses: [],
  activeBusinessId: null,
  providerTier: 'free',
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
    loginSuccess: (state, action: PayloadAction<{ token: string; refreshToken: string; installationId?: string; providerBusinesses?: ProviderBusiness[]; providerTier?: 'free' | 'pro' }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.installationId) {
        state.installationId = action.payload.installationId;
      }
      state.providerTier = action.payload.providerTier ?? 'free';
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
      state.providerTier = 'free';
      state.error = null;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setActiveBusiness: (state, action: PayloadAction<string>) => {
      state.activeBusinessId = action.payload;
    },
    setTempToken: (state, action: PayloadAction<string | null>) => {
      state.tempToken = action.payload;
    },
    setInstallationId: (state, action: PayloadAction<string>) => {
      state.installationId = action.payload;
    },
    addProviderBusiness: (state, action: PayloadAction<ProviderBusiness>) => {
      const exists = state.providerBusinesses.some((b) => b.id === action.payload.id);
      if (!exists) {
        state.providerBusinesses.unshift(action.payload);
      }
      if (!state.activeBusinessId) {
        state.activeBusinessId = action.payload.id;
      }
    },
  },
});

export const { loginStart,addProviderBusiness, loginSuccess, loginFailure, logout, updateToken, setActiveBusiness, setTempToken, setInstallationId } = authSlice.actions;
export default authSlice.reducer;