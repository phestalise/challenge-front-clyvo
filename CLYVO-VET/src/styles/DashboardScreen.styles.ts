import { StyleSheet } from "react-native";

import { theme } from "../theme";

const {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

// Círculos decorativos de fundo do estado vazio — fora da escala de radius
// (raio = metade do tamanho), mesmo espírito dos orbs do RegisterScreen.
const ORB_TOP_SIZE = 240;
const ORB_BOTTOM_SIZE = 220;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  orbTop: {
    position: "absolute",
    top: -100,
    right: -80,
    width: ORB_TOP_SIZE,
    height: ORB_TOP_SIZE,
    borderRadius: ORB_TOP_SIZE / 2,
    backgroundColor: alpha(Colors.accentLight, 0.1),
  },

  orbBottom: {
    position: "absolute",
    bottom: 60,
    left: -90,
    width: ORB_BOTTOM_SIZE,
    height: ORB_BOTTOM_SIZE,
    borderRadius: ORB_BOTTOM_SIZE / 2,
    backgroundColor: alpha(Colors.accent, 0.12),
  },

  pawWatermarkTop: {
    position: "absolute",
    top: 30,
    left: -25,
    transform: [{ rotate: "-20deg" }],
  },

  pawWatermarkBottom: {
    position: "absolute",
    bottom: 200,
    right: -10,
    transform: [{ rotate: "18deg" }],
  },

  content: {
    // Clareia a tab bar flutuante (altura 82 + offset 18).
    paddingBottom: Spacing.huge * 3,
  },

  contentCentered: {
    flexGrow: 1,
    justifyContent: "center",
  },

  topHeader: {
    height: Spacing.md,
  },

  chatFab: {
    position: "absolute",
    right: Spacing.lg,
    bottom: 120,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },

  emptyState: {
    alignItems: "center",
    paddingHorizontal: Spacing.xxl,
  },

  emptyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.secondary,
    marginBottom: Spacing.xl,
  },

  emptyBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentOnDark,
  },

  emptyBadgeText: {
    color: Colors.textLight,
    ...Typography.caption,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  emptyLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: alpha(Colors.accent, 0.18),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
    borderColor: alpha(Colors.accentOnDark, 0.35),
  },

  emptyTitle: {
    ...Typography.display,
    color: Colors.accentOnDark,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },

  emptySubtitle: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: Spacing.xxl,
  },

  emptyCta: {
    height: 56,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xxl,
    backgroundColor: Colors.accent,
    ...Shadows.md,
  },

  emptyCtaText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: "700",
  },

  emptyCtaArrow: {
    position: "absolute",
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: alpha(Colors.white, 0.2),
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.white,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },

  card: {
    width: "48%",
    minHeight: 108,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.accentLight,
    ...Shadows.sm,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },

  cardIconChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  cardEmpty: {
    alignItems: "center",
    gap: Spacing.sm,
  },

  cardValue: {
    ...Typography.display,
    color: Colors.text,
  },

  cardLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
});
