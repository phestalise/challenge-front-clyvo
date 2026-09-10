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

// Centralização vertical do estado vazio; não é um valor de ritmo de espaçamento.
const EMPTY_STATE_OFFSET = 90;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  addButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentRed,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    // Clareia a tab bar flutuante (altura 82 + offset 18).
    paddingBottom: Spacing.huge * 3,
    gap: Spacing.lg,
  },

  emptyContainer: {
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

  emptyButton: {
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentRed,
  },

  emptyButtonText: {
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

  cardHeader: {
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

  cardInfo: {
    flex: 1,
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

  pendingBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    marginRight: Spacing.md,
    backgroundColor: alpha(Colors.accentRed, 0.13),
  },

  pendingText: {
    ...Typography.caption,
    color: Colors.accentRed,
  },

  healthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xl,
  },

  healthLabel: {
    width: 50,
    ...Typography.caption,
    color: Colors.textLight,
  },

  progressBackground: {
    flex: 1,
    height: 7,
    borderRadius: Radius.pill,
    overflow: "hidden",
    backgroundColor: Colors.overlaySoft,
  },

  progressFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },

  healthValue: {
    width: 45,
    ...Typography.caption,
    textAlign: "right",
  },

  statsContainer: {
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

  checkupContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.overlaySubtle,
  },

  checkupText: {
    ...Typography.caption,
    color: Colors.textLight,
  },
});
