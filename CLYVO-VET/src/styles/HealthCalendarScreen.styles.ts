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
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.secondary,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: Colors.white,
    ...Typography.subtitle,
  },

  headerSpace: {
    width: 40,
  },

  scrollContent: {
    padding: Spacing.lg,
    // Clareia a tab bar flutuante (altura 82 + offset 18).
    paddingBottom: Spacing.huge * 3,
    gap: Spacing.lg,
  },

  calendarCard: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.overlaySubtle,
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
    backgroundColor: Colors.overlaySubtle,
  },

  monthText: {
    color: Colors.white,
    ...Typography.subtitle,
    textTransform: "capitalize",
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
    color: Colors.textLight,
    ...Typography.caption,
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
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },

  dayCellToday: {
    borderWidth: 1.5,
    borderColor: Colors.accentLight,
  },

  dayCellSelected: {
    backgroundColor: Colors.accentLight,
  },

  dayNumber: {
    color: Colors.white,
    ...Typography.label,
  },

  dayNumberSelected: {
    color: Colors.primary,
    fontWeight: "800",
  },

  dotsRow: {
    flexDirection: "row",
    gap: Spacing.xs,
    height: 6,
    alignItems: "center",
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: Spacing.xl,
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.overlaySubtle,
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
    color: Colors.textLight,
    ...Typography.caption,
  },

  dayDetailCard: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.overlaySubtle,
  },

  dayDetailTitle: {
    color: Colors.white,
    ...Typography.body,
    textTransform: "capitalize",
  },

  pendingContainer: {
    gap: Spacing.md,
  },

  pendingTitle: {
    color: Colors.white,
    ...Typography.subtitle,
  },

  pendingCard: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  pendingIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  pendingName: {
    color: Colors.white,
    ...Typography.label,
  },

  pendingPet: {
    color: Colors.textLight,
    ...Typography.caption,
    marginTop: Spacing.xs,
  },

  pendingDate: {
    color: alpha(Colors.white, 0.5),
    ...Typography.caption,
    marginTop: Spacing.xs,
  },

  emptyText: {
    color: Colors.textLight,
    textAlign: "center",
  },

  flexOne: {
    flex: 1,
  },
});
