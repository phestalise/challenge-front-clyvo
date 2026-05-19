// HealthScreenStyles.ts

import {
  StyleSheet,
} from "react-native";

import { Colors } from "./colors";

export const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.primary,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 16,

      backgroundColor:
        Colors.secondary,
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      color: Colors.white,
    },

    calendarBtn: {
      width: 40,
      height: 40,

      borderRadius: 12,

      backgroundColor:
        Colors.accentOrange +
        "20",

      alignItems: "center",
      justifyContent:
        "center",
    },

    content: {
      padding: 16,
      gap: 12,
      paddingBottom: 120,
    },

    sectionTitle: {
      fontSize: 11,

      color:
        "rgba(255,255,255,0.4)",

      letterSpacing: 0.5,

      textTransform:
        "uppercase",
    },

    petCard: {
      backgroundColor:
        Colors.secondary,

      borderRadius: 16,

      padding: 16,

      gap: 12,

      borderWidth: 1,

      borderColor:
        "rgba(255,255,255,0.06)",
    },

    petCardTop: {
      flexDirection: "row",

      alignItems: "center",

      gap: 12,
    },

    avatar: {
      width: 52,
      height: 52,

      borderRadius: 16,

      backgroundColor:
        Colors.accentLight +
        "20",

      justifyContent:
        "center",

      alignItems: "center",
    },

    flexOne: {
      flex: 1,
    },

    petName: {
      fontSize: 16,

      fontWeight: "700",

      color: Colors.white,
    },

    petMeta: {
      fontSize: 12,

      color:
        Colors.textLight,

      marginTop: 2,
    },

    scoreText: {
      fontSize: 18,

      fontWeight: "800",
    },

    progressBg: {
      height: 6,

      backgroundColor:
        "rgba(255,255,255,0.08)",

      borderRadius: 3,

      overflow: "hidden",
    },

    progressBar: {
      height: 6,

      borderRadius: 3,
    },

    petStats: {
      flexDirection: "row",

      justifyContent:
        "space-between",
    },

    petStat: {
      flexDirection: "row",

      alignItems: "center",

      gap: 4,
    },

    petStatText: {
      fontSize: 11,

      color:
        Colors.textLight,
    },

    empty: {
      alignItems: "center",

      justifyContent:
        "center",

      paddingTop: 100,

      gap: 12,
    },

    emptyText: {
      fontSize: 16,

      color:
        Colors.textSecondary,
    },

    emptyBtn: {
      marginTop: 8,

      backgroundColor:
        Colors.accentGreen,

      paddingHorizontal: 20,

      paddingVertical: 12,

      borderRadius: 14,
    },

    emptyBtnText: {
      color: Colors.white,

      fontWeight: "700",
    },
  });