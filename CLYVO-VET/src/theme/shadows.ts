import { Platform } from "react-native";
import type { ViewStyle } from "react-native";
import { Colors } from "./colors";

type Shadow = Pick<
  ViewStyle,
  | "shadowColor"
  | "shadowOffset"
  | "shadowOpacity"
  | "shadowRadius"
  | "elevation"
> & { boxShadow?: string };

// No web, shadow* props são deprecated — usamos boxShadow (CSS).
// No nativo, mantemos shadow* (iOS) + elevation (Android).
export const Shadows: Record<"sm" | "md" | "lg" | "card", Shadow> =
  Platform.OS === "web"
    ? {
        card: { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" } as Shadow,
        sm:   { boxShadow: "0 2px 4px rgba(0,0,0,0.18)" } as Shadow,
        md:   { boxShadow: "0 4px 8px rgba(0,0,0,0.24)" } as Shadow,
        lg:   { boxShadow: "0 8px 16px rgba(0,0,0,0.32)" } as Shadow,
      }
    : {
        card: { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
        sm:   { shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 2 },
        md:   { shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.24, shadowRadius: 8, elevation: 5 },
        lg:   { shadowColor: Colors.black, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.32, shadowRadius: 16, elevation: 10 },
      };

export type ShadowToken = keyof typeof Shadows;
