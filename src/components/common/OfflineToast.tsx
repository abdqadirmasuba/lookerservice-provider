// File: src/components/common/OfflineToast.tsx
// Slides in from the top when the device goes offline, slides out when back online.
// Rendered at root level with absolute positioning so it overlays all screens.

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiIcon } from 'react-native-heroicons/outline';
import { useSelector } from 'react-redux';
import type { RootState } from '@/src/store';

export default function OfflineToast() {
  const isOnline = useSelector((state: RootState) => state.network?.isOnline ?? true);
  const { top } = useSafeAreaInsets();
  const translateY = useSharedValue(-120);

  useEffect(() => {
    if (!isOnline) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
    } else {
      translateY.value = withTiming(-120, { duration: 350 });
    }
  }, [isOnline]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[styles.container, { paddingTop: top + 8 }, animatedStyle]}
      pointerEvents="none"
    >
      <View style={styles.card}>
        <WifiIcon size={16} color="#fff" strokeWidth={2.5} />
        <Text style={styles.text}>
          Internet connection appears to be offline. Please check your connection.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
});
