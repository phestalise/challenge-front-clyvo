import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { Pet } from "../types";
import { storageService } from "../services/StorageService";

type NewVaccine = {
  name: string;
  date: string;
  nextDue: string;
};

export function useVaccines() {
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
      setError("Não foi possível carregar as vacinas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const addVaccine = useCallback(
    async (petId: string, vaccine: NewVaccine) => {
      setSaving(true);
      setError(null);

      try {
        const allPets = await storageService.getPets();

        const updated = allPets.map((p: Pet) => {
          if (p.id !== petId) return p;

          const vaccines = p.vaccines ?? [];

          vaccines.push({
            id: Date.now().toString(),
            name: vaccine.name,
            date: vaccine.date,
            nextDue: vaccine.nextDue,
            done: !!vaccine.date,
          });

          return { ...p, vaccines };
        });

        await storageService.savePets(updated);
        await load();

        return true;
      } catch {
        setError("Não foi possível salvar a vacina. Tente novamente.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [load]
  );

  const toggleDone = useCallback(
    async (petId: string, vaccineId: string) => {
      try {
        const allPets = await storageService.getPets();

        const updated = allPets.map((p: Pet) => {
          if (p.id !== petId) return p;

          return {
            ...p,
            vaccines: (p.vaccines ?? []).map((v) =>
              v.id === vaccineId ? { ...v, done: !v.done } : v
            ),
          };
        });

        await storageService.savePets(updated);
        await load();

        return true;
      } catch {
        setError("Não foi possível atualizar a vacina. Tente novamente.");
        return false;
      }
    },
    [load]
  );

  const removeVaccine = useCallback(
    async (petId: string, vaccineId: string) => {
      try {
        const allPets = await storageService.getPets();

        const updated = allPets.map((p: Pet) => {
          if (p.id !== petId) return p;

          return {
            ...p,
            vaccines: (p.vaccines ?? []).filter((v) => v.id !== vaccineId),
          };
        });

        await storageService.savePets(updated);
        await load();

        return true;
      } catch {
        setError("Não foi possível remover a vacina. Tente novamente.");
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
    addVaccine,
    toggleDone,
    removeVaccine,
  };
}
