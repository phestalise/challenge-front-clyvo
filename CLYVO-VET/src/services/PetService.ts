import { Pet, Vaccine, Medication } from "../types";
import { IPetService } from "../interfaces/IPetService";
import { ApiPet, ApiConsulta, ApiMedicacao } from "../types/api";
import { apiClient, ApiError } from "./apiClient";
import { petMetadataStore } from "./PetMetadataStore";
import { brDateToIso, isoDateToBr } from "../utils/dateConversion";

type Item = Vaccine | Medication;

function apiPetToPet(apiPet: ApiPet, nextCheckup: string): Pet {
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
  };
}

// MEDICACAO não guarda se é vacina ou remédio; na ausência de metadado local
// (registros criados fora do app, ex: seed do banco), usa DOSE/FREQUENCIA
// vazios como indício de que é uma vacina.
function medicacaoToItem(
  m: ApiMedicacao,
  meta: { type: "vaccine" | "medication"; done?: boolean; active?: boolean } | undefined,
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

    const apiPet = await notFoundToNull(apiClient.get<ApiPet>(`/api/pets/${idPet}`));
    if (!apiPet || String(apiPet.idTutor) !== ownerId) return null;

    return this.hydrate(apiPet);
  }

  async save(pet: Pet): Promise<void> {
    const idPet = Number(pet.id);
    const idTutor = Number(pet.ownerId);

    const payload = {
      idPet,
      idTutor,
      nome: pet.name,
      especie: pet.species,
      raca: pet.breed || null,
      dataNascimento: brDateToIso(pet.birthDate),
      pesoKg: pet.weight,
    };

    const existing = await notFoundToNull(apiClient.get<ApiPet>(`/api/pets/${idPet}`));

    if (existing) {
      await apiClient.put(`/api/pets/${idPet}`, payload);
    } else {
      await apiClient.post("/api/pets", payload);
    }

    await petMetadataStore.setPetMeta(pet.id, { nextCheckup: pet.nextCheckup });
    await this.syncItems(idPet, [...(pet.vaccines ?? []), ...(pet.medications ?? [])]);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const idPet = Number(id);
    const pet = await this.getById(id, ownerId);
    if (!pet) return;

    for (const item of [...pet.vaccines, ...pet.medications]) {
      await apiClient.delete(`/api/medicacoes/${item.id}`);
      await petMetadataStore.deleteItemMeta(item.id);
    }

    const consultas = await apiClient.get<ApiConsulta[]>(`/api/consultas/pet/${idPet}`);
    for (const consulta of consultas) {
      await apiClient.delete(`/api/consultas/${consulta.idConsulta}`);
    }

    await apiClient.delete(`/api/pets/${idPet}`);
    await petMetadataStore.deletePetMeta(id);
  }

  getHealthScore(pet: Pet): number {
    if (!pet.vaccines || pet.vaccines.length === 0) return 100;
    const done = pet.vaccines.filter((v) => v.done).length;
    return Math.round((done / pet.vaccines.length) * 100);
  }

  private async hydrate(apiPet: ApiPet): Promise<Pet> {
    const [meta, medicacoes] = await Promise.all([
      petMetadataStore.getPetMeta(String(apiPet.idPet)),
      apiClient.get<ApiMedicacao[]>(`/api/medicacoes/pet/${apiPet.idPet}`),
    ]);

    const pet = apiPetToPet(apiPet, meta.nextCheckup ?? "");

    const itemMetas = await Promise.all(
      medicacoes.map((m) => petMetadataStore.getItemMeta(String(m.idMedicacao))),
    );

    medicacoes.forEach((m, i) => {
      const item = medicacaoToItem(m, itemMetas[i]);
      if (item.type === "vaccine") pet.vaccines.push(item);
      else pet.medications.push(item);
    });

    return pet;
  }

  // Reconcilia a lista final de vacinas/medicamentos do pet com o que já
  // existe na API: cria o que é novo, atualiza o que mudou e remove o que
  // não está mais na lista (ex: removeVaccine/removeMedication).
  private async syncItems(idPet: number, items: Item[]): Promise<void> {
    const current = await apiClient.get<ApiMedicacao[]>(`/api/medicacoes/pet/${idPet}`);
    const currentIds = new Set(current.map((m) => String(m.idMedicacao)));
    const incomingIds = new Set(items.map((i) => i.id));

    for (const item of items) {
      const payload = itemToMedicacaoPayload(item, idPet);

      if (currentIds.has(item.id)) {
        await apiClient.put(`/api/medicacoes/${item.id}`, payload);
      } else {
        await apiClient.post("/api/medicacoes", payload);
      }

      await petMetadataStore.setItemMeta(item.id, itemMetaOf(item));
    }

    for (const idStr of currentIds) {
      if (!incomingIds.has(idStr)) {
        await apiClient.delete(`/api/medicacoes/${idStr}`);
        await petMetadataStore.deleteItemMeta(idStr);
      }
    }
  }
}

export const petService: IPetService = new PetService();
