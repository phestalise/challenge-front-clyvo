import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";


import DashboardScreen from "../screens/main/DashboardScreen";
import PetsScreen from "../screens/pet/PetsScreen";
import HealthTabScreen from "../screens/main/HealthTabScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

import { Colors } from "../styles/colors";
import { storageService } from "../services/StorageService";

const Tab = createBottomTabNavigator();

function CustomHeader({ route }: any) {
  const navigation: any = useNavigation();

  const [menuVisible, setMenuVisible] =
    useState(false);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const data =
      await storageService.getUser();

    setUser(data);
  };

  const firstName = (
    user?.name || "Usuário"
  ).split(" ")[0];

  const currentDate =
    new Date().toLocaleDateString(
      "pt-BR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
    );

  const isDashboard =
    route.name === "Dashboard";

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            setMenuVisible(true)
          }
        >
          <Ionicons
            name="menu"
            size={28}
            color={Colors.white}
          />
        </TouchableOpacity>

        {isDashboard ? (
          <View style={styles.centerArea}>
            <View style={styles.logoRow}>
              <Ionicons
                name="paw"
                size={18}
                color={
                  Colors.accentLight
                }
              />

              <Text style={styles.logo}>
                CLYVO
              </Text>
            </View>

            <Text style={styles.greeting}>
              Olá, {firstName} 👋
            </Text>

            <Text style={styles.date}>
              {currentDate}
            </Text>
          </View>
        ) : (
          <Text style={styles.screenTitle}>
            {route.name === "Pets"
              ? "Pets"
              : route.name === "Health"
                ? "Saúde"
                : "Perfil"}
          </Text>
        )}

        <View style={{ width: 52 }} />
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.overlay}
          onPress={() =>
            setMenuVisible(false)
          }
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);

                navigation.navigate(
                  "Dashboard"
                );
              }}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color={Colors.white}
              />

              <Text style={styles.menuText}>
                Início
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);

                navigation.navigate(
                  "Pets"
                );
              }}
            >
              <Ionicons
                name="paw-outline"
                size={20}
                color={Colors.white}
              />

              <Text style={styles.menuText}>
                Pets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);

                navigation.navigate(
                  "Health"
                );
              }}
            >
              <Ionicons
                name="heart-outline"
                size={20}
                color={Colors.white}
              />

              <Text style={styles.menuText}>
                Saúde
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);

                navigation.navigate(
                  "Profile"
                );
              }}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={Colors.white}
              />

              <Text style={styles.menuText}>
                Perfil
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => (
          <CustomHeader route={route} />
        ),

        tabBarHideOnKeyboard: true,

        sceneContainerStyle: {
          backgroundColor:
            Colors.primary,
        },

        tabBarStyle: {
          position: "absolute",

          left: 18,
          right: 18,
          bottom: 18,

          height: 82,

          borderRadius: 28,

          backgroundColor:
            "#17315B",

          borderTopWidth: 0,

          paddingTop: 10,
          paddingBottom: 10,

          elevation: 0,
        },

        tabBarActiveTintColor:
          Colors.white,

        tabBarInactiveTintColor:
          "rgba(255,255,255,0.65)",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginBottom: 4,
        },

        tabBarIcon: ({
          focused,
        }) => {
          let iconName: any =
            "home-outline";

          if (
            route.name === "Dashboard"
          ) {
            iconName = focused
              ? "home"
              : "home-outline";
          }

          if (
            route.name === "Pets"
          ) {
            iconName = focused
              ? "paw"
              : "paw-outline";
          }

          if (
            route.name === "Health"
          ) {
            iconName = focused
              ? "heart"
              : "heart-outline";
          }

          if (
            route.name === "Profile"
          ) {
            iconName = focused
              ? "person"
              : "person-outline";
          }

          return (
            <View
              style={[
                styles.tabIcon,
                focused &&
                  styles.activeTabIcon,
              ]}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={Colors.white}
              />
            </View>
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
          title: "Pets",
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

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 22,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",

    backgroundColor:
      Colors.primary,
  },

  centerArea: {
    flex: 1,
    alignItems: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  logo: {
    fontSize: 34,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: 1,
  },

  greeting: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.white,
    marginTop: 4,
  },

  date: {
    marginTop: 6,
    fontSize: 13,
    color:
      "rgba(255,255,255,0.55)",
    textTransform: "capitalize",
  },

  screenTitle: {
    flex: 1,
    textAlign: "center",

    fontSize: 24,
    fontWeight: "800",

    color: Colors.white,
  },

  menuButton: {
    width: 52,
    height: 52,

    borderRadius: 18,

    backgroundColor:
      "rgba(255,255,255,0.08)",

    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",

    justifyContent: "flex-start",
    alignItems: "flex-start",

    paddingTop: 110,
    paddingLeft: 20,
  },

  menuContainer: {
    width: 220,

    borderRadius: 22,

    backgroundColor:
      "#17315B",

    paddingVertical: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",

    gap: 12,

    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  menuText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
  },

  tabIcon: {
    width: 46,
    height: 46,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",
  },

  activeTabIcon: {
    backgroundColor:
      "rgba(255,255,255,0.12)",
  },
});