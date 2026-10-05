import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  alpha,
} = theme;

// Tela minimalista: fundo limpo, grade sem cartão e agenda do dia em lista.
export const useHealthCalendarScreenStyles = makeStyles((Colors) => ({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },

  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: Colors.text,
    ...Typography.subtitle,
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    // Clareia a tab bar flutuante (altura 82 + offset 20).
    paddingBottom: Spacing.huge * 3,
  },

  // ── Mês ────────────────────────────────────────────────────────────────
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },

  monthTitleWrap: {
    flex: 1,
  },

  monthText: {
    color: Colors.text,
    ...Typography.display,
    fontSize: 26,
    lineHeight: 32,
    textTransform: "capitalize",
  },

  monthSub: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginTop: 2,
  },

  monthNavRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  monthNavBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  todayBtn: {
    paddingHorizontal: Spacing.md,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: alpha(Colors.accent, 0.1),
  },

  todayBtnText: {
    color: Colors.accent,
    ...Typography.label,
  },

  // ── Grade ──────────────────────────────────────────────────────────────
  weekRow: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
  },

  weekTextWrapper: {
    width: "14.2857%",
    alignItems: "center",
  },

  weekText: {
    color: Colors.textMuted,
    ...Typography.caption,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCellWrapper: {
    width: "14.2857%",
    height: 54,
    padding: 2,
  },

  dayCell: {
    flex: 1,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  dayCellToday: {
    backgroundColor: alpha(Colors.accent, 0.1),
  },

  dayCellSelected: {
    backgroundColor: Colors.accent,
  },

  dayNumber: {
    color: Colors.text,
    ...Typography.body,
    fontWeight: "500",
  },

  dayNumberToday: {
    color: Colors.accent,
    fontWeight: "700",
  },

  dayNumberSelected: {
    color: Colors.onAccent,
    fontWeight: "700",
  },

  dotsRow: {
    flexDirection: "row",
    gap: 3,
    height: 6,
    alignItems: "center",
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  dotOverflowText: {
    ...Typography.caption,
    fontSize: 9,
    lineHeight: 10,
    fontWeight: "700",
  },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xl,
    marginTop: Spacing.md,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },

  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  legendText: {
    color: Colors.textMuted,
    ...Typography.caption,
  },

  // ── Agenda do dia ──────────────────────────────────────────────────────
  agenda: {
    marginTop: Spacing.xxl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  agendaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },

  agendaTitle: {
    color: Colors.text,
    ...Typography.subtitle,
    textTransform: "capitalize",
  },

  agendaCount: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginTop: 2,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accent,
  },

  addBtnText: {
    color: Colors.onAccent,
    ...Typography.label,
  },

  eventList: {
    gap: Spacing.sm,
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
  },

  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  eventInfo: {
    flex: 1,
  },

  eventName: {
    color: Colors.text,
    ...Typography.label,
  },

  eventPet: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginTop: 2,
  },

  eventChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },

  eventChipText: {
    ...Typography.caption,
    fontWeight: "700",
  },

  emptyAgenda: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },

  emptyAgendaText: {
    color: Colors.textMuted,
    ...Typography.label,
    textAlign: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: Colors.accentRed,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
}));
