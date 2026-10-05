import { Colors, alpha } from "./colors";
import { Typography } from "./typography";
import { Spacing } from "./spacing";
import { Radius } from "./radius";
import { Shadows } from "./shadows";

export const theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
  alpha,
};

export type Theme = typeof theme;

export { Colors, alpha } from "./colors";
export type { ColorToken } from "./colors";
export { Typography } from "./typography";
export type { TypographyToken } from "./typography";
export { Spacing } from "./spacing";
export type { SpacingToken } from "./spacing";
export { Radius } from "./radius";
export type { RadiusToken } from "./radius";
export { Shadows } from "./shadows";
export type { ShadowToken } from "./shadows";

export { ThemeProvider, useTheme, makeStyles } from "./ThemeContext";
export type { ThemeMode } from "./ThemeContext";
export type { ColorScheme, ThemeColors } from "./colors";
