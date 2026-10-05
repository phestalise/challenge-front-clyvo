import { Pet } from "../types";

/** Percentual de vacinas aplicadas do pet (100 quando não há vacinas). */
export function getHealthScore(pet: Pet): number {
  if (!pet.vaccines || pet.vaccines.length === 0) return 100;

  const done = pet.vaccines.filter((v) => v.done).length;
  return Math.round((done / pet.vaccines.length) * 100);
}
