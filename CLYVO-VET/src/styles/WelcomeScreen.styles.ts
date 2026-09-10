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

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    // Respiro vertical proporcional à altura do aparelho (tela de splash).
    paddingTop: height * 0.06,
    paddingBottom: height * 0.04,
    justifyContent: "space-between",
    overflow: "hidden",
  },

  // Círculos decorativos proporcionais à largura da tela — fora da escala de radius.
  orb1: {
    position: "absolute",
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    backgroundColor: Colors.secondary,
    top: -width * 0.35,
    right: -width * 0.25,
    opacity: 0.55,
  },

  orb2: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    backgroundColor: Colors.accentLight,
    bottom: height * 0.18,
    left: -width * 0.2,
    opacity: 0.08,
  },

  orb3: {
    position: "absolute",
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    backgroundColor: Colors.accent,
    bottom: -width * 0.1,
    right: -width * 0.05,
    opacity: 0.12,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
  },

  logoWrap: {
    alignItems: "center",
    marginBottom: Spacing.xs,
  },

  logoRing: {
    width: 88,
    height: 88,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.overlaySoft,
    borderWidth: 1.5,
    borderColor: Colors.overlayMedium,
    justifyContent: "center",
    alignItems: "center",
  },

  logoBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.lg,
    shadowColor: Colors.accentLight,
  },

  brand: {
    ...Typography.display,
    color: Colors.white,
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },

  brandAccent: {
    color: Colors.accentLight,
    fontWeight: "300",
  },

  tagline: {
    ...Typography.title,
    color: alpha(Colors.white, 0.75),
    textAlign: "center",
  },

  taglineHL: {
    color: Colors.white,
    fontWeight: "800",
  },

  pillsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },

  pill: {
    backgroundColor: Colors.overlaySubtle,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  pillText: {
    color: alpha(Colors.white, 0.7),
    ...Typography.caption,
    letterSpacing: 0.3,
  },

  actions: {
    gap: Spacing.md,
    paddingTop: Spacing.sm,
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
    letterSpacing: 0.3,
  },

  btnArrow: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.overlayStrong,
    justifyContent: "center",
    alignItems: "center",
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
    color: alpha(Colors.white, 0.75),
    ...Typography.body,
  },

  legal: {
    textAlign: "center",
    ...Typography.caption,
    color: alpha(Colors.white, 0.3),
    marginTop: Spacing.xs,
  },
});
