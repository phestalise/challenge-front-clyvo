import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../screens/dashboard/DashboardScreen";
import PetsScreen from "../screens/pet/PetsScreen";
import HealthTabScreen from "../screens/health/HealthTabScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import AboutScreen from "../screens/profile/AboutScreen";

import WelcomeScreen from "../screens/auth/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";

import AddPetScreen from "../screens/pet/AddPetScreen";
import PetDetailScreen from "../screens/pet/PetDetailScreen";
import PetChatScreen from "../screens/pet/PetChatScreen";

import HealthCalendarScreen from "../screens/health/HealthCalendarScreen";
import VaccinesScreen from "../screens/health/VaccinesScreen";
import MedicationsScreen from "../screens/health/MedicationsScreen";
import PendingScreen from "../screens/health/PendingScreen";
import AddHealthRecordScreen from "../screens/health/AddHealthRecordScreen";

import MainHeader from "../components/MainHeader";
import BottomTabBar from "../components/BottomTabBar";

import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../theme";
import { useHealthReminders } from "../hooks/useHealthReminders";
import { useNotificationNavigation } from "../hooks/useNotificationNavigation";
import { RootStackParamList, MainTabParamList } from "../types";

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

function VerifyStack() {
  return (
    <Stack.Navigator
      initialRouteName="VerifyEmail"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  );
}

const mainHeaderFor = (routeName: keyof MainTabParamList) => ({
  headerShown: true,
  header: () => <MainHeader route={{ name: routeName }} />,
});

// A barra de navegação inferior (BottomTabBar) fica fixa sobre TODO o
// AppStack — inclusive telas empilhadas como PetDetail ou Vaccines — em vez
// de existir só dentro de um Tab.Navigator, por isso é um irmão do
// Stack.Navigator, não algo dentro dele.
function AppStack() {
  useHealthReminders();
  useNotificationNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={mainHeaderFor("Dashboard")}
        />
        <Stack.Screen
          name="Pets"
          component={PetsScreen}
          options={mainHeaderFor("Pets")}
        />
        <Stack.Screen
          name="Health"
          component={HealthTabScreen}
          options={mainHeaderFor("Health")}
        />
        <Stack.Screen
          name="Calendar"
          component={HealthCalendarScreen}
          options={mainHeaderFor("Calendar")}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={mainHeaderFor("Profile")}
        />

        <Stack.Screen name="AddPet" component={AddPetScreen} />
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
        <Stack.Screen name="PetChat" component={PetChatScreen} />
        <Stack.Screen name="HealthCalendar" component={HealthCalendarScreen} />
        <Stack.Screen name="Vaccines" component={VaccinesScreen} />
        <Stack.Screen name="Medications" component={MedicationsScreen} />
        <Stack.Screen name="Pending" component={PendingScreen} />
        <Stack.Screen
          name="AddHealthRecord"
          component={AddHealthRecordScreen}
        />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>

      <BottomTabBar />
    </View>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useAuth();
  const { colors: Colors } = useTheme();

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

  if (!user) return <AuthStack />;

  if (!user.emailVerified) return <VerifyStack />;

  return <AppStack />;
}
