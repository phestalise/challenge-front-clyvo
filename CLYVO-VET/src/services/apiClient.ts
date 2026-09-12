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
  } catch (err) {
    // Falha de rede (timeout, CORS, proxy fora do ar) não gera resposta
    // HTTP nenhuma — sem logar aqui, esse tipo de falha ficava invisível no
    // console, diferente de um 400/404 (que aparece em vermelho sozinho).
    console.error(
      `[apiClient] ${options.method ?? "GET"} ${path} -> falha de rede:`,
      err,
    );

    throw new ApiError(
      "Não foi possível conectar à API. Verifique sua internet.",
      0,
    );
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();

  // Um 400/500 pode vir com corpo que não é JSON (texto puro, HTML de erro,
  // vazio) — sem o try/catch, o JSON.parse falhava antes do erro virar um
  // ApiError com mensagem legível, e a causa real do erro se perdia.
  let data: any;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    const message = extractErrorMessage(
      data,
      text || `Erro ${response.status} ao acessar a API.`,
    );

    // Loga o corpo real da resposta de erro — o stack trace que o
    // navegador imprime sozinho pra todo fetch com status de erro não
    // mostra isso, só o método/URL/status.
    console.error(
      `[apiClient] ${options.method ?? "GET"} ${path} -> ${response.status}:`,
      message,
    );

    throw new ApiError(message, response.status);
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
