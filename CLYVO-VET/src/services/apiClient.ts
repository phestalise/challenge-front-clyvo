import { API_BASE_URL } from "../config/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// A API devolve o formato padrão de erro de validação do ASP.NET Core
// (ProblemDetails): { title, status, errors: { Campo: ["mensagem", ...] } }.
function extractErrorMessage(data: any, fallback: string): string {
  if (!data) return fallback;

  if (data.errors && typeof data.errors === "object") {
    const mensagens = Object.values(data.errors).flat();
    if (mensagens.length) return mensagens.join(" ");
  }

  return data.title ?? data.message ?? fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique sua internet.",
      0,
    );
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(data, `Erro ${response.status} ao acessar a API.`),
      response.status,
    );
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
