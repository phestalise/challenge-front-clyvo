import { StyleSheet } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  alpha,
} = theme;

export const styles = StyleSheet.create({
  header: {
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },

  logo: {
    ...Typography.label,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },

  pageBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: alpha(Colors.white, 0.12),
  },

  pageBadgeText: {
    ...Typography.caption,
    fontWeight: "700",
    color: Colors.accentLight,
  },
});
