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
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
    gap: Spacing.xs,
  },

  name: {
    ...Typography.label,
    color: Colors.text,
  },

  sub: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },

  badgeText: {
    ...Typography.caption,
    color: Colors.white,
  },
});
