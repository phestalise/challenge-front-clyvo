

import {
  StyleSheet,
} from "react-native";

import { Colors } from "./colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.secondary,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor:
      "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },

  headerSpace: {
    width: 40,
  },

  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  monthText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  weekText: {
    width: "14.2%",
    textAlign: "center",
    color: Colors.textLight,
    fontWeight: "600",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },

  dayCard: {
    width: "14.2%",
    minHeight: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 4,
  },

  emptyDayCard: {
    backgroundColor: "transparent",
  },

  dayNumber: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  eventList: {
    gap: 4,
  },

  eventBadge: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },

  eventBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "600",
  },

  moreText: {
    color: Colors.textLight,
    fontSize: 10,
    marginTop: 2,
  },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 24,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendText: {
    color: Colors.textLight,
    fontSize: 12,
  },

  pendingContainer: {
    padding: 16,
    gap: 12,
    marginTop: 20,
  },

  pendingTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },

  pendingCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  pendingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  pendingName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  pendingPet: {
    color: Colors.textLight,
    fontSize: 12,
    marginTop: 2,
  },

  pendingDate: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 2,
  },

  emptyText: {
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 20,
  },

  flexOne: {
    flex: 1,
  },
});