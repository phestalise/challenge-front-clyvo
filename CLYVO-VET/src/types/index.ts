export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Vaccine {
  id: string;
  name: string;
  date: string;
  nextDue: string;
  done: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  color: string;
  ownerId: string;
  vaccines: Vaccine[];
  medications: Medication[];
  nextCheckup: string;
  createdAt: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  AddPet: undefined;
  PetDetail: { petId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Pets: undefined;
  Health: undefined;
  Profile: undefined;
};