import { Pet } from "../types";

export interface IStorage {
  savePets(pets: Pet[]): Promise<void>;
  getPets(): Promise<Pet[]>;
}
