import { ApiError } from "../services/apiClient";
import { mapFirebaseAuthError } from "./authErrors";

// Unifica erros da API (ApiError, com .message já pronto pra exibir) e do
// Firebase (erro com .code) numa única mensagem pra mostrar na tela — sem
// isso, um erro de validação da API caía no fallback genérico do Firebase e
// escondia o motivo real (ex: "CPF deve ter 11 dígitos").
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return mapFirebaseAuthError((error as { code?: unknown })?.code);
}
