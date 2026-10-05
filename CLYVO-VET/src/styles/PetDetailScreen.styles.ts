import { theme, makeStyles } from "../theme";
import { TAB_BAR_CLEARANCE } from "./MainTabs.styles";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
} = theme;

const AVATAR_SIZE = 88;

// Espaço inferior do conteúdo = altura da tab bar flutuante + folga, para
// nada ficar escondido atrás dela (ver TAB_BAR_CLEARANCE) + respiro extra.
const CONTENT_BOTTOM_PADDING = TAB_BAR_CLEARANCE + Spacing.xxl;

export const usePetDetailScreenStyles = makeStyles((Colors) => ({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },

  loadingText: {
    ...Typography.body,
    color: Colors.textLight,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },

  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.overlaySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },

  logo: {
    ...Typography.label,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: 1,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  pageBadge: {
    maxWidth: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: alpha(Colors.text, 0.12),
  },

  pageBadgeText: {
    ...Typography.caption,
    fontWeight: "700",
    color: Colors.accentLight,
  },

  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: CONTENT_BOTTOM_PADDING,
  },

  avatarWrap: {
    alignItems: "center",
    marginTop: Spacing.md,
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: alpha(Colors.accentLight, 0.15),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarInitial: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.accentLight,
  },

  petName: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginTop: Spacing.md,
  },

  petMeta: {
    ...Typography.label,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 2,
  },

  chips: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
    marginTop: Spacing.md,
  },

  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: Colors.overlaySoft,
  },

  chipText: {
    ...Typography.caption,
    color: Colors.textLight,
  },

  sectionLabel: {
    ...Typography.caption,
    fontWeight: "700",
    color: Colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },

  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },

  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  ringNum: {
    ...Typography.label,
    fontWeight: "700",
  },

  ringLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  summaryDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: Colors.border,
  },

  summaryStats: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryStat: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },

  summaryStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },

  checkupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  checkupLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  checkupValue: {
    ...Typography.label,
    fontWeight: "700",
    color: Colors.text,
  },

  summaryLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  tabsRow: {
    flexDirection: "row",
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    padding: Spacing.xs,
    gap: Spacing.xs,
    marginTop: Spacing.xl,
  },

  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },

  tabBtnActive: {
    backgroundColor: Colors.surfaceRaised,
    ...Shadows.card,
  },

  tabBtnText: {
    ...Typography.caption,
    fontWeight: "600",
    color: Colors.textLight,
  },

  tabBtnTextActive: {
    color: Colors.accentLight,
  },

  infoBlock: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    overflow: "hidden",
    marginTop: Spacing.lg,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  infoKey: {
    ...Typography.label,
    color: Colors.textMuted,
  },

  infoVal: {
    ...Typography.label,
    fontWeight: "600",
    color: Colors.text,
  },

  tabContent: {
    marginTop: Spacing.lg,
  },

  tabEmpty: {
    alignItems: "center",
    marginTop: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },

  tabEmptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },

  secondaryBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  secondaryBtnText: {
    ...Typography.label,
    fontWeight: "600",
    color: Colors.accentLight,
  },

  menuBackdrop: {
    flex: 1,
    backgroundColor: alpha(Colors.black, 0.15),
  },

  menuCard: {
    position: "absolute",
    minWidth: 132,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
  },

  menuItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  menuItemDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },

  menuItemText: {
    ...Typography.label,
    color: Colors.text,
  },

  menuItemTextDanger: {
    ...Typography.label,
    fontWeight: "600",
    color: Colors.accentRed,
  },
}));
