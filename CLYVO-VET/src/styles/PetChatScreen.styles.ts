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

// Compensa a ausência de SafeAreaView neste header (substitui o inset da status bar).
const STATUS_BAR_OFFSET = 56;

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: STATUS_BAR_OFFSET,
    paddingBottom: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.overlaySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  headerInfo: {
    flex: 1,
  },

  headerTitle: {
    ...Typography.subtitle,
    color: Colors.white,
  },

  headerSub: {
    ...Typography.caption,
    color: alpha(Colors.white, 0.5),
    marginTop: Spacing.xs,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.overlayMedium,
    justifyContent: "center",
    alignItems: "center",
  },

  messagesList: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  welcome: {
    alignItems: "center",
    marginTop: Spacing.huge * 2,
    gap: Spacing.md,
  },

  welcomeTitle: {
    color: Colors.white,
    ...Typography.title,
  },

  welcomeText: {
    color: Colors.textSecondary,
    ...Typography.label,
    textAlign: "center",
  },

  msgRow: {
    marginBottom: Spacing.lg,
  },

  msgRowUser: {
    alignItems: "flex-end",
  },

  msgRowAi: {
    alignItems: "flex-start",
  },

  msgBubbleUser: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    borderBottomRightRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    maxWidth: width * 0.75,
  },

  msgBubbleAi: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderBottomLeftRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    maxWidth: width * 0.78,
    ...Shadows.sm,
  },

  msgTextUser: {
    color: Colors.white,
    ...Typography.label,
  },

  msgTextAi: {
    color: Colors.text,
    ...Typography.label,
  },

  typingBubble: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderBottomLeftRadius: Radius.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: Spacing.lg,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },

  inputWrap: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    maxHeight: 100,
  },

  input: {
    ...Typography.label,
    color: Colors.text,
  },

  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.md,
    shadowColor: Colors.primary,
  },

  sendBtnDisabled: {
    backgroundColor: Colors.background,
    shadowOpacity: 0,
    elevation: 0,
  },
});
