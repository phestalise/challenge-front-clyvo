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
  header: {
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
  },

  centerArea: {
    flex: 1,
    alignItems: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  logo: {
    ...Typography.display,
    color: Colors.white,
    letterSpacing: 1,
  },

  greeting: {
    ...Typography.subtitle,
    color: Colors.white,
    marginTop: Spacing.xs,
  },

  date: {
    marginTop: Spacing.sm,
    ...Typography.label,
    color: alpha(Colors.white, 0.55),
    textTransform: "capitalize",
  },

  screenTitle: {
    flex: 1,
    textAlign: "center",
    ...Typography.title,
    color: Colors.white,
  },

  menuButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.xl,
    backgroundColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  rightSpacer: {
    width: 52,
  },
});
