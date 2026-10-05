import { theme, makeStyles } from "../theme";
import { TAB_BAR_CLEARANCE } from "./MainTabs.styles";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

export const useMedicationsScreenStyles = makeStyles((Colors) => ({
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
    color: Colors.text,
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
    backgroundColor: alpha(Colors.text, 0.12),
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
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.text,
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
    color: Colors.onAccent,
    fontWeight: "700",
  },

  formContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },

  errorText: {
    ...Typography.caption,
    color: Colors.accentRed,
    marginTop: Spacing.xs,
  },

  inputError: {
    borderColor: Colors.accentRed,
  },

  inputLabel: {
    ...Typography.caption,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },

  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    color: Colors.text,
    ...Typography.body,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
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
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  petChipSelected: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accentLight,
  },

  petChipText: {
    ...Typography.label,
    color: Colors.textMuted,
  },

  petChipTextSelected: {
    color: Colors.onAccent,
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accentOrange,
  },

  saveBtnDisabled: {
    opacity: 0.6,
  },

  saveBtnText: {
    ...Typography.body,
    color: Colors.onAccent,
    fontWeight: "700",
  },
}));
