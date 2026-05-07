import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../styles/colors";

const { width } = Dimensions.get("window");
export const DAY_SIZE = Math.floor((width - 48 - 36) / 7);

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: Colors.white },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 1 },
  calendarCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20, marginTop: 20,
    borderRadius: 20, padding: 18,
    shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
  },
  calNavRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 18,
  },
  calNavBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.background,
    justifyContent: "center", alignItems: "center",
  },
  calMonthLabel: { fontSize: 16, fontWeight: "800", color: Colors.text, textTransform: "capitalize" },
  weekRow: { flexDirection: "row", marginBottom: 8 },
  weekLabel: {
    width: DAY_SIZE, textAlign: "center",
    fontSize: 11, fontWeight: "700",
    color: Colors.textSecondary, textTransform: "uppercase",
  },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: DAY_SIZE, height: DAY_SIZE,
    justifyContent: "center", alignItems: "center",
    borderRadius: DAY_SIZE / 2.5, marginBottom: 4,
  },
  dayCellToday: { backgroundColor: Colors.primary + "18" },
  dayCellSelected: { backgroundColor: Colors.primary },
  dayNum: { fontSize: 13, fontWeight: "500", color: Colors.text },
  dayNumToday: { fontWeight: "800", color: Colors.primary },
  dayNumSelected: { fontWeight: "800", color: Colors.white },
  dayNumOtherMonth: { color: Colors.textSecondary, opacity: 0.4 },
  eventDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.accentGreen, marginTop: 2 },
  eventsSection: { paddingHorizontal: 20, marginTop: 24, flex: 1 },
  eventsSectionTitle: { fontSize: 15, fontWeight: "800", color: Colors.text, marginBottom: 14 },
  eventCard: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 14,
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    borderLeftWidth: 3,
  },
  eventIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  eventCardTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  eventCardPet: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  eventCardDate: {
    fontSize: 11, color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  emptyDay: { alignItems: "center", paddingVertical: 32, gap: 10 },
  emptyDayText: { color: Colors.textSecondary, fontSize: 14, textAlign: "center" },
  legend: { flexDirection: "row", gap: 16, paddingHorizontal: 20, marginTop: 12, marginBottom: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: Colors.textSecondary, fontWeight: "500" },
});