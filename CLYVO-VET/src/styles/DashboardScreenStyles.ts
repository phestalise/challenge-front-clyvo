import { StyleSheet } from "react-native";
import { Colors } from "./colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.white,
  },

  date: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
    textTransform: "capitalize",
  },

  notif: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor:
      "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentRed,
  },

  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 20,
    marginBottom: 4,
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 14,
  },

  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accent + "40",
    justifyContent: "center",
    alignItems: "center",
  },

  aiText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    flex: 1,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    padding: 20,
    paddingTop: 16,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  bottomSection: {
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 14,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  quickBtn: {
    alignItems: "center",
    gap: 8,
  },

  quickIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  quickLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  petChip: {
    width: 110,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  petChipAvatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor:
      Colors.accentLight + "15",
    justifyContent: "center",
    alignItems: "center",
  },

  petChipName: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },

  petChipMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
  },

  petChipAdd: {
    width: 90,
    backgroundColor: Colors.card,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor:
      Colors.accentLight + "35",
    borderStyle: "dashed",
  },

  emptyBox: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },

  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },

  eventRow: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

  eventIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  eventInfo: {
    flex: 1,
  },

  eventName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },

  eventPet: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  eventDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
});