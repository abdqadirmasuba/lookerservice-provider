import { createSlice } from '@reduxjs/toolkit';

interface NetworkState {
  isOnline: boolean;
}

const initialState: NetworkState = {
  isOnline: true,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setOnline: (state) => {
      state.isOnline = true;
    },
    setOffline: (state) => {
      state.isOnline = false;
    },
  },
});

export const { setOnline, setOffline } = networkSlice.actions;
export default networkSlice.reducer;
