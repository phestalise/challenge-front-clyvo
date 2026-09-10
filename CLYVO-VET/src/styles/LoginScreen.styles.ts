import { StyleSheet, Dimensions } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  keyboardContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  content: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.huge,
  },

  // Círculos decorativos proporcionais à largura da tela — fora da escala de radius.
  orb: {
    position: "absolute",
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: Colors.secondary,
    top: -width * 0.28,
    right: -width * 0.22,
    opacity: 0.5,
  },

  orbBottom: {
    position: "absolute",
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: (width * 0.45) / 2,
    backgroundColor: Colors.accentLight,
    bottom: -width * 0.15,
    left: -width * 0.15,
    opacity: 0.06,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.huge,
    paddingTop: Spacing.sm,
  },

  back: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.overlaySoft,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  logo: {
    color: Colors.white,
    ...Typography.label,
    letterSpacing: 2,
  },

  headerSpacer: {
    width: 44,
  },

  badgeRow: {
    marginBottom: Spacing.lg,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.overlaySoft,
    borderWidth: 1,
    borderColor: Colors.overlayMedium,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentLight,
  },

  badgeText: {
    color: Colors.accentLight,
    ...Typography.caption,
    letterSpacing: 1.5,
  },

  title: {
    ...Typography.display,
    color: Colors.white,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },

  sub: {
    ...Typography.body,
    color: alpha(Colors.white, 0.45),
    marginBottom: Spacing.xxxl,
  },

  formCard: {
    backgroundColor: Colors.overlaySubtle,
    borderRadius: Radius.xxl,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },

  dividerField: {
    height: 1,
    backgroundColor: Colors.overlaySubtle,
    marginVertical: Spacing.xs,
  },

  forgotRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: Spacing.sm,
  },

  forgotBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },

  forgotText: {
    color: Colors.accentLight,
    ...Typography.label,
  },

  actions: {
    gap: Spacing.md,
  },

  btnPrimary: {
    backgroundColor: Colors.accentLight,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    ...Shadows.lg,
    shadowColor: Colors.accentLight,
  },

  btnPrimaryText: {
    ...Typography.body,
    color: Colors.primary,
    letterSpacing: 0.2,
  },

  btnArrow: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.overlayStrong,
    justifyContent: "center",
    alignItems: "center",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginVertical: Spacing.xs,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.overlaySoft,
  },

  dividerText: {
    color: alpha(Colors.white, 0.25),
    ...Typography.label,
  },

  btnSecondary: {
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.overlayMedium,
    backgroundColor: Colors.overlaySubtle,
  },

  btnSecondaryText: {
    color: alpha(Colors.white, 0.7),
    ...Typography.body,
  },

  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },

  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },

  trustText: {
    color: alpha(Colors.white, 0.3),
    ...Typography.caption,
  },
});
