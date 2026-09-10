// Espelha a tabela MEDICACAO do banco (Oracle): NOME, DOSE, FREQUENCIA,
// DATA_INICIO, DATA_FIM. O banco ainda não tem uma coluna que diga se é
// vacina ou remédio nem uma coluna de status — "type" e "done"/"active"
// existem só no front por enquanto, até a API ganhar essas colunas.
export interface Vaccine {
  id: string;
  type: "vaccine";
  name: string; // NOME
  startDate: string; // DATA_INICIO (data de aplicação)
  endDate: string; // DATA_FIM (próxima dose)
  done: boolean;
}

export interface Medication {
  id: string;
  type: "medication";
  name: string; // NOME
  dose: string; // DOSE
  frequency: string; // FREQUENCIA
  startDate: string; // DATA_INICIO
  endDate: string; // DATA_FIM
  active: boolean;
}

// Espelha a tabela PET do banco (ID_PET, ID_TUTOR, NOME, ESPECIE, RACA,
// DATA_NASC, PESO_KG). Não existe COR nem DATA_CADASTRO no banco, então
// esses campos não fazem mais parte do tipo.
export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string; // DATA_NASC — idade é sempre calculada a partir daqui
  weight: number; // PESO_KG
  ownerId: string;
  vaccines: Vaccine[];
  medications: Medication[];
  nextCheckup: string;
}

export type MainTabParamList = {
  Dashboard: undefined;
  Pets: undefined;
  Health: undefined;
  Calendar: undefined;
  Profile: undefined;
};

// A barra de navegação inferior é fixa em todo o AppStack (não vive mais
// num Tab.Navigator separado), então as 5 telas principais entram direto
// no RootStackParamList junto com as telas empilhadas sobre elas.
export type RootStackParamList = MainTabParamList & {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  VerifyEmail: undefined;
  AddPet: { petId?: string } | undefined;
  PetDetail: { petId: string };
  HealthCalendar: undefined;
  PetChat: undefined;
  Vaccines: undefined;
  Medications: undefined;
  Pending: undefined;
  AddHealthRecord: undefined;
};
