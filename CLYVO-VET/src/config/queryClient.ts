import { QueryClient } from "@tanstack/react-query";

// A API roda num plano gratuito (Render): dorme quando ociosa e responde
// devagar na primeira chamada. Por isso o cache é generoso — os dados só são
// buscados de novo quando o usuário puxa para atualizar ou depois de uma
// alteração, nunca por foco de tela ou reconexão.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      retryDelay: 2000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});
