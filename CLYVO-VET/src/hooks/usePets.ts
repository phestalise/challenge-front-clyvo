import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { petService } from "../services/PetService";
import { useAuth } from "./useAuth";
import { petKeys } from "./petCache";

export function usePets() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: petKeys.list(user?.id),
    queryFn: () => petService.getAll(user!.id),
    enabled: !!user,
  });

  const { refetch } = query;
  const reload = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    pets: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? "Não foi possível carregar os pets." : null,
    reload,
  };
}
