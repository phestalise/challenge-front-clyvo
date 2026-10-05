import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

export const usePetCardStyles = makeStyles((Colors) => ({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
    gap: Spacing.md,
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: alpha(Colors.accent, 0.08),
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
    gap: Spacing.xs,
  },

  name: {
    ...Typography.body,
    color: Colors.text,
  },

  meta: {
    ...Typography.label,
    color: Colors.textSecondary,
  },

  tags: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },

  tag: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },

  tagText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  healthLabel: {
    ...Typography.caption,
    color: Colors.textLight,
    width: 38,
  },

  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: Radius.sm,
  },

  healthPct: {
    ...Typography.caption,
    width: 36,
    textAlign: "right",
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },

  statText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
}));
