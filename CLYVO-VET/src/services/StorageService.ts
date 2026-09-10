import AsyncStorage from "@react-native-async-storage/async-storage";

import { IStorage } from "../interfaces/IStorage";

class StorageService implements IStorage {
  async getData(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  async saveData(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }
}

export const storageService = new StorageService();
