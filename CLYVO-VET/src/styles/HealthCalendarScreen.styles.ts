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
    backgroundColor: Colors.primary,
  },

  pawWatermark: {
    position: "absolute",
    bottom: 120,
    left: 16,
    transform: [{ rotate: "-15deg" }],
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },

  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: alpha(Colors.white, 0.15),
    alignItems: "center",
    justifyContent: "center",
  },

  titleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  titleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: alpha(Colors.white, 0.25),
  },

  title: {
    color: Colors.white,
    ...Typography.subtitle,
    letterSpacing: 0.2,
  },

  scrollContent: {
    padding: Spacing.lg,
    // Clareia a tab bar flutuante (altura 82 + offset 18).
    paddingBottom: Spacing.huge * 3,
    gap: Spacing.lg,
  },

  todayCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },

  todayCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  todayCardTitle: {
    color: Colors.text,
    ...Typography.label,
    fontWeight: "700",
  },

  todayCountBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  todayCountText: {
    color: Colors.white,
    ...Typography.caption,
    fontWeight: "700",
  },

  todayEmptyText: {
    color: Colors.textLight,
    ...Typography.caption,
    marginTop: Spacing.sm,
  },

  todayList: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },

  todayItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  todayItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  todayItemName: {
    color: Colors.text,
    ...Typography.label,
  },

  todayItemPet: {
    color: Colors.textSecondary,
    ...Typography.caption,
    marginTop: 1,
  },

  flexOne: {
    flex: 1,
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

  tapHint: {
    color: Colors.textLight,
    ...Typography.caption,
    textAlign: "center",
    marginBottom: Spacing.sm,
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

  emptyText: {
    color: alpha(Colors.white, 0.85),
    textAlign: "center",
  },
});
