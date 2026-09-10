import { apiClient } from "./apiClient";
import { storageService } from "./StorageService";
import { gerarIdNumerico } from "../utils/id";
import { ApiTutor } from "../types/api";

export interface NovoTutor {
  nome: string;
  email: string;
  telefone?: string | null;
  cpf: string;
  senha: string;
}

const GOOGLE_TUTOR_MAP_KEY = "@clyvo:google_tutor_map";

class TutorService {
  // Assim como Pet/Consulta/Medicacao, TUTOR não tem coluna IDENTITY — a API
  // exige um IdTutor numérico (> 0) gerado pelo cliente, sem auto-incremento.
  async register(dados: NovoTutor): Promise<ApiTutor> {
    return apiClient.post<ApiTutor>("/api/tutors", {
      idTutor: gerarIdNumerico(),
      ...dados,
    });
  }

  async login(email: string, senha: string): Promise<ApiTutor> {
    return apiClient.post<ApiTutor>("/api/tutors/login", {
      email: email.trim().toLowerCase(),
      senha,
    });
  }

  async getById(id: number): Promise<ApiTutor> {
    return apiClient.get<ApiTutor>(`/api/tutors/${id}`);
  }

  async getAll(): Promise<ApiTutor[]> {
    return apiClient.get<ApiTutor[]>("/api/tutors");
  }

  async findByEmail(email: string): Promise<ApiTutor | null> {
    const alvo = email.trim().toLowerCase();
    const tutores = await this.getAll();
    return tutores.find((t) => t.email?.trim().toLowerCase() === alvo) ?? null;
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
