import { Pet } from "../types";
import { IPetService } from "../../../interfaces/IPetService";
import { storageService } from "./StorageService";

class PetService implements IPetService {
  async getAll(): Promise<Pet[]> {
    return storageService.getPets();
  }

  async getById(id: string): Promise<Pet | null> {
    const pets = await storageService.getPets();
    return pets.find((p) => p.id === id) ?? null;
  }

  async save(pet: Pet): Promise<void> {
    const pets = await storageService.getPets();
    const idx = pets.findIndex((p) => p.id === pet.id);
    if (idx >= 0) pets[idx] = pet;
    else pets.push(pet);
    await storageService.savePets(pets);
  }

  async remove(id: string): Promise<void> {
    const pets = await storageService.getPets();
    await storageService.savePets(pets.filter((p) => p.id !== id));
  }

  getHealthScore(pet: Pet): number {
    if (!pet.vaccines || pet.vaccines.length === 0) return 100;
    const done = pet.vaccines.filter((v) => v.done).length;
    return Math.round((done / pet.vaccines.length) * 100);
  }
}

export const petService = new PetService();