import { StyleSheet } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
} = theme;

export const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    left: Spacing.xl,
    right: Spacing.xl,
    bottom: Spacing.xl,
    height: 82,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    elevation: 0,
  },

  tabBarLabelStyle: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },

  tabIcon: {
    width: 46,
    height: 46,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTabIcon: {
    backgroundColor: Colors.overlaySoft,
  },
});
