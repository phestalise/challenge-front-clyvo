import React from "react";
import { ActivityIndicator, View } from "react-native";
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

import { useAuth } from "../hooks/useAuth";
import { Colors } from "../styles/colors";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="AddPet" component={AddPetScreen} />
      <Stack.Screen name="PetDetail" component={PetDetailScreen} />
      <Stack.Screen name="PetChat" component={PetChatScreen} />
      <Stack.Screen name="HealthCalendar" component={HealthCalendarScreen} />
      <Stack.Screen name="Vaccines" component={VaccinesScreen} />
      <Stack.Screen name="Medications" component={MedicationsScreen} />
      <Stack.Screen name="Pending" component={PendingScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.primary,
        }}
      >
        <ActivityIndicator size="large" color={Colors.accentLight} />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}
