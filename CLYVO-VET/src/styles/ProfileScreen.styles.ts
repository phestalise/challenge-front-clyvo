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

  pawWatermark: {
    position: "absolute",
    bottom: 120,
    left: 16,
    transform: [{ rotate: "-15deg" }],
  },

  content: {
    padding: Spacing.lg,
    // Clareia a tab bar flutuante (altura 82 + offset 18) mais respiro extra.
    paddingBottom: Spacing.huge * 3 + Spacing.xl,
  },

  profileCard: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: alpha(Colors.accentLight, 0.15),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },

  avatarText: {
    ...Typography.display,
    color: Colors.accentLight,
  },

  name: {
    ...Typography.title,
    color: Colors.white,
  },

  email: {
    ...Typography.label,
    marginTop: Spacing.xs,
    color: Colors.textLight,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentLight,
  },

  editBtnText: {
    color: Colors.white,
    fontWeight: "700",
  },

  section: {
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    ...Typography.label,
    color: alpha(Colors.white, 0.45),
    marginBottom: Spacing.md,
    textTransform: "uppercase",
  },

  faqItem: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },

  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  faqQ: {
    flex: 1,
    ...Typography.label,
    color: Colors.white,
    marginRight: Spacing.md,
  },

  faqA: {
    marginTop: Spacing.md,
    ...Typography.label,
    color: Colors.textLight,
  },

  logoutBtn: {
    height: 58,
    borderRadius: Radius.lg,
    backgroundColor: alpha(Colors.dangerOnDark, 0.12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    marginBottom: Spacing.huge,
  },

  logoutText: {
    ...Typography.body,
    color: Colors.dangerOnDark,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: alpha(Colors.black, 0.5),
  },

  modalBox: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xxl,
    paddingBottom: Spacing.huge,
  },

  modalTitle: {
    ...Typography.title,
    color: Colors.white,
    marginBottom: Spacing.xl,
  },

  input: {
    height: 54,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    color: Colors.white,
    backgroundColor: Colors.primary,
  },

  modalBtns: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },

  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },

  saveBtn: {
    flex: 1,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accentLight,
  },

  cancelText: {
    color: Colors.textLight,
    fontWeight: "600",
  },

  saveText: {
    color: Colors.white,
    fontWeight: "700",
  },
});
