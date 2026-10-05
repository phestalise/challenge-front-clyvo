import { useCallback } from "react";

import { gerarIdNumerico } from "../utils/id";
import { usePetCache } from "./petCache";
import { usePets } from "./usePets";
import { useHealthItemMutations } from "./useHealthItemMutations";

type NewMedication = {
  name: string;
  dose: string;
  frequency: string;
  startDate: string;
  endDate: string;
};

export function useMedications() {
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

  const addMedication = useCallback(
    async (petId: string, medication: NewMedication) => {
      try {
        await createItem({
          petId,
          item: {
            id: gerarIdNumerico().toString(),
            type: "medication",
            name: medication.name,
            dose: medication.dose,
            frequency: medication.frequency,
            startDate: medication.startDate,
            endDate: medication.endDate,
            active: true,
          },
        });
        return true;
      } catch {
        return false;
      }
    },
    [createItem],
  );

  const toggleActive = useCallback(
    async (petId: string, medicationId: string) => {
      const medication = findPet(petId)?.medications.find(
        (m) => m.id === medicationId,
      );
      if (!medication) return false;

      try {
        await updateItem({
          petId,
          item: { ...medication, active: !medication.active },
        });
        return true;
      } catch {
        return false;
      }
    },
    [findPet, updateItem],
  );

  const removeMedication = useCallback(
    async (petId: string, medicationId: string) => {
      try {
        await deleteItem({ petId, itemId: medicationId });
        return true;
      } catch {
        return false;
      }
    },
    [deleteItem],
  );

  let error = loadError ? "Não foi possível carregar os medicamentos." : null;
  if (createFailed)
    error = "Não foi possível salvar o medicamento. Tente novamente.";
  else if (updateFailed)
    error = "Não foi possível atualizar o medicamento. Tente novamente.";
  else if (deleteFailed)
    error = "Não foi possível remover o medicamento. Tente novamente.";

  return {
    pets,
    loading,
    error,
    saving,
    reload,
    addMedication,
    toggleActive,
    removeMedication,
  };
}
