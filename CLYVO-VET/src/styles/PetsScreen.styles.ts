import { StyleSheet } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  alpha,
} = theme;

// Espaço para o dropdown do menu abrir logo abaixo do header.
const HEADER_CLEARANCE = 110;
// Centralização vertical do estado vazio; não é um valor de ritmo de espaçamento.
const EMPTY_STATE_OFFSET = 90;

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
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.secondary,
  },

  menuButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  centerHeader: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  logoIcon: {
    width: 18,
    height: 18,
    borderRadius: Radius.pill,
    backgroundColor: alpha(Colors.white, 0.06),
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    color: Colors.white,
    ...Typography.caption,
    letterSpacing: 1.5,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },

  title: {
    color: Colors.white,
    ...Typography.body,
  },

  addBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    flex: 1,
    backgroundColor: alpha(Colors.black, 0.5),
  },

  menuContainer: {
    width: 240,
    backgroundColor: Colors.secondary,
    marginTop: HEADER_CLEARANCE,
    marginLeft: Spacing.xl,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },

  menuText: {
    color: Colors.white,
    ...Typography.label,
  },

  list: {
    padding: Spacing.xl,
    // Clareia a tab bar flutuante (altura 82 + offset 18).
    paddingBottom: Spacing.huge * 3,
    gap: Spacing.lg,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: EMPTY_STATE_OFFSET,
  },

  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },

  emptyTitle: {
    ...Typography.title,
    color: Colors.white,
  },

  emptyText: {
    marginTop: Spacing.md,
    ...Typography.label,
    textAlign: "center",
    color: Colors.textLight,
  },

  emptyBtn: {
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentLight,
  },

  emptyBtnText: {
    ...Typography.body,
    color: Colors.white,
  },

  card: {
    padding: Spacing.lg,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.overlaySubtle,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: Radius.xl,
    backgroundColor: alpha(Colors.accentLight, 0.09),
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
  },

  petName: {
    ...Typography.subtitle,
    color: Colors.white,
  },

  petMeta: {
    marginTop: Spacing.xs,
    ...Typography.label,
    color: Colors.textLight,
  },

  tags: {
    flexDirection: "row",
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },

  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: Colors.overlaySoft,
  },

  tagText: {
    ...Typography.caption,
    color: Colors.textLight,
  },

  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xl,
  },

  healthLabel: {
    width: 52,
    ...Typography.caption,
    color: Colors.textLight,
  },

  barBg: {
    flex: 1,
    height: 7,
    borderRadius: Radius.pill,
    overflow: "hidden",
    backgroundColor: Colors.overlaySoft,
  },

  barFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },

  healthPct: {
    width: 45,
    textAlign: "right",
    ...Typography.caption,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.xl,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  statText: {
    ...Typography.caption,
    color: Colors.textLight,
  },
});
