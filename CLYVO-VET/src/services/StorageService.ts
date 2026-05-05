import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, Pet } from "../types";
import { IStorage } from "../interfaces/IStorage";

const KEYS = {
  USER: "@clyvo:user",
  PETS: "@clyvo:pets",
  LOGGED_IN: "@clyvo:loggedIn",
};

class StorageService implements IStorage {
  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  async savePets(pets: Pet[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.PETS, JSON.stringify(pets));
  }

  async getPets(): Promise<Pet[]> {
    const data = await AsyncStorage.getItem(KEYS.PETS);
    return data ? JSON.parse(data) : [];
  }

  async setLoggedIn(value: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.LOGGED_IN, JSON.stringify(value));
  }

  async getLoggedIn(): Promise<boolean> {
    const data = await AsyncStorage.getItem(KEYS.LOGGED_IN);
    return data ? JSON.parse(data) : false;
  }

  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER);
    await AsyncStorage.removeItem(KEYS.PETS);
    await AsyncStorage.removeItem(KEYS.LOGGED_IN);
  }
}

export const storageService = new StorageService();