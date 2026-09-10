import { storageService } from "./StorageService";

// A tabela MEDICACAO do Oracle não distingue vacina de medicamento nem guarda
// status (done/active) — essas informações existem só no front por enquanto
// (ver comentário em src/types/index.ts). Este store guarda esse metadado
// localmente, indexado pelo id numérico do registro na API, e é mesclado com
// os dados vindos da API na leitura.
type ItemMeta = {
  type: "vaccine" | "medication";
  done?: boolean;
  active?: boolean;
};

type PetMeta = {
  nextCheckup?: string;
};

type MetadataShape = {
  pets: Record<string, PetMeta>;
  items: Record<string, ItemMeta>;
};

const KEY = "@clyvo:pet_metadata";

class PetMetadataStore {
  private async read(): Promise<MetadataShape> {
    const raw = await storageService.getData(KEY);
    return raw ? JSON.parse(raw) : { pets: {}, items: {} };
  }

  private async write(data: MetadataShape): Promise<void> {
    await storageService.saveData(KEY, JSON.stringify(data));
  }

  async getPetMeta(petId: string): Promise<PetMeta> {
    const data = await this.read();
    return data.pets[petId] ?? {};
  }

  async setPetMeta(petId: string, meta: PetMeta): Promise<void> {
    const data = await this.read();
    data.pets[petId] = { ...data.pets[petId], ...meta };
    await this.write(data);
  }

  async deletePetMeta(petId: string): Promise<void> {
    const data = await this.read();
    delete data.pets[petId];
    await this.write(data);
  }

  async getItemMeta(itemId: string): Promise<ItemMeta | undefined> {
    const data = await this.read();
    return data.items[itemId];
  }

  async setItemMeta(itemId: string, meta: ItemMeta): Promise<void> {
    const data = await this.read();
    data.items[itemId] = meta;
    await this.write(data);
  }

  async deleteItemMeta(itemId: string): Promise<void> {
    const data = await this.read();
    delete data.items[itemId];
    await this.write(data);
  }
}

export const petMetadataStore = new PetMetadataStore();
