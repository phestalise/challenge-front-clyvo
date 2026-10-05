import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

export const useDashboardScreenStyles = makeStyles((Colors) => ({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    // Clareia a tab bar flutuante (altura 82 + offset 20).
    paddingBottom: Spacing.huge * 3,
    gap: Spacing.xxl,
  },

  contentCentered: {
    flexGrow: 1,
    justifyContent: "center",
  },

  // ── Saudação ───────────────────────────────────────────────────────────
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  greetingText: {
    flex: 1,
  },

  greeting: {
    ...Typography.display,
    fontSize: 26,
    lineHeight: 32,
    color: Colors.text,
  },

  date: {
    ...Typography.label,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: "capitalize",
  },

  avatarBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarBtnText: {
    ...Typography.subtitle,
    color: Colors.onAccent,
  },

  // ── Seções ─────────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.text,
  },

  sectionLink: {
    ...Typography.label,
    color: Colors.accent,
  },

  // ── Atenção ────────────────────────────────────────────────────────────
  attentionCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },

  attentionOk: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: alpha(Colors.accentGreen, 0.1),
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },

  attentionOkTitle: {
    ...Typography.label,
    fontWeight: "700",
    color: Colors.text,
  },

  attentionOkText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },

  attentionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  attentionRowDivider: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  attentionIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  attentionInfo: {
    flex: 1,
  },

  attentionName: {
    ...Typography.label,
    color: Colors.text,
  },

  attentionPet: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },

  attentionChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },

  attentionChipText: {
    ...Typography.caption,
    fontWeight: "700",
  },

  attentionMore: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: Spacing.sm,
  },

  // ── Ações rápidas ──────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  action: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.sm,
  },

  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },

  actionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  // ── Pets ───────────────────────────────────────────────────────────────
  petsRow: {
    gap: Spacing.md,
    paddingRight: Spacing.xl,
  },

  petCard: {
    width: 124,
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  petAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: alpha(Colors.accent, 0.12),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: Spacing.xs,
  },

  petAvatarImage: {
    width: "100%",
    height: "100%",
  },

  petAvatarInitial: {
    ...Typography.title,
    color: Colors.accent,
  },

  petName: {
    ...Typography.label,
    color: Colors.text,
  },

  petStatus: {
    ...Typography.caption,
  },

  petAddCard: {
    width: 124,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.border,
  },

  petAddText: {
    ...Typography.label,
    color: Colors.textMuted,
  },

  // ── Resumo ─────────────────────────────────────────────────────────────
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },

  statCard: {
    width: "48%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    ...Typography.title,
    color: Colors.text,
  },

  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  // ── Estado vazio ───────────────────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },

  emptyLogo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: alpha(Colors.accent, 0.12),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },

  emptyTitle: {
    ...Typography.title,
    color: Colors.text,
    textAlign: "center",
  },

  emptySubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: Spacing.md,
  },

  emptyCta: {
    height: 54,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accent,
  },

  emptyCtaText: {
    ...Typography.body,
    color: Colors.onAccent,
    fontWeight: "700",
  },
}));
