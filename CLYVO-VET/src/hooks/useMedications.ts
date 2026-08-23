import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { Pet } from "../types";
import { storageService } from "../services/StorageService";

type NewMedication = {
  name: string;
  dosage: string;
  frequency: string;
  endDate: string;
};

export function useMedications() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await storageService.getPets();
      setPets(Array.isArray(data) ? data : []);
    } catch {
      setError("Não foi possível carregar os medicamentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const addMedication = useCallback(
    async (petId: string, medication: NewMedication) => {
      setSaving(true);
      setError(null);

      try {
        const allPets = await storageService.getPets();

        const updated = allPets.map((p: Pet) => {
          if (p.id !== petId) return p;

          const medications = p.medications ?? [];

          medications.push({
            id: Date.now().toString(),
            name: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency,
            startDate: "",
            endDate: medication.endDate,
            active: true,
          });

          return { ...p, medications };
        });

        await storageService.savePets(updated);
        await load();

        return true;
      } catch {
        setError("Não foi possível salvar o medicamento. Tente novamente.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [load]
  );

  const toggleActive = useCallback(
    async (petId: string, medicationId: string) => {
      try {
        const allPets = await storageService.getPets();

        const updated = allPets.map((p: Pet) => {
          if (p.id !== petId) return p;

          return {
            ...p,
            medications: (p.medications ?? []).map((m) =>
              m.id === medicationId ? { ...m, active: !m.active } : m
            ),
          };
        });

        await storageService.savePets(updated);
        await load();

        return true;
      } catch {
        setError("Não foi possível atualizar o medicamento. Tente novamente.");
        return false;
      }
    },
    [load]
  );

  const removeMedication = useCallback(
    async (petId: string, medicationId: string) => {
      try {
        const allPets = await storageService.getPets();

        const updated = allPets.map((p: Pet) => {
          if (p.id !== petId) return p;

          return {
            ...p,
            medications: (p.medications ?? []).filter(
              (m) => m.id !== medicationId
            ),
          };
        });

        await storageService.savePets(updated);
        await load();

        return true;
      } catch {
        setError("Não foi possível remover o medicamento. Tente novamente.");
        return false;
      }
    },
    [load]
  );

  return {
    pets,
    loading,
    error,
    saving,
    reload: load,
    addMedication,
    toggleActive,
    removeMedication,
  };
}
