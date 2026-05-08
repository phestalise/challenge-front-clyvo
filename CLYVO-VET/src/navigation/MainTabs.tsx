import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { MainTabParamList } from "../types";
import { Colors } from "../styles/colors";

import DashboardScreen from "../screens/main/DashboardScreen";
import PetsScreen from "../screens/pet/PetsScreen";
import HealthTabScreen from "../screens/main/HealthTabScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopColor: "rgba(255,255,255,0.08)",
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
        },

        tabBarActiveTintColor: Colors.accentLight,

        tabBarInactiveTintColor:
          "rgba(255,255,255,0.35)",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, any> = {
            Dashboard: "home",
            Pets: "paw",
            Health: "heart",
            Profile: "person",
          };

          return (
            <Ionicons
              name={icons[route.name]}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Início",
        }}
      />

      <Tab.Screen
        name="Pets"
        component={PetsScreen}
        options={{
          title: "Meus Pets",
        }}
      />

      <Tab.Screen
        name="Health"
        component={HealthTabScreen}
        options={{
          title: "Saúde",
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}