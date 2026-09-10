import { StyleSheet } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
} = theme;

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "42%",
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadows.sm,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },

  value: {
    ...Typography.display,
    color: Colors.text,
  },

  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
