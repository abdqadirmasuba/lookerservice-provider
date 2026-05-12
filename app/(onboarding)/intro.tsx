// File: app/(onboarding)/intro.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from 'react-native-heroicons/solid';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = '@hasSeenOnboarding';
const AUTO_SCROLL_INTERVAL = 3500;

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Build Your\nBusiness Profile',
    subtitle: 'Get Discovered by Clients',
    description:
      'Create a professional profile, list your services, and let thousands of clients find and book you instantly.',
    icon: <BuildingStorefrontIcon size={64} color="#2DA9E9" />,
    iconBg: '#E6F4FB',
  },
  {
    id: '2',
    title: 'Receive Bookings\n& Get Paid',
    subtitle: 'Earn on Your Terms',
    description:
      'Accept job requests, set your own availability, and receive secure payments seamlessly through the platform.',
    icon: <CurrencyDollarIcon size={64} color="#10B981" />,
    iconBg: '#D1FAE5',
  },
  {
    id: '3',
    title: 'Track Growth\n& Analytics',
    subtitle: 'Scale Your Business',
    description:
      'Monitor your earnings, manage client reviews, and use powerful insights to grow your service business.',
    icon: <ChartBarIcon size={64} color="#F57C1F" />,
    iconBg: '#FFF4E6',
  },
];

const SLIDES_COUNT = slides.length;
// Triple the slides so we can loop seamlessly in both directions
const EXTENDED_SLIDES = [...slides, ...slides, ...slides];
const START_INDEX = SLIDES_COUNT; // Begin at the first slide of the middle copy

export default function OnboardingScreen() {
  const router = useRouter();
  const [dotIndex, setDotIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(START_INDEX);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isResetting = useRef(false);

  const scrollToIndex = (index: number, animated: boolean) => {
    flatListRef.current?.scrollToIndex({ index, animated });
  };

  const startAutoScroll = () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    autoScrollTimer.current = setInterval(() => {
      if (isResetting.current) return;
      const next = currentIndexRef.current + 1;
      currentIndexRef.current = next;
      setDotIndex(next % SLIDES_COUNT);
      scrollToIndex(next, true);
    }, AUTO_SCROLL_INTERVAL);
  };

  useEffect(() => {
    // Initialise at the middle copy without animation
    scrollToIndex(START_INDEX, false);
    startAutoScroll();
    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMomentumScrollEnd = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    const realIndex = idx % SLIDES_COUNT;
    setDotIndex(realIndex);

    // Keep the position anchored to the middle copy
    if (idx >= SLIDES_COUNT * 2 || idx < SLIDES_COUNT) {
      isResetting.current = true;
      const resetTo = realIndex + SLIDES_COUNT;
      setTimeout(() => {
        scrollToIndex(resetTo, false);
        currentIndexRef.current = resetTo;
        isResetting.current = false;
      }, 50);
    } else {
      currentIndexRef.current = idx;
    }
  };

  const handleGetStarted = async () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(auth)/login');
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View
      style={{ width }}
      className="flex-1 items-center justify-center px-10 bg-white"
    >
      {/* Icon circle */}
      <View
        className="w-40 h-40 rounded-full items-center justify-center mb-10"
        style={{ backgroundColor: item.iconBg }}
      >
        {item.icon}
      </View>

      {/* Text content */}
      <Text className="text-gray-900 text-3xl font-bold text-center mb-3">
        {item.title}
      </Text>
      <Text className="text-primary-500 text-lg font-semibold text-center mb-5">
        {item.subtitle}
      </Text>
      <Text className="text-gray-500 text-base text-center leading-7">
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={EXTENDED_SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Footer */}
      <View className="px-8 pb-10">
        {/* Pagination dots */}
        <View className="flex-row items-center justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === dotIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === dotIndex ? '#F57C1F' : '#E5E7EB',
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        {/* Get Started button */}
        <TouchableOpacity
          onPress={handleGetStarted}
          className="bg-primary-500 py-4 rounded-full items-center shadow-lg"
        >
          <Text className="text-white font-bold text-base">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}