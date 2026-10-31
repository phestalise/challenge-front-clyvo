import { apiClient } from "./apiClient";
import { storageService } from "./StorageService";
import { gerarIdNumerico } from "../utils/id";
import { ApiTutor, LoginResponse } from "../types/api";

export interface NovoTutor {
  nome: string;
  email: string;
  telefone?: string | null;
  cpf: string;
  senha: string;
}

const GOOGLE_TUTOR_MAP_KEY = "@clyvo:google_tutor_map";
const EMAIL_ID_MAP_KEY = "@clyvo:email_id_map";

class TutorService {
  // Assim como Pet/Consulta/Medicacao, TUTOR não tem coluna IDENTITY — a API
  // exige um IdTutor numérico (> 0) gerado pelo cliente, sem auto-incremento.
  async register(dados: NovoTutor, silent?: boolean): Promise<ApiTutor> {
    return apiClient.post<ApiTutor>("/api/tutors", {
      idTutor: gerarIdNumerico(),
      ...dados,
      // O formulário guarda o CPF formatado ("123.456.789-00") pra exibição;
      // a API espera só os 11 dígitos.
      cpf: dados.cpf.replace(/\D/g, ""),
    }, { silent });
  }

  async login(email: string, senha: string, silent?: boolean): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/api/tutors/login", {
      email: email.trim().toLowerCase(),
      senha,
    }, { silent });
  }

  async getById(id: number): Promise<ApiTutor> {
    return apiClient.get<ApiTutor>(`/api/tutors/${id}`);
  }

  async getAll(): Promise<ApiTutor[]> {
    const raw = await apiClient.get<ApiTutor[] | { items?: ApiTutor[]; content?: ApiTutor[] }>("/api/tutors");
    return Array.isArray(raw) ? raw : (raw?.items ?? raw?.content ?? []);
  }

  async findByEmail(email: string): Promise<ApiTutor | null> {
    const alvo = email.trim().toLowerCase();
    // Usa o filtro de email da API para não precisar listar todos os tutores.
    const raw = await apiClient.get<{ items?: ApiTutor[] }>(
      `/api/tutors?Email=${encodeURIComponent(alvo)}&RegistroRetornado=1`,
    );
    return raw?.items?.[0] ?? null;
  }

  // PUT costuma exigir a entidade completa — busca o tutor atual e mescla
  // as alterações antes de enviar, para não zerar campos não informados.
  async update(id: number, alteracoes: Partial<NovoTutor>): Promise<void> {
    const atual = await this.getById(id);

    await apiClient.put(`/api/tutors/${id}`, {
      idTutor: id,
      nome: atual.nome,
      email: atual.email,
      telefone: atual.telefone,
      cpf: atual.cpf,
      senha: atual.senha,
      ...alteracoes,
    });
  }

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/tutors/${id}`);
  }

  // Cache local do mapeamento email -> idTutor, para evitar GET /api/tutors
  // (endpoint de admin) no fallback do login quando o JWT não traz o idTutor.
  private async readEmailIdMap(): Promise<Record<string, number>> {
    const raw = await storageService.getData(EMAIL_ID_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  async cacheEmailTutorId(email: string, idTutor: number): Promise<void> {
    const map = await this.readEmailIdMap();
    map[email.trim().toLowerCase()] = idTutor;
    await storageService.saveData(EMAIL_ID_MAP_KEY, JSON.stringify(map));
  }

  async getCachedEmailTutorId(email: string): Promise<number | null> {
    const map = await this.readEmailIdMap();
    return map[email.trim().toLowerCase()] ?? null;
  }

  // Cache local do mapeamento uid do Firebase -> idTutor da API, para não
  // precisar listar/criar tutor a cada login com Google.
  private async readGoogleMap(): Promise<Record<string, number>> {
    const raw = await storageService.getData(GOOGLE_TUTOR_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  async getCachedGoogleTutorId(uid: string): Promise<number | null> {
    const map = await this.readGoogleMap();
    return map[uid] ?? null;
  }

  async cacheGoogleTutorId(uid: string, idTutor: number): Promise<void> {
    const map = await this.readGoogleMap();
    map[uid] = idTutor;
    await storageService.saveData(GOOGLE_TUTOR_MAP_KEY, JSON.stringify(map));
  }
}

export const tutorService = new TutorService();
