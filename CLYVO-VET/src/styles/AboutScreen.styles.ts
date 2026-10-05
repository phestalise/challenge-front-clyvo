import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

export const useAboutScreenStyles = makeStyles((Colors) => ({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    ...Typography.subtitle,
    color: Colors.text,
  },

  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
    gap: Spacing.lg,
  },

  hero: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },

  logoBox: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
    shadowColor: Colors.accentLight,
  },

  appName: {
    ...Typography.title,
    color: Colors.text,
    letterSpacing: 2,
  },

  tagline: {
    ...Typography.label,
    color: Colors.textLight,
    textAlign: "center",
  },

  card: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: alpha(Colors.accentLight, 0.25),
    ...Shadows.card,
  },

  cardTitle: {
    ...Typography.caption,
    color: Colors.textLight,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },

  rowLabel: {
    ...Typography.label,
    color: Colors.textLight,
  },

  rowValue: {
    ...Typography.label,
    color: Colors.text,
    flexShrink: 1,
    textAlign: "right",
  },

  commitBox: {
    backgroundColor: Colors.overlaySoft,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },

  commitShort: {
    ...Typography.title,
    color: Colors.accentOnDark,
    fontFamily: "monospace",
  },

  commitFull: {
    ...Typography.caption,
    color: Colors.textLight,
    fontFamily: "monospace",
  },

  text: {
    ...Typography.body,
    color: Colors.textSecondary,
  },

  member: {
    ...Typography.label,
    color: Colors.text,
  },
}));
