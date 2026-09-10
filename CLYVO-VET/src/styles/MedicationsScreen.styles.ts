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
    backgroundColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    ...Typography.subtitle,
    color: Colors.white,
  },

  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: alpha(Colors.accentOrange, 0.19),
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.huge,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  flexOne: {
    flex: 1,
  },

  medName: {
    ...Typography.body,
    color: Colors.white,
  },

  medSub: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: Spacing.xs,
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
    borderRadius: Radius.xl,
  },

  badgeText: {
    ...Typography.caption,
    color: Colors.white,
  },

  empty: {
    alignItems: "center",
    paddingTop: Spacing.huge * 2,
    gap: Spacing.md,
  },

  emptyText: {
    ...Typography.body,
    color: Colors.textLight,
  },

  emptyBtn: {
    marginTop: Spacing.xs,
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
