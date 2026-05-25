import AsyncStorage from '@react-native-async-storage/async-storage';

export const PROVIDER_INSTALLATION_ID_KEY = '@providerInstallationId';

export const storeProviderInstallationId = async (id: string): Promise<void> => {
  await AsyncStorage.setItem(PROVIDER_INSTALLATION_ID_KEY, id);
};

export const getProviderInstallationId = async (): Promise<string | null> => {
  return AsyncStorage.getItem(PROVIDER_INSTALLATION_ID_KEY);
};

export const clearProviderInstallationId = async (): Promise<void> => {
  await AsyncStorage.removeItem(PROVIDER_INSTALLATION_ID_KEY);
};
