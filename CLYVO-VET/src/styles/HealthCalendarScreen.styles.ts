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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.accent,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },

  headerSide: {
    width: 84,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  headerSideRight: {
    justifyContent: "flex-end",
  },

  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: alpha(Colors.white, 0.15),
    alignItems: "center",
    justifyContent: "center",
  },

  headerBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentRed,
    borderWidth: 1,
    borderColor: Colors.accent,
  },

  title: {
    flex: 1,
    textAlign: "center",
    color: Colors.white,
    ...Typography.title,
  },

  viewTabs: {
    flexDirection: "row",
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    padding: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: alpha(Colors.white, 0.15),
  },

  viewTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },

  viewTabActive: {
    backgroundColor: Colors.white,
  },

  viewTabText: {
    ...Typography.label,
    color: alpha(Colors.white, 0.85),
  },

  viewTabTextActive: {
    color: Colors.primary,
  },

  scrollContent: {
    padding: Spacing.lg,
    // Clareia a tab bar flutuante (altura 82 + offset 18).
    paddingBottom: Spacing.huge * 3,
    gap: Spacing.lg,
  },

  calendarCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    ...Shadows.md,
  },

  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },

  monthNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  monthText: {
    color: Colors.primary,
    ...Typography.subtitle,
    textTransform: "capitalize",
  },

  monthNavRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  todayBtn: {
    paddingHorizontal: Spacing.sm,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: alpha(Colors.accentLight, 0.15),
  },

  todayBtnText: {
    color: Colors.accent,
    ...Typography.caption,
    fontWeight: "700",
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },

  weekTextWrapper: {
    width: "14.2857%",
    alignItems: "center",
  },

  weekText: {
    textAlign: "center",
    color: Colors.textSecondary,
    ...Typography.caption,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCellWrapper: {
    width: "14.2857%",
    aspectRatio: 1,
    padding: Spacing.xs,
  },

  dayCell: {
    flex: 1,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },

  dayCellToday: {
    borderWidth: 1.5,
    borderColor: Colors.accentLight,
  },

  dayCellSelected: {
    backgroundColor: Colors.primary,
  },

  dayNumber: {
    color: Colors.text,
    ...Typography.label,
  },

  dayNumberSelected: {
    color: Colors.white,
    fontWeight: "800",
  },

  dotsRow: {
    flexDirection: "row",
    gap: Spacing.xs,
    minHeight: 6,
    alignItems: "center",
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  dotOverflowText: {
    ...Typography.caption,
    fontWeight: "700",
  },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: Spacing.xl,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  legendRing: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.accentLight,
  },

  legendText: {
    color: Colors.textSecondary,
    ...Typography.caption,
  },

  dayDetailCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.sm,
  },

  dayDetailTitle: {
    color: Colors.text,
    ...Typography.body,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  pendingContainer: {
    gap: Spacing.md,
  },

  pendingTitle: {
    color: Colors.white,
    ...Typography.subtitle,
  },

  reminderCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  reminderDateBlock: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  reminderDateDay: {
    color: Colors.white,
    ...Typography.subtitle,
    fontWeight: "800",
  },

  reminderDateMonth: {
    color: alpha(Colors.white, 0.85),
    ...Typography.caption,
    textTransform: "uppercase",
    marginTop: 2,
  },

  reminderName: {
    color: Colors.text,
    ...Typography.label,
  },

  reminderSub: {
    color: Colors.textSecondary,
    ...Typography.caption,
    marginTop: Spacing.xs,
  },

  emptyText: {
    color: alpha(Colors.white, 0.85),
    textAlign: "center",
  },

  emptyTextCard: {
    color: Colors.textSecondary,
    textAlign: "center",
  },

  flexOne: {
    flex: 1,
  },
});
