import { useEffect } from "react";

import { notificationService } from "../services/NotificationService";
import { usePets } from "./usePets";

// Mantém os lembretes locais do aparelho alinhados com os dados da API sempre
// que a lista de pets muda (carregamento, atualização ou alteração feita
// pelo usuário). Roda uma vez, no topo do app autenticado.
export function useHealthReminders() {
  const { pets } = usePets();

  useEffect(() => {
    if (pets.length === 0) return;

    notificationService
      .syncHealthReminders(pets)
      .catch((err) =>
        console.warn("[notificações] sincronização falhou:", err),
      );
  }, [pets]);
}
