import AsyncStorage from '@react-native-async-storage/async-storage';

export const INSTALLATION_ID_KEY = '@installationId';

export const storeInstallationId = async (id: string): Promise<void> => {
  await AsyncStorage.setItem(INSTALLATION_ID_KEY, id);
};

export const getInstallationId = async (): Promise<string | null> => {
  return AsyncStorage.getItem(INSTALLATION_ID_KEY);
};
