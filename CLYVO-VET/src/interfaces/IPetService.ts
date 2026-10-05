import { Pet, Vaccine, Medication } from "../types";

export type HealthItem = Vaccine | Medication;

export interface IPetService {
  getAll(ownerId: string): Promise<Pet[]>;
  getById(id: string, ownerId: string): Promise<Pet | null>;
  create(pet: Pet): Promise<void>;
  update(pet: Pet): Promise<void>;
  saveLocalMeta(pet: Pet): Promise<void>;
  remove(id: string, ownerId: string): Promise<void>;
  createItem(petId: string, item: HealthItem): Promise<void>;
  updateItem(petId: string, item: HealthItem): Promise<void>;
  deleteItem(itemId: string): Promise<void>;
}
