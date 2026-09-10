import { StyleSheet } from "react-native";

import { theme } from "../theme";
import { TAB_BAR_CLEARANCE } from "./MainTabs.styles";

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
    backgroundColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    ...Typography.subtitle,
    color: Colors.white,
  },

  content: {
    padding: Spacing.xl,
    paddingBottom: TAB_BAR_CLEARANCE,
  },

  avatarArea: {
    alignItems: "center",
    marginBottom: Spacing.xxxl,
    gap: Spacing.md,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.xxl,
    backgroundColor: alpha(Colors.accentLight, 0.13),
    alignItems: "center",
    justifyContent: "center",
  },

  avatarHint: {
    ...Typography.subtitle,
    color: Colors.white,
  },

  label: {
    ...Typography.label,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },

  errorText: {
    ...Typography.caption,
    color: Colors.accentRed,
    marginTop: Spacing.sm,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },

  loadingText: {
    ...Typography.label,
    color: Colors.textLight,
  },

  input: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    color: Colors.white,
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  inputError: {
    borderColor: Colors.accentRed,
  },

  row: {
    flexDirection: "row",
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },

  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  chipSelected: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accentLight,
  },

  chipText: {
    ...Typography.label,
    color: Colors.textLight,
  },

  chipTextSelected: {
    color: Colors.white,
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.xxxl,
  },

  saveBtnDisabled: {
    opacity: 0.5,
  },

  saveBtnText: {
    ...Typography.body,
    color: Colors.white,
  },
});
