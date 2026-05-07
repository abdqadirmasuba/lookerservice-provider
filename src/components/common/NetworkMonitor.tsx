// File: src/components/common/NetworkMonitor.tsx
// Null-render component that listens to NetInfo and syncs state to Redux.
// Mount once in the root layout.

import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { setOnline, setOffline } from '@/src/store/slices/networkSlice';
import type { AppDispatch } from '@/src/store';

export default function NetworkMonitor() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Resolve initial state immediately
    NetInfo.fetch().then((state) => {
      const online =
        state.isConnected === true && state.isInternetReachable !== false;
      if (!online) dispatch(setOffline());
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      const online =
        state.isConnected === true && state.isInternetReachable !== false;
      dispatch(online ? setOnline() : setOffline());
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}
