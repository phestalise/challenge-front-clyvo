export interface IKeyValueStorage {
  getData(key: string): Promise<string | null>;
  saveData(key: string, value: string): Promise<void>;
}

export interface IStorage extends IKeyValueStorage {}
