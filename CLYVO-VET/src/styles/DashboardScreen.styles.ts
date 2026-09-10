import { StyleSheet } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  content: {
    // Clareia a tab bar flutuante (altura 82 + offset 18).
    paddingBottom: Spacing.huge * 3,
  },

  topHeader: {
    height: Spacing.md,
  },

  banner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    backgroundColor: alpha(Colors.accentLight, 0.08),
    borderWidth: 1,
    borderColor: alpha(Colors.accentLight, 0.19),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bannerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  bannerIcon: {
    width: 46,
    height: 46,
    borderRadius: Radius.lg,
    backgroundColor: alpha(Colors.accentLight, 0.13),
    alignItems: "center",
    justifyContent: "center",
  },

  bannerText: {
    flex: 1,
    ...Typography.label,
    color: Colors.white,
  },

  chatButton: {
    width: 50,
    height: 50,
    borderRadius: Radius.lg,
    marginLeft: Spacing.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },

  card: {
    width: "48%",
    backgroundColor: Colors.secondary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.overlaySubtle,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },

  cardValue: {
    ...Typography.display,
    color: Colors.white,
  },

  cardLabel: {
    ...Typography.label,
    color: Colors.textLight,
  },
});
