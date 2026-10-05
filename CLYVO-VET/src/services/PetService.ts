import { Pet, Vaccine, Medication } from "../types";
import { IPetService } from "../interfaces/IPetService";
import { ApiPet, ApiConsulta, ApiMedicacao } from "../types/api";
import { apiClient, ApiError } from "./apiClient";
import { petMetadataStore } from "./PetMetadataStore";
import { brDateToIso, isoDateToBr } from "../utils/dateConversion";

type Item = Vaccine | Medication;

function apiPetToPet(
  apiPet: ApiPet,
  nextCheckup: string,
  photoUri?: string,
): Pet {
  return {
    id: String(apiPet.idPet),
    ownerId: String(apiPet.idTutor),
    name: apiPet.nome,
    species: apiPet.especie,
    breed: apiPet.raca ?? "",
    birthDate: isoDateToBr(apiPet.dataNascimento),
    weight: apiPet.pesoKg ?? 0,
    vaccines: [],
    medications: [],
    nextCheckup,
    photoUri,
  };
}

// MEDICACAO não guarda se é vacina ou remédio; na ausência de metadado local
// (registros criados fora do app, ex: seed do banco), usa DOSE/FREQUENCIA
// vazios como indício de que é uma vacina.
function medicacaoToItem(
  m: ApiMedicacao,
  meta:
    | { type: "vaccine" | "medication"; done?: boolean; active?: boolean }
    | undefined,
): Item {
  const semDoseOuFrequencia = !m.dose && !m.frequencia;
  const type = meta?.type ?? (semDoseOuFrequencia ? "vaccine" : "medication");
  const startDate = isoDateToBr(m.dataInicio);
  const endDate = isoDateToBr(m.dataFim);

  if (type === "vaccine") {
    return {
      id: String(m.idMedicacao),
      type: "vaccine",
      name: m.nome,
      startDate,
      endDate,
      done: meta?.done ?? !!m.dataInicio,
    };
  }

  return {
    id: String(m.idMedicacao),
    type: "medication",
    name: m.nome,
    dose: m.dose ?? "",
    frequency: m.frequencia ?? "",
    startDate,
    endDate,
    active: meta?.active ?? true,
  };
}

function itemToMedicacaoPayload(item: Item, idPet: number) {
  const isVaccine = item.type === "vaccine";

  return {
    idMedicacao: Number(item.id),
    idPet,
    nome: item.name,
    dose: isVaccine ? null : (item as Medication).dose || null,
    frequencia: isVaccine ? null : (item as Medication).frequency || null,
    dataInicio: brDateToIso(item.startDate),
    dataFim: brDateToIso(item.endDate),
  };
}

function petToPayload(pet: Pet) {
  return {
    idPet: Number(pet.id),
    idTutor: Number(pet.ownerId),
    nome: pet.name,
    especie: pet.species,
    raca: pet.breed || null,
    dataNascimento: brDateToIso(pet.birthDate),
    pesoKg: pet.weight,
  };
}

function itemMetaOf(item: Item) {
  return item.type === "vaccine"
    ? { type: "vaccine" as const, done: item.done }
    : { type: "medication" as const, active: item.active };
}

async function notFoundToNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

class PetService {
  async getAll(ownerId: string): Promise<Pet[]> {
    const idTutor = Number(ownerId);
    if (!idTutor) return [];

    const apiPets = await apiClient.get<ApiPet[]>(`/api/pets/tutor/${idTutor}`);
    return Promise.all(apiPets.map((p) => this.hydrate(p)));
  }

  async getById(id: string, ownerId: string): Promise<Pet | null> {
    const idPet = Number(id);
    if (!idPet) return null;

    const apiPet = await notFoundToNull(
      apiClient.get<ApiPet>(`/api/pets/${idPet}`),
    );
    if (!apiPet || String(apiPet.idTutor) !== ownerId) return null;

    return this.hydrate(apiPet);
  }

  async create(pet: Pet): Promise<void> {
    await apiClient.post("/api/pets", petToPayload(pet));
    await this.saveLocalMeta(pet);
  }

  async update(pet: Pet): Promise<void> {
    await apiClient.put(`/api/pets/${Number(pet.id)}`, petToPayload(pet));
    await this.saveLocalMeta(pet);
  }

  // Foto e data do próximo retorno não existem na API: ficam só no aparelho.
  async saveLocalMeta(pet: Pet): Promise<void> {
    await petMetadataStore.setPetMeta(pet.id, {
      nextCheckup: pet.nextCheckup,
      photoUri: pet.photoUri,
    });
  }

  // Vacinas e medicamentos são registros da tabela MEDICACAO: cada operação
  // vira uma única chamada à API, sem precisar regravar o pet inteiro.
  async createItem(petId: string, item: Item): Promise<void> {
    await apiClient.post(
      "/api/medicacoes",
      itemToMedicacaoPayload(item, Number(petId)),
    );
    await petMetadataStore.setItemMeta(item.id, itemMetaOf(item));
  }

  async updateItem(petId: string, item: Item): Promise<void> {
    await apiClient.put(
      `/api/medicacoes/${item.id}`,
      itemToMedicacaoPayload(item, Number(petId)),
    );
    await petMetadataStore.setItemMeta(item.id, itemMetaOf(item));
  }

  async deleteItem(itemId: string): Promise<void> {
    await apiClient.delete(`/api/medicacoes/${itemId}`);
    await petMetadataStore.deleteItemMeta(itemId);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const idPet = Number(id);
    const pet = await this.getById(id, ownerId);
    if (!pet) return;

    for (const item of [...pet.vaccines, ...pet.medications]) {
      await apiClient.delete(`/api/medicacoes/${item.id}`);
      await petMetadataStore.deleteItemMeta(item.id);
    }

    const consultas = await apiClient.get<ApiConsulta[]>(
      `/api/consultas/pet/${idPet}`,
    );
    for (const consulta of consultas) {
      await apiClient.delete(`/api/consultas/${consulta.idConsulta}`);
    }

    await apiClient.delete(`/api/pets/${idPet}`);
    await petMetadataStore.deletePetMeta(id);
  }

  private async hydrate(apiPet: ApiPet): Promise<Pet> {
    const [meta, medicacoes] = await Promise.all([
      petMetadataStore.getPetMeta(String(apiPet.idPet)),
      apiClient.get<ApiMedicacao[]>(`/api/medicacoes/pet/${apiPet.idPet}`),
    ]);

    const pet = apiPetToPet(apiPet, meta.nextCheckup ?? "", meta.photoUri);

    const itemMetas = await Promise.all(
      medicacoes.map((m) =>
        petMetadataStore.getItemMeta(String(m.idMedicacao)),
      ),
    );

    medicacoes.forEach((m, i) => {
      const item = medicacaoToItem(m, itemMetas[i]);
      if (item.type === "vaccine") pet.vaccines.push(item);
      else pet.medications.push(item);
    });

    return pet;
  }
}

export const petService: IPetService = new PetService();
