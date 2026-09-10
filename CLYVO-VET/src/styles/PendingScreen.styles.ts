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

  headerSpacer: {
    width: 36,
  },

  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },

  info: {
    flex: 1,
  },

  itemName: {
    ...Typography.body,
    color: Colors.white,
  },

  itemSub: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },

  itemDate: {
    ...Typography.caption,
    color: alpha(Colors.accentRed, 0.8),
    marginTop: Spacing.xs,
  },

  resolveBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: alpha(Colors.accentRed, 0.13),
  },

  resolveBtnText: {
    color: Colors.accentRed,
    ...Typography.caption,
  },

  empty: {
    alignItems: "center",
    paddingTop: Spacing.huge * 2 + Spacing.xl,
    gap: Spacing.md,
  },

  emptyTitle: {
    ...Typography.title,
    color: Colors.white,
  },

  emptyText: {
    color: Colors.textLight,
    ...Typography.label,
  },

  emptyBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.accentGreen,
    borderRadius: Radius.md,
  },

  emptyBtnText: {
    color: Colors.white,
    fontWeight: "700",
  },
});
