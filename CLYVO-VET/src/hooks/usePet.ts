import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Pet } from "../types";
import { petService } from "../services/PetService";
import { useAuth } from "./useAuth";
import { petKeys, usePetCache } from "./petCache";

export function usePet(petId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { applyPet, removePet } = usePetCache();

  const query = useQuery({
    queryKey: petKeys.detail(user?.id, petId),
    queryFn: () => petService.getById(petId!, user!.id),
    enabled: !!user && !!petId,
    // Reaproveita o pet já carregado na lista, evitando uma nova ida à API.
    initialData: () =>
      queryClient
        .getQueryData<Pet[]>(petKeys.list(user?.id))
        ?.find((p) => p.id === petId),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(petKeys.list(user?.id))?.dataUpdatedAt,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Pet) => {
      if (petId) await petService.update(data);
      else await petService.create(data);
      return data;
    },
    onSuccess: applyPet,
  });

  const metaMutation = useMutation({
    mutationFn: async (data: Pet) => {
      await petService.saveLocalMeta(data);
      return data;
    },
    onSuccess: applyPet,
  });

  const removeMutation = useMutation({
    mutationFn: () => petService.remove(petId!, user!.id),
    onSuccess: () => petId && removePet(petId),
  });

  const { refetch } = query;
  const reload = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const save = useCallback(
    async (data: Pet) => {
      try {
        await saveMutation.mutateAsync(data);
        return true;
      } catch (err) {
        console.error("[usePet] Falha ao salvar pet:", err);
        return false;
      }
    },
    [saveMutation],
  );

  // Foto e retorno agendado só existem no aparelho — não passam pela API.
  const saveLocalData = useCallback(
    async (data: Pet) => {
      try {
        await metaMutation.mutateAsync(data);
        return true;
      } catch {
        return false;
      }
    },
    [metaMutation],
  );

  const remove = useCallback(async () => {
    if (!petId || !user) return false;

    try {
      await removeMutation.mutateAsync();
      return true;
    } catch {
      return false;
    }
  }, [petId, user, removeMutation]);

  let error: string | null = null;
  if (query.isError) error = "Não foi possível carregar os dados do pet.";
  else if (saveMutation.isError)
    error = "Não foi possível salvar o pet. Tente novamente.";
  else if (removeMutation.isError)
    error = "Não foi possível remover o pet. Tente novamente.";

  return {
    pet: query.data ?? null,
    loading: query.isLoading,
    saving: saveMutation.isPending,
    error,
    reload,
    save,
    saveLocalData,
    remove,
  };
}
