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
  wrapper: {
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },

  label: {
    ...Typography.label,
    letterSpacing: 0.3,
  },

  labelLight: {
    color: Colors.textSecondary,
  },

  labelDark: {
    color: alpha(Colors.white, 0.8),
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    gap: Spacing.md,
  },

  inputBoxLight: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },

  inputBoxDark: {
    backgroundColor: Colors.overlaySoft,
    borderColor: Colors.overlaySoft,
  },

  inputBoxError: {
    borderColor: Colors.accentRed,
  },

  input: {
    flex: 1,
    ...Typography.body,
  },

  inputTextLight: {
    color: Colors.text,
  },

  inputTextDark: {
    color: Colors.white,
  },

  iconLeft: {
    justifyContent: "center",
    alignItems: "center",
  },

  iconRight: {
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xs,
  },

  errorText: {
    ...Typography.caption,
    color: Colors.accentRed,
    marginTop: Spacing.xs,
  },
});
