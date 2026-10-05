import { theme, makeStyles } from "../theme";
import { TAB_BAR_CLEARANCE } from "./MainTabs.styles";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  alpha,
} = theme;

export const useAddPetScreenStyles = makeStyles((Colors) => ({
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

  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    ...Typography.subtitle,
    color: Colors.text,
  },

  content: {
    padding: Spacing.xl,
    paddingBottom: TAB_BAR_CLEARANCE,
  },

  avatarArea: {
    alignItems: "center",
    marginBottom: Spacing.xxxl,
    gap: Spacing.md,
  },

  avatarWrap: {
    width: 80,
    height: 80,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.secondary,
    borderWidth: 1.5,
    borderColor: Colors.overlaySoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarCameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.accentLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarHint: {
    ...Typography.subtitle,
    color: Colors.text,
  },

  avatarHintSmall: {
    ...Typography.caption,
    color: Colors.textLight,
  },

  label: {
    ...Typography.label,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },

  errorText: {
    ...Typography.caption,
    color: Colors.accentRed,
    marginTop: Spacing.sm,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },

  loadingText: {
    ...Typography.label,
    color: Colors.textLight,
  },

  input: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    color: Colors.text,
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  inputError: {
    borderColor: Colors.accentRed,
  },

  row: {
    flexDirection: "row",
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },

  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.overlaySoft,
  },

  chipSelected: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accentLight,
  },

  chipText: {
    ...Typography.label,
    color: Colors.textLight,
  },

  chipTextSelected: {
    color: Colors.onAccent,
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.xxxl,
  },

  saveBtnDisabled: {
    opacity: 0.5,
  },

  saveBtnText: {
    ...Typography.body,
    color: Colors.onAccent,
  },
}));
