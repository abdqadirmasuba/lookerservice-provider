import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as Localization from 'expo-localization';
import * as Network from 'expo-network';
import { apiRequests } from './apiRequest';
import { getProviderInstallationId, storeProviderInstallationId } from './installationStorage';

function normalizeNetworkType(type?: string): string {
  const normalized = type?.toLowerCase?.();
  return normalized === 'wifi'
    ? 'wifi'
    : normalized === 'cellular'
    ? 'cellular'
    : normalized === 'none'
    ? 'none'
    : 'unknown';
}

async function getBatteryLevel(): Promise<number> {
  try {
    if (typeof (Device as any).getBatteryLevelAsync === 'function') {
      const level = await (Device as any).getBatteryLevelAsync();
      return typeof level === 'number' && level >= 0 && level <= 1 ? level : 0;
    }
    if (typeof (Device as any).batteryLevel === 'number') {
      return (Device as any).batteryLevel;
    }
  } catch {
    // ignore and fallback
  }
  return 0;
}

async function getCityAndCountry(): Promise<{ city: string; country: string }> {
  const locales = Localization.getLocales();
  const locale = locales?.[0]?.languageTag ?? 'en-US';
  const defaultCountry = locale.split('-')[1] ?? '';
  return { city: '', country: defaultCountry };
}

export async function ensureInstallationId(): Promise<string | null> {
  try {
    const existingId = await getProviderInstallationId();
    if (existingId) {
      return existingId;
    }

      const appVersion = Application.nativeApplicationVersion ?? '1.0.0';
    const buildNumber = Application.nativeBuildVersion ?? '1';
    const deviceModel = Device.modelName || Device.deviceName || 'Unknown';
    const deviceName = Device.deviceName || Device.modelName || 'Unknown';
    const osVersion = Device.osVersion || 'unknown';

    const locales = Localization.getLocales();
    const locale = locales?.[0]?.languageTag ?? 'en-US';
    const calendars = Localization.getCalendars();
    const timeZone = calendars?.[0]?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';

    const { city, country } = await getCityAndCountry();
    const networkState = await Network.getNetworkStateAsync();
    const carrier = '';
    const batteryLevel = await getBatteryLevel();

    const payload = {
      app_type: 'provider',
      app_version: appVersion,
      build_number: buildNumber,
      platform: Platform.OS,
      device_model: deviceModel,
      device_name: deviceName,
      os_version: osVersion,
      locale,
      time_zone: timeZone,
      country,
      city,
      network_type: normalizeNetworkType(networkState.type),
      carrier,
      device_info: { battery_level: batteryLevel },
    };

    const response = await apiRequests.post('/installations', payload);
    const body = response?.data;
    const installationId = body?.data?.installation_id;
    if (body?.success && installationId) {
      await storeProviderInstallationId(installationId);
      return installationId;
    }
    return null;
  } catch (error) {
    console.error('Installation registration failed:', error);
    return null;
  }
}

export async function sendInstallationHeartbeat(installationId: string): Promise<void> {
  if (!installationId) {
    return;
  }

  try {
    const appVersion = Application.nativeApplicationVersion ?? '1.0.0';
    const buildNumber = Application.nativeBuildVersion ?? '1';
    const batteryLevel = await getBatteryLevel();

    await apiRequests.patch(`/installations/${installationId}/heartbeat`, {
      app_version: appVersion,
      build_number: buildNumber,
      device_info: { battery_level: batteryLevel },
    });
  } catch (error) {
    console.error('Installation heartbeat failed:', error);
  }
}
