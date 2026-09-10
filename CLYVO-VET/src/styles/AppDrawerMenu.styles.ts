import { StyleSheet } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  alpha,
} = theme;

// Espaço para o dropdown abrir logo abaixo do header.
const HEADER_CLEARANCE = 110;

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: alpha(Colors.black, 0.45),
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: HEADER_CLEARANCE,
    paddingLeft: Spacing.xl,
  },

  menuContainer: {
    width: 220,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },

  menuText: {
    ...Typography.body,
    color: Colors.white,
  },
});
