import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeSolid,
  ClipboardDocumentListIcon as ClipboardSolid,
  CalendarDaysIcon as CalendarSolid,
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
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 12,
          paddingTop: 8,
          paddingHorizontal: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
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