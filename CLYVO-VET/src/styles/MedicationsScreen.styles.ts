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

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
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

  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentOrange,
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },

  flexOne: {
    flex: 1,
  },

  medName: {
    ...Typography.body,
    fontWeight: "700",
    color: Colors.text,
  },

  medSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },

  actions: {
    alignItems: "center",
    gap: Spacing.sm,
  },

  actionBtn: {
    padding: Spacing.xs,
  },

  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },

  badgeText: {
    ...Typography.caption,
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
    ...Typography.subtitle,
    color: Colors.white,
  },

  emptyText: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: "center",
  },

  emptyBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.accentOrange,
    borderRadius: Radius.md,
  },

  emptyBtnText: {
    color: Colors.white,
    fontWeight: "700",
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
    marginTop: Spacing.xs,
  },

  input: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    color: Colors.white,
    ...Typography.body,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  petScroll: {
    marginBottom: Spacing.md,
  },

  petScrollRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },

  petChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  petChipSelected: {
    backgroundColor: Colors.accentOrange,
    borderColor: Colors.accentOrange,
  },

  petChipText: {
    ...Typography.label,
    color: Colors.textLight,
  },

  petChipTextSelected: {
    color: Colors.white,
  },

  modalBtns: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },

  cancelBtn: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },

  cancelBtnText: {
    color: Colors.textLight,
    fontWeight: "600",
  },

  saveBtn: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentOrange,
    alignItems: "center",
  },

  saveBtnText: {
    color: Colors.white,
    fontWeight: "700",
  },
});
