import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
} = theme;

export const useVaccineCardStyles = makeStyles((Colors) => ({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  info: {
    flex: 1,
    gap: Spacing.xs,
  },

  name: {
    ...Typography.label,
    fontWeight: "600",
    color: Colors.text,
  },

  sub: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  dates: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },

  date: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },

  badgeText: {
    ...Typography.caption,
    color: Colors.onAccent,
  },
}));
