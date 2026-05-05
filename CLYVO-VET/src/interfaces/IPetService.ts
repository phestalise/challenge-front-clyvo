import { Pet } from "../types";

export interface IPetService {
  getAll(): Promise<Pet[]>;
  getById(id: string): Promise<Pet | null>;
  save(pet: Pet): Promise<void>;
  remove(id: string): Promise<void>;
  getHealthScore(pet: Pet): number;
}