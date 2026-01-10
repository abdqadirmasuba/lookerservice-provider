// File: app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeSolid,
  ClipboardDocumentListIcon as ClipboardSolid,
  CalendarDaysIcon as CalendarSolid,
  ChatBubbleLeftRightIcon as ChatSolid,
  UserCircleIcon as UserSolid,
} from 'react-native-heroicons/solid';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F57C1F',
        tabBarInactiveTintColor: isDark ? '#94A3B8' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderTopColor: isDark ? '#334155' : '#E5E7EB',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <HomeSolid size={size} color={color} />
            ) : (
              <HomeIcon size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <ClipboardSolid size={size} color={color} />
            ) : (
              <ClipboardDocumentListIcon size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <CalendarSolid size={size} color={color} />
            ) : (
              <CalendarDaysIcon size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <ChatSolid size={size} color={color} />
            ) : (
              <ChatBubbleLeftRightIcon size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <UserSolid size={size} color={color} />
            ) : (
              <UserCircleIcon size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}