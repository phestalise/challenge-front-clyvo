import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../styles/colors";
import { MainTabParamList } from "../types";
import { navigationRef } from "../navigation/navigationRef";

import { styles } from "../styles/MainTabs.styles";

type TabDef = {
  name: keyof MainTabParamList;
  label: string;
  active: keyof typeof Ionicons.glyphMap;
  inactive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabDef[] = [
  {
    name: "Dashboard",
    label: "Início",
    active: "home",
    inactive: "home-outline",
  },
  { name: "Pets", label: "Pets", active: "paw", inactive: "paw-outline" },
  {
    name: "Health",
    label: "Saúde",
    active: "heart",
    inactive: "heart-outline",
  },
  {
    name: "Calendar",
    label: "Calendário",
    active: "calendar",
    inactive: "calendar-outline",
  },
  {
    name: "Profile",
    label: "Perfil",
    active: "person",
    inactive: "person-outline",
  },
];

// Fica fixa sobre todas as telas do AppStack (não só as 5 abas principais),
// por isso navega via navigationRef em vez de useNavigation/useRoute —
// este componente não é filho do Stack.Navigator.
export default function BottomTabBar() {
  const [activeRoute, setActiveRoute] = useState(
    navigationRef.getCurrentRoute()?.name,
  );

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigationRef.addListener("state", () => {
      setActiveRoute(navigationRef.getCurrentRoute()?.name);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );

    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View style={styles.tabBarStyle}>
      {TABS.map((tab) => {
        const focused = activeRoute === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabBarItem}
            onPress={() => navigationRef.navigate(tab.name)}
          >
            <View style={[styles.tabIcon, focused && styles.activeTabIcon]}>
              <Ionicons
                name={focused ? tab.active : tab.inactive}
                size={24}
                color={Colors.white}
              />
            </View>

            <Text
              style={[
                styles.tabBarLabelStyle,
                { color: focused ? Colors.white : "rgba(255,255,255,0.65)" },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
