import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { StyleSheet } from "react-native";

import { storageService } from "../services/StorageService";
import { ColorScheme, ThemeColors, palettes } from "./colors";
import { Typography } from "./typography";
import { Spacing } from "./spacing";
import { Radius } from "./radius";
import { alpha } from "./colors";

// O app abre no tema claro; o usuário pode trocar para o escuro no Perfil e a
// escolha fica salva no aparelho entre aberturas do app.
export type ThemeMode = "light" | "dark";

const THEME_MODE_KEY = "@clyvo:theme_mode";

type ThemeTokens = {
  colors: ThemeColors;
  typography: typeof Typography;
  spacing: typeof Spacing;
  radius: typeof Radius;
  alpha: typeof alpha;
};

type ThemeContextValue = {
  scheme: ColorScheme;
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    storageService
      .getData(THEME_MODE_KEY)
      .then((saved) => {
        if (saved === "light" || saved === "dark") {
          setModeState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    storageService.saveData(THEME_MODE_KEY, next).catch(() => {});
  }, []);

  const scheme: ColorScheme = mode;

  const value = useMemo(
    () => ({ scheme, mode, colors: palettes[scheme], setMode }),
    [scheme, mode, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  return ctx;
}

/**
 * Cria uma folha de estilos que depende do tema. A fábrica recebe a paleta
 * ativa e o resultado é cacheado por esquema, então trocar de tema só
 * recria os estilos uma vez.
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ThemeColors, tokens: ThemeTokens) => T,
) {
  const cache: Partial<Record<ColorScheme, T>> = {};

  return function useStyles(): T {
    const { scheme, colors } = useTheme();

    if (!cache[scheme]) {
      cache[scheme] = StyleSheet.create(
        factory(colors, {
          colors,
          typography: Typography,
          spacing: Spacing,
          radius: Radius,
          alpha,
        }),
      ) as T;
    }

    return cache[scheme] as T;
  };
}
