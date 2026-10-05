import { useCallback } from "react";

import { gerarIdNumerico } from "../utils/id";
import { usePetCache } from "./petCache";
import { usePets } from "./usePets";
import { useHealthItemMutations } from "./useHealthItemMutations";

type NewVaccine = {
  name: string;
  startDate: string;
  endDate: string;
};

export function useVaccines() {
  const { pets, loading, error: loadError, reload } = usePets();
  const { findPet } = usePetCache();
  const {
    createItem,
    updateItem,
    deleteItem,
    saving,
    createFailed,
    updateFailed,
    deleteFailed,
  } = useHealthItemMutations();

  const addVaccine = useCallback(
    async (petId: string, vaccine: NewVaccine) => {
      try {
        await createItem({
          petId,
          item: {
            id: gerarIdNumerico().toString(),
            type: "vaccine",
            name: vaccine.name,
            startDate: vaccine.startDate,
            endDate: vaccine.endDate,
            done: !!vaccine.startDate,
          },
        });
        return true;
      } catch {
        return false;
      }
    },
    [createItem],
  );

  const toggleDone = useCallback(
    async (petId: string, vaccineId: string) => {
      const vaccine = findPet(petId)?.vaccines.find((v) => v.id === vaccineId);
      if (!vaccine) return false;

      try {
        await updateItem({
          petId,
          item: { ...vaccine, done: !vaccine.done },
        });
        return true;
      } catch {
        return false;
      }
    },
    [findPet, updateItem],
  );

  const removeVaccine = useCallback(
    async (petId: string, vaccineId: string) => {
      try {
        await deleteItem({ petId, itemId: vaccineId });
        return true;
      } catch {
        return false;
      }
    },
    [deleteItem],
  );

  let error = loadError ? "Não foi possível carregar as vacinas." : null;
  if (createFailed)
    error = "Não foi possível salvar a vacina. Tente novamente.";
  else if (updateFailed)
    error = "Não foi possível atualizar a vacina. Tente novamente.";
  else if (deleteFailed)
    error = "Não foi possível remover a vacina. Tente novamente.";

  return {
    pets,
    loading,
    error,
    saving,
    reload,
    addVaccine,
    toggleDone,
    removeVaccine,
  };
}
