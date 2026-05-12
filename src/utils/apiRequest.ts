import axios from 'axios';
import { config } from './apiConfig';
import { RootState, store } from '../store';
import { setOffline, setOnline } from '../store/slices/networkSlice';

const api = axios.create({
  baseURL: config.domain_url,
  timeout: 15_000,
});

console.log('API Base URL:', config.domain_url);

// ─── Request interceptor ───────────────────────────────────────────────────
// Attaches the auth token and blocks requests immediately when offline.
api.interceptors.request.use(
  async (cfg) => {
    const state: RootState = store.getState();

    if (!(state.network?.isOnline ?? true)) {
      return Promise.reject(
        Object.assign(new Error('No internet connection'), { code: 'OFFLINE' }),
      );
    }

    const authtoken = state.auth.token;
    if (authtoken) {
      cfg.headers.Authorization = `Bearer ${authtoken}`;
    }

    return cfg;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────────────────────
// Marks the store as offline when no response arrives (network/timeout error),
// and clears the flag when a response eventually succeeds.
api.interceptors.response.use(
  (response) => {
    const state: RootState = store.getState();
    if (!(state.network?.isOnline ?? true)) {
      store.dispatch(setOnline());
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      // No HTTP response → network is unreachable or the request timed out
      store.dispatch(setOffline());
    }
    return Promise.reject(error);
  },
);

export const apiRequests = {
  get: (url: string, params?: any) => api.get(url, { params }),
  post: (url: string, data?: any) => api.post(url, data),
  put: (url: string, data?: any) => api.put(url, data),
  patch: (url: string, data?: any) => api.patch(url, data),
  delete: (url: string, data?: any) => api.delete(url, data),
};

/**
 * POST /auth/logout — fire-and-forget; resolves even if the server call fails
 * so the client state is always cleared regardless.
 */
export const callLogoutApi = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore — we clear local state either way
  }
};

export default api;