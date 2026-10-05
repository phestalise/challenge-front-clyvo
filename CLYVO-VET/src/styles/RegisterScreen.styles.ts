import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  alpha,
} = theme;

// Círculos decorativos de fundo — fora da escala de radius (raio = metade do tamanho).
const ORB_TOP_SIZE = 240;
const ORB_BOTTOM_SIZE = 220;

export const useRegisterScreenStyles = makeStyles((Colors) => ({
  flex: {
    flex: 1,
  },

  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    paddingBottom: Spacing.huge,
  },

  orb: {
    position: "absolute",
    top: -120,
    right: -80,
    width: ORB_TOP_SIZE,
    height: ORB_TOP_SIZE,
    borderRadius: ORB_TOP_SIZE / 2,
    backgroundColor: alpha(Colors.text, 0.13),
  },

  orbBottom: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: ORB_BOTTOM_SIZE,
    height: ORB_BOTTOM_SIZE,
    borderRadius: ORB_BOTTOM_SIZE / 2,
    backgroundColor: alpha(Colors.text, 0.07),
  },

  header: {
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  logo: {
    ...Typography.label,
    color: Colors.accentLight,
    letterSpacing: 1,
  },

  headerSpacer: {
    width: 44,
  },

  badgeRow: {
    alignItems: "center",
    marginTop: Spacing.md,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.card,
  },

  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accent,
  },

  badgeText: {
    color: Colors.textSecondary,
    ...Typography.caption,
    letterSpacing: 1,
  },

  title: {
    marginTop: Spacing.xxl,
    textAlign: "center",
    color: Colors.accent,
    ...Typography.display,
  },

  sub: {
    marginTop: Spacing.lg,
    textAlign: "center",
    color: Colors.textSecondary,
    ...Typography.body,
    paddingHorizontal: Spacing.xxxl,
  },

  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },

  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  stepDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.overlaySoft,
  },

  stepDotActive: {
    backgroundColor: Colors.accent,
  },

  stepDotDone: {
    backgroundColor: Colors.accent,
  },

  stepLabel: {
    marginLeft: Spacing.sm,
    color: Colors.textSecondary,
    ...Typography.caption,
  },

  stepLabelActive: {
    color: Colors.accent,
  },

  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.overlaySoft,
    marginHorizontal: Spacing.md,
  },

  stepLineDone: {
    backgroundColor: Colors.accent,
  },

  formCard: {
    marginHorizontal: Spacing.xl,
    padding: Spacing.xxl,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.card,
  },

  sectionTitle: {
    color: Colors.accent,
    ...Typography.subtitle,
    marginBottom: Spacing.xl,
  },

  dividerField: {
    height: Spacing.lg,
  },

  passwordHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  passwordHintText: {
    color: Colors.textSecondary,
    ...Typography.caption,
    flex: 1,
  },

  actions: {
    marginTop: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },

  btnPrimary: {
    height: 58,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  btnPrimaryText: {
    color: Colors.onAccent,
    ...Typography.body,
  },

  btnArrow: {
    position: "absolute",
    right: Spacing.xl,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.overlaySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.xxl,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.overlaySoft,
  },

  dividerText: {
    marginHorizontal: Spacing.lg,
    color: Colors.textSecondary,
    ...Typography.caption,
  },

  btnSecondary: {
    height: 56,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.card,
  },

  btnSecondaryText: {
    color: Colors.accent,
    ...Typography.body,
  },

  legalRow: {
    marginTop: Spacing.xxl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },

  legalText: {
    color: Colors.textSecondary,
    ...Typography.caption,
  },
}));
