// Espelha o JSON devolvido pela API real (https://clyvovet-api-nnke.onrender.com),
// que por sua vez espelha as tabelas TUTOR/PET/CONSULTA/MEDICACAO do Oracle.

export interface ApiTutor {
  idTutor: number;
  nome: string;
  email: string;
  telefone: string | null;
  cpf: string;
  senha?: string;
}

export interface ApiPet {
  idPet: number;
  idTutor: number;
  nome: string;
  especie: string;
  raca: string | null;
  dataNascimento: string | null;
  pesoKg: number | null;
}

export interface ApiConsulta {
  idConsulta: number;
  idPet: number;
  dataConsulta: string;
  veterinario: string;
  observacoes: string | null;
}

export interface ApiMedicacao {
  idMedicacao: number;
  idPet: number;
  nome: string;
  dose: string | null;
  frequencia: string | null;
  dataInicio: string | null;
  dataFim: string | null;
}
