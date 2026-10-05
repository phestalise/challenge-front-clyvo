import { theme, makeStyles } from "../theme";

const {
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
} = theme;

// Altura da barra flutuante (82) + distância até a borda da tela (Spacing.xl)
// + folga extra para o conteúdo não colar nela.
export const TAB_BAR_CLEARANCE = Spacing.huge * 3;

export const useMainTabsStyles = makeStyles((Colors) => ({
  tabBarStyle: {
    position: "absolute",
    left: Spacing.xl,
    right: Spacing.xl,
    bottom: Spacing.xl,
    height: 82,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },

  tabBarLabelStyle: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },

  tabIcon: {
    width: 46,
    height: 46,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTabIcon: {
    backgroundColor: Colors.overlaySoft,
  },
}));
