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
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.secondary,
  },

  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.overlaySoft,
  },

  title: {
    ...Typography.subtitle,
    color: Colors.white,
  },

  headerSpacer: {
    width: 36,
  },

  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },

  label: {
    ...Typography.label,
    color: Colors.textLight,
    marginBottom: Spacing.md,
    letterSpacing: 0.4,
  },

  petLabel: {
    marginTop: Spacing.xxxl,
  },

  typeRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  typeCard: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.overlaySoft,
    gap: Spacing.sm,
  },

  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  typeLabel: {
    ...Typography.body,
    color: Colors.white,
  },

  typeDesc: {
    ...Typography.caption,
    color: Colors.textLight,
  },

  petList: {
    gap: Spacing.md,
  },

  petRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  petAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: alpha(Colors.accentLight, 0.13),
    alignItems: "center",
    justifyContent: "center",
  },

  petInfo: {
    flex: 1,
  },

  petName: {
    ...Typography.body,
    color: Colors.white,
  },

  petMeta: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: 2,
  },

  emptyPets: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },

  emptyText: {
    ...Typography.label,
    color: Colors.textLight,
  },

  linkText: {
    ...Typography.label,
    color: Colors.accentOnDark,
  },
});
