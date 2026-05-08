import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabs from "./MainTabs";

import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/Registerscreen";

import AddPetScreen from "../screens/pet/AddPetScreen";
import PetDetailScreen from "../screens/pet/PetDetailScreen";

import PetChatScreen from "../screens/main/PetChatScreen";
import HealthCalendarScreen from "../screens/main/HealthCalendarScreen";
import VaccinesScreen from "../screens/main/VaccinesScreen";
import MedicationsScreen from "../screens/main/MedicationsScreen";
import PendingScreen from "../screens/main/PendingScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;

  Main: undefined;

  AddPet: undefined;

  PetDetail: {
    petId: string;
  };

  PetChat: undefined;
  HealthCalendar: undefined;

  Vaccines: undefined;
  Medications: undefined;
  Pending: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="Main"
        component={MainTabs}
      />

      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
      />

      <Stack.Screen
        name="PetDetail"
        component={PetDetailScreen}
      />

      <Stack.Screen
        name="PetChat"
        component={PetChatScreen}
      />

      <Stack.Screen
        name="HealthCalendar"
        component={HealthCalendarScreen}
      />

      <Stack.Screen
        name="Vaccines"
        component={VaccinesScreen}
      />

      <Stack.Screen
        name="Medications"
        component={MedicationsScreen}
      />

      <Stack.Screen
        name="Pending"
        component={PendingScreen}
      />
    </Stack.Navigator>
  );
}