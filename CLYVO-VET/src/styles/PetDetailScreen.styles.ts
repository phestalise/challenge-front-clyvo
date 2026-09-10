import { StyleSheet } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  alpha,
} = theme;

// Compensa a ausência de SafeAreaView neste header (substitui o inset da status bar).
const STATUS_BAR_OFFSET = 56;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingTop: STATUS_BAR_OFFSET,
    paddingBottom: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: Colors.overlaySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    ...Typography.title,
    color: Colors.white,
  },

  headerActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  editBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: alpha(Colors.accentLight, 0.13),
    justifyContent: "center",
    alignItems: "center",
  },

  deleteBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: alpha(Colors.accentRed, 0.13),
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: Spacing.huge,
  },

  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.sm,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: Radius.xl,
    backgroundColor: alpha(Colors.accentLight, 0.08),
    justifyContent: "center",
    alignItems: "center",
  },

  petName: {
    ...Typography.title,
    color: Colors.text,
  },

  petMeta: {
    ...Typography.label,
    color: Colors.textSecondary,
  },

  ring: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Spacing.sm,
  },

  ringNum: {
    ...Typography.subtitle,
  },

  ringLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  chips: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },

  chipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  statsRow: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  stat: {
    alignItems: "center",
    gap: Spacing.xs,
  },

  statVal: {
    ...Typography.body,
  },

  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },

  statDiv: {
    width: 1,
    height: Spacing.xxxl,
    backgroundColor: Colors.border,
  },

  tabsRow: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: "center",
  },

  tabBtnActive: {
    backgroundColor: Colors.primary,
  },

  tabBtnText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },

  tabBtnTextActive: {
    color: Colors.white,
  },

  infoBlock: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    overflow: "hidden",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  infoKey: {
    ...Typography.label,
    color: Colors.textSecondary,
  },

  infoVal: {
    ...Typography.label,
    color: Colors.text,
  },

  noData: {
    textAlign: "center",
    color: Colors.textSecondary,
    paddingTop: Spacing.xxxl,
  },
});
