import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeftIcon, MoonIcon } from 'react-native-heroicons/outline';

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <StatusBar style="dark" />

      <View className="flex-row items-center px-4 py-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <ArrowLeftIcon size={22} color="#F57C1F" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800 dark:text-white">App Settings</Text>
      </View>

      <ScrollView className="flex-1 mt-4 px-4" showsVerticalScrollIndicator={false}>
        <View className="mb-4">
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
            Appearance
          </Text>
          <View className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-slate-700">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-sky-100 dark:bg-sky-900/20 rounded-2xl items-center justify-center mr-3">
                  <MoonIcon size={20} color="#0284C7" />
                </View>
                <View>
                  <Text className="font-semibold text-slate-900 dark:text-white">Dark Mode</Text>
                  <Text className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                    Switch between light and dark appearance.
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E7EB', true: '#38BDF8' }}
                thumbColor={darkMode ? '#0284C7' : '#fff'}
              />
            </View>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
