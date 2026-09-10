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

// Círculo decorativo de fundo (marca d'água) — fora da escala de radius
// (raio = metade do tamanho).
const ORB_SIZE = 260;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  orb: {
    position: "absolute",
    top: -110,
    right: -90,
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
    paddingBottom: Spacing.xl,
  },

  headerEyebrow: {
    color: Colors.textLight,
    ...Typography.caption,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  headerCount: {
    marginTop: Spacing.xs,
    color: Colors.white,
    ...Typography.subtitle,
  },

  addBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },

  list: {
    padding: Spacing.xl,
    // Clareia a tab bar flutuante (altura 82 + offset 18).
    paddingBottom: Spacing.huge * 3,
    gap: Spacing.md,
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

  // Card do pet: fundo branco, borda azul, cantos de 16px, sombra suave.
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.accentLight,
    ...Shadows.card,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: alpha(Colors.accentLight, 0.12),
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarInitial: {
    ...Typography.subtitle,
    fontWeight: "700",
    color: Colors.accentLight,
  },

  cardInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },

  petName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    color: Colors.text,
  },

  petMeta: {
    marginTop: 2,
    ...Typography.caption,
    color: Colors.textMuted,
  },

  tagsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },

  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
  },

  tagText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  ringWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  ringText: {
    ...Typography.caption,
    fontWeight: "700",
  },

  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },

  statsText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
