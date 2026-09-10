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

  pawWatermark: {
    position: "absolute",
    bottom: 120,
    left: 16,
    transform: [{ rotate: "-15deg" }],
  },

  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerEyebrow: {
    color: Colors.textLight,
    ...Typography.caption,
    letterSpacing: 1,
    textTransform: "uppercase",
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

  // Banner de destaque personalizado ("cuidamos do seu pet").
  careBanner: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderLeftWidth: 4,
    padding: Spacing.lg,
    ...Shadows.card,
  },

  careBannerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  careIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  careTextWrap: {
    flex: 1,
  },

  careEyebrow: {
    ...Typography.caption,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  careMessage: {
    marginTop: 2,
    ...Typography.label,
    fontWeight: "600",
    color: Colors.text,
  },

  careCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },

  careCtaText: {
    ...Typography.label,
    fontWeight: "700",
    color: Colors.white,
  },

  card: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.accentLight,
    ...Shadows.card,
  },

  cardHeader: {
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
  },

  avatarInitial: {
    ...Typography.subtitle,
    fontWeight: "700",
    color: Colors.accentLight,
  },

  cardInfo: {
    flex: 1,
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

  pendingBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    marginRight: Spacing.sm,
    backgroundColor: alpha(Colors.accentRed, 0.12),
  },

  pendingText: {
    ...Typography.caption,
    color: Colors.accentRed,
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

  checkupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },

  checkupText: {
    ...Typography.caption,
    fontWeight: "600",
    flex: 1,
  },

  checkupAction: {
    ...Typography.caption,
    fontWeight: "700",
    color: Colors.accentLight,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: alpha(Colors.black, 0.6),
    justifyContent: "flex-end",
  },

  modalBox: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xxl,
    paddingBottom: Spacing.huge,
  },

  modalTitle: {
    ...Typography.subtitle,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },

  inputLabel: {
    ...Typography.caption,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },

  input: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    color: Colors.white,
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  modalBtns: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },

  cancelBtn: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },

  cancelText: {
    ...Typography.body,
    color: Colors.textLight,
  },

  saveBtn: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentGreen,
    alignItems: "center",
  },

  saveText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: "700",
  },
});
