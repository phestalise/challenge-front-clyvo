import { User, Pet } from "../types";

export interface IStorage {
  saveUser(user: User): Promise<void>;
  getUser(): Promise<User | null>;
  savePets(pets: Pet[]): Promise<void>;
  getPets(): Promise<Pet[]>;
  setLoggedIn(value: boolean): Promise<void>;
  getLoggedIn(): Promise<boolean>;
  clearAll(): Promise<void>;
}