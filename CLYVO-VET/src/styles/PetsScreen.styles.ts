import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

// Centralização vertical do estado vazio; não é um valor de ritmo de espaçamento.
const EMPTY_STATE_OFFSET = 90;

export const usePetsScreenStyles = makeStyles((Colors) => ({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },

  headerEyebrow: {
    color: Colors.text,
    ...Typography.display,
    fontSize: 26,
    lineHeight: 32,
  },

  headerCount: {
    marginTop: 2,
    color: Colors.textMuted,
    ...Typography.label,
  },

  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    paddingVertical: 0,
  },

  list: {
    padding: Spacing.xl,
    // Clareia a tab bar flutuante (altura 82 + offset 18).
    paddingBottom: Spacing.huge * 3,
    gap: Spacing.md,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: EMPTY_STATE_OFFSET,
  },

  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },

  emptyTitle: {
    ...Typography.title,
    color: Colors.text,
  },

  emptyText: {
    marginTop: Spacing.md,
    ...Typography.label,
    textAlign: "center",
    color: Colors.textLight,
  },

  emptyBtn: {
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentLight,
  },

  emptyBtnText: {
    ...Typography.body,
    color: Colors.onAccent,
  },

  // Card do pet: superfície do tema, borda fina e cantos de 16px.
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: alpha(Colors.accentLight, 0.12),
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarInitial: {
    ...Typography.subtitle,
    fontWeight: "700",
    color: Colors.accentLight,
  },

  cardInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },

  petName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    color: Colors.text,
  },

  petMeta: {
    marginTop: 2,
    ...Typography.caption,
    color: Colors.textMuted,
  },

  tagsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },

  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
  },

  tagText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  ringWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  ringText: {
    ...Typography.caption,
    fontWeight: "700",
  },

  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },

  statsText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
}));
