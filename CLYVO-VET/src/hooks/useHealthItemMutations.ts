import { useMutation } from "@tanstack/react-query";

import { Pet, Vaccine, Medication } from "../types";
import { petService } from "../services/PetService";
import { notificationService } from "../services/NotificationService";
import { usePetCache } from "./petCache";

type HealthItem = Vaccine | Medication;

type ItemPayload = { petId: string; item: HealthItem };

function withItem(pet: Pet, item: HealthItem): Pet {
  if (item.type === "vaccine") {
    const exists = pet.vaccines.some((v) => v.id === item.id);
    return {
      ...pet,
      vaccines: exists
        ? pet.vaccines.map((v) => (v.id === item.id ? item : v))
        : [...pet.vaccines, item],
    };
  }

  const exists = pet.medications.some((m) => m.id === item.id);
  return {
    ...pet,
    medications: exists
      ? pet.medications.map((m) => (m.id === item.id ? item : m))
      : [...pet.medications, item],
  };
}

function withoutItem(pet: Pet, itemId: string): Pet {
  return {
    ...pet,
    vaccines: pet.vaccines.filter((v) => v.id !== itemId),
    medications: pet.medications.filter((m) => m.id !== itemId),
  };
}

// Escrita de vacinas e medicamentos (tabela MEDICACAO): cada operação chama a
// API uma vez, atualiza o cache do TanStack Query com o resultado e mantém os
// lembretes locais (notificações) alinhados com o registro.
export function useHealthItemMutations() {
  const { findPet, applyPet } = usePetCache();

  const saveLocally = (petId: string, item: HealthItem, isNew: boolean) => {
    const pet = findPet(petId);
    if (!pet) return;

    applyPet(withItem(pet, item));
    notificationService
      .scheduleHealthReminders(petId, pet.name, item, {
        notifyIfImminent: isNew,
      })
      .catch((err) => console.warn("[notificações] agendamento falhou:", err));
  };

  const createItem = useMutation({
    mutationFn: async ({ petId, item }: ItemPayload) => {
      await petService.createItem(petId, item);
    },
    onSuccess: (_data, { petId, item }) => saveLocally(petId, item, true),
  });

  const updateItem = useMutation({
    mutationFn: async ({ petId, item }: ItemPayload) => {
      await petService.updateItem(petId, item);
    },
    onSuccess: (_data, { petId, item }) => saveLocally(petId, item, false),
  });

  const deleteItem = useMutation({
    mutationFn: async ({ itemId }: { petId: string; itemId: string }) => {
      await petService.deleteItem(itemId);
    },
    onSuccess: (_data, { petId, itemId }) => {
      const pet = findPet(petId);
      if (pet) applyPet(withoutItem(pet, itemId));
      notificationService
        .cancelHealthReminders(itemId)
        .catch((err) =>
          console.warn("[notificações] cancelamento falhou:", err),
        );
    },
  });

  return {
    createItem: createItem.mutateAsync,
    updateItem: updateItem.mutateAsync,
    deleteItem: deleteItem.mutateAsync,
    saving: createItem.isPending,
    createFailed: createItem.isError,
    updateFailed: updateItem.isError,
    deleteFailed: deleteItem.isError,
  };
}
