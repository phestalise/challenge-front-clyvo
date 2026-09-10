import React from "react";
import { Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../styles/colors";
import { MainTabParamList } from "../types";

import { styles } from "../styles/MainHeader.styles";

const TAB_TITLES: Record<keyof MainTabParamList, string> = {
  Dashboard: "Início",
  Pets: "Pets",
  Health: "Saúde",
  Calendar: "Calendário",
  Profile: "Perfil",
};

type Props = {
  route: { name: keyof MainTabParamList };
};

export default function MainHeader({ route }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <View style={styles.logoRow}>
        <Ionicons name="paw" size={18} color={Colors.accentLight} />

        <Text style={styles.logo}>CLYVO</Text>
      </View>

      <View style={styles.pageBadge}>
        <Text style={styles.pageBadgeText}>{TAB_TITLES[route.name]}</Text>
      </View>
    </View>
  );
}
