import { StyleSheet } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
} = theme;

// Altura da barra flutuante (82) + distância até a borda da tela (Spacing.xl)
// + folga extra para o conteúdo não colar nela.
export const TAB_BAR_CLEARANCE = Spacing.huge * 3;

export const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    left: Spacing.xl,
    right: Spacing.xl,
    bottom: Spacing.xl,
    height: 82,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 0,
  },

  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },

  tabBarLabelStyle: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },

  tabIcon: {
    width: 46,
    height: 46,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTabIcon: {
    backgroundColor: Colors.overlaySoft,
  },
});
