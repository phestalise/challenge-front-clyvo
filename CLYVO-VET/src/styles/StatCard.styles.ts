import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
} = theme;

export const useStatCardStyles = makeStyles((Colors) => ({
  card: {
    flex: 1,
    minWidth: "42%",
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
    ...Shadows.sm,
  },

  value: {
    ...Typography.display,
    color: Colors.text,
  },

  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
}));
