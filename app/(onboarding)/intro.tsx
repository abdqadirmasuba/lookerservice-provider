// File: app/(onboarding)/intro.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  SparklesIcon,
} from 'react-native-heroicons/solid';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = '@hasSeenOnboarding';
const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Welcome to LookerService',
    subtitle: 'Your Business, Your Success',
    description: 'Join thousands of service providers growing their business and reaching more clients every day.',
    icon: <SparklesIcon size={80} color="#FFFFFF" />,
  },
  {
    id: '2',
    title: 'Register Your Services',
    subtitle: 'Showcase Your Expertise',
    description: 'Create a professional business profile, list your services, and let clients find you easily.',
    icon: <BuildingStorefrontIcon size={80} color="#FFFFFF" />,
  },
  {
    id: '3',
    title: 'Get Bookings & Earn',
    subtitle: 'Grow Your Income',
    description: 'Receive booking requests, accept jobs, and get paid securely through our platform.',
    icon: <CurrencyDollarIcon size={80} color="#FFFFFF" />,
  },
  {
    id: '4',
    title: 'Track Your Performance',
    subtitle: 'Monitor Your Growth',
    description: 'Access detailed analytics, manage bookings, and build your reputation with client reviews.',
    icon: <ChartBarIcon size={80} color="#FFFFFF" />,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (isAutoScrollEnabled) {
      autoScrollTimer.current = setInterval(() => {
        if (currentIndex < slides.length - 1) {
          slidesRef.current?.scrollToIndex({
            index: currentIndex + 1,
            animated: true,
          });
        } else {
          // Loop back to first slide
          slidesRef.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        }
      }, AUTO_SCROLL_INTERVAL);
    }

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentIndex, isAutoScrollEnabled]);

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    // Disable auto-scroll when user manually navigates
    setIsAutoScrollEnabled(false);

    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleSkip();
    }
  };

  const handleBack = () => {
    // Disable auto-scroll when user manually navigates
    setIsAutoScrollEnabled(false);

    if (currentIndex > 0) {
      slidesRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View style={{ width }} className="flex-1">
        <LinearGradient
          colors={['#F57C1F', '#E06A0F', '#B8570C']}
          className="flex-1 items-center justify-center px-8"
        >
          {/* Icon Container */}
          <View className="w-40 h-40 bg-white/20 rounded-full items-center justify-center mb-12 backdrop-blur-lg shadow-2xl">
            <View className="w-36 h-36 bg-white/10 rounded-full items-center justify-center">
              {item.icon}
            </View>
          </View>

          {/* Content */}
          <View className="items-center">
            <Text className="text-white text-4xl font-bold text-center mb-4">
              {item.title}
            </Text>
            <Text className="text-white/90 text-xl font-semibold text-center mb-6">
              {item.subtitle}
            </Text>
            <Text className="text-white/80 text-base text-center leading-7 px-4">
              {item.description}
            </Text>
          </View>

          {/* Auto-scroll indicator */}
          {isAutoScrollEnabled && (
            <View className="absolute bottom-40 items-center">
              <View className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-lg">
                <Text className="text-white/80 text-xs">Auto-scrolling...</Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      <StatusBar style="light" />

      {/* Skip Button */}
      <View className="absolute top-12 right-6 z-10">
        <TouchableOpacity
          onPress={handleSkip}
          className="bg-white/20 px-6 py-3 rounded-full backdrop-blur-lg"
        >
          <Text className="text-white font-bold">Skip Intro</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        scrollEnabled={!isAutoScrollEnabled} // Disable manual scroll during auto-scroll
      />

      {/* Footer */}
      <View className="px-8 pb-8">
        {/* Pagination Dots */}
        <View className="flex-row items-center justify-center mb-8">
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index.toString()}
                className="h-2 rounded-full bg-white mx-1"
                style={{
                  width: dotWidth,
                  opacity,
                }}
              />
            );
          })}
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row items-center justify-between">
          {/* Back Button */}
          <TouchableOpacity
            onPress={handleBack}
            disabled={currentIndex === 0}
            className={`flex-1 mr-3 py-4 rounded-full border-2 border-white items-center ${
              currentIndex === 0 ? 'opacity-30' : 'opacity-100'
            }`}
          >
            <Text className="text-white font-bold text-base">Back</Text>
          </TouchableOpacity>

          {/* Next/Get Started Button */}
          <TouchableOpacity
            onPress={handleNext}
            className="flex-1 ml-3 bg-white py-4 rounded-full items-center shadow-lg"
          >
            <Text className="text-primary-500 font-bold text-base">
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}