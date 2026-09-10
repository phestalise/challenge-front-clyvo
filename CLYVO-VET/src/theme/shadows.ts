import type { ViewStyle } from "react-native";
import { Colors } from "./colors";

/**
 * 3 níveis de elevação. Substitui os 7 valores soltos de `elevation` do app.
 */
type Shadow = Pick<
  ViewStyle,
  | "shadowColor"
  | "shadowOffset"
  | "shadowOpacity"
  | "shadowRadius"
  | "elevation"
>;

export const Shadows: Record<"sm" | "md" | "lg", Shadow> = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 10,
  },
};

export type ShadowToken = keyof typeof Shadows;
