import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  alpha,
} = theme;

export const useProfileScreenStyles = makeStyles((Colors) => ({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  content: {
    padding: Spacing.lg,
    // Clareia a tab bar flutuante (altura 82 + offset 18) mais respiro extra.
    paddingBottom: Spacing.huge * 3 + Spacing.xl,
  },

  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },

  avatarText: {
    ...Typography.display,
    color: Colors.onAccent,
  },

  name: {
    ...Typography.title,
    color: Colors.text,
  },

  email: {
    ...Typography.label,
    marginTop: Spacing.xs,
    color: Colors.textMuted,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    height: 44,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },

  editBtnText: {
    ...Typography.label,
    color: Colors.accent,
    fontWeight: "700",
  },

  section: {
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  themeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },

  themeOption: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },

  themeOptionActive: {
    borderColor: Colors.accent,
    backgroundColor: alpha(Colors.accent, 0.08),
  },

  themeOptionText: {
    ...Typography.caption,
    color: Colors.textLight,
  },

  themeOptionTextActive: {
    color: Colors.accentOnDark,
  },

  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  aboutText: {
    flex: 1,
    ...Typography.label,
    color: Colors.text,
  },

  faqItem: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  faqQ: {
    flex: 1,
    ...Typography.label,
    color: Colors.text,
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
    color: Colors.text,
    marginBottom: Spacing.xl,
  },

  input: {
    height: 54,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    color: Colors.text,
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
    color: Colors.onAccent,
    fontWeight: "700",
  },
}));
