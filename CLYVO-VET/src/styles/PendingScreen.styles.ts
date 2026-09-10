import { StyleSheet } from "react-native";

import { theme } from "../theme";
import { TAB_BAR_CLEARANCE } from "./MainTabs.styles";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

// Círculo decorativo de fundo (marca d'água) — fora da escala de radius
// (raio = metade do tamanho).
const ORB_SIZE = 240;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  orb: {
    position: "absolute",
    top: -100,
    right: -80,
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    backgroundColor: alpha(Colors.white, 0.05),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
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

  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE,
  },

  sectionLabel: {
    ...Typography.caption,
    fontWeight: "700",
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },

  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: alpha(Colors.accentOrange, 0.15),
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
  },

  itemName: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.text,
  },

  itemSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },

  itemDate: {
    ...Typography.caption,
    color: Colors.accentRed,
    marginTop: 2,
  },

  resolveBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentOrange,
  },

  resolveBtnText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: "700",
  },

  empty: {
    alignItems: "center",
    paddingTop: Spacing.huge * 2,
    gap: Spacing.sm,
  },

  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
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
