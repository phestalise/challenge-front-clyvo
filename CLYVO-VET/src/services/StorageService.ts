import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageService {
  async getUser(): Promise<any | null> {
    const raw = await AsyncStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }

  async saveUser(user: any): Promise<void> {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }

  async getPets(): Promise<any[]> {
    const raw = await AsyncStorage.getItem("pets");
    return raw ? JSON.parse(raw) : [];
  }

  async savePets(pets: any[]): Promise<void> {
    await AsyncStorage.setItem("pets", JSON.stringify(pets));
  }

  async getLoggedIn(): Promise<boolean> {
    const raw = await AsyncStorage.getItem("loggedIn");
    return raw ? JSON.parse(raw) : false;
  }

  async setLoggedIn(value: boolean): Promise<void> {
    await AsyncStorage.setItem("loggedIn", JSON.stringify(value));
  }

  async getData(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  async saveData(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }
}

export const storageService = new StorageService();