import { useMutation } from "@tanstack/react-query";

import { Pet } from "../types";
import { petService } from "../services/PetService";
import { notificationService } from "../services/NotificationService";
import { usePetCache } from "./petCache";

// Agenda o próximo retorno do pet (dado guardado só no aparelho).
export function useUpdatePetSchedule() {
  const { applyPet } = usePetCache();

  const mutation = useMutation({
    mutationFn: async ({
      pet,
      nextCheckup,
    }: {
      pet: Pet;
      nextCheckup: string;
    }) => {
      const updated = { ...pet, nextCheckup };
      await petService.saveLocalMeta(updated);
      return updated;
    },
    onSuccess: (pet) => {
      applyPet(pet);
      notificationService
        .scheduleCheckupReminders(pet, { notifyIfImminent: true })
        .catch((err) =>
          console.warn("[notificações] agendamento falhou:", err),
        );
    },
  });

  return {
    saveSchedule: mutation.mutateAsync,
    saving: mutation.isPending,
  };
}
