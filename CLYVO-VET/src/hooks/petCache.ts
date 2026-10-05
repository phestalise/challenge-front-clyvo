import { useCallback } from "react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

import { Pet } from "../types";
import { useAuth } from "./useAuth";

export const petKeys = {
  list: (userId?: string) => ["pets", "list", userId] as const,
  detail: (userId?: string, petId?: string) =>
    ["pets", "detail", userId, petId] as const,
};

// Depois de uma escrita bem-sucedida na API, o cache do TanStack Query recebe
// o novo estado do pet — assim as telas atualizam na hora, sem refazer o
// carregamento de todos os pets (a API é gratuita e lenta).
export function applyPetToCache(
  queryClient: QueryClient,
  userId: string | undefined,
  pet: Pet,
) {
  queryClient.setQueryData<Pet[]>(petKeys.list(userId), (current) => {
    if (!current) return current;
    return current.some((p) => p.id === pet.id)
      ? current.map((p) => (p.id === pet.id ? pet : p))
      : [...current, pet];
  });
  queryClient.setQueryData(petKeys.detail(userId, pet.id), pet);
}

export function removePetFromCache(
  queryClient: QueryClient,
  userId: string | undefined,
  petId: string,
) {
  queryClient.setQueryData<Pet[]>(petKeys.list(userId), (current) =>
    current?.filter((p) => p.id !== petId),
  );
  queryClient.removeQueries({ queryKey: petKeys.detail(userId, petId) });
}

export function usePetCache() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  const findPet = useCallback(
    (petId: string) =>
      queryClient
        .getQueryData<Pet[]>(petKeys.list(userId))
        ?.find((p) => p.id === petId) ??
      queryClient.getQueryData<Pet>(petKeys.detail(userId, petId)),
    [queryClient, userId],
  );

  const applyPet = useCallback(
    (pet: Pet) => applyPetToCache(queryClient, userId, pet),
    [queryClient, userId],
  );

  const removePet = useCallback(
    (petId: string) => removePetFromCache(queryClient, userId, petId),
    [queryClient, userId],
  );

  return { userId, findPet, applyPet, removePet };
}
