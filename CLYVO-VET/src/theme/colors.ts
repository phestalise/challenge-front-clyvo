/**
 * Paleta de marca do CLYVO VET. `primary`, `secondary`, `accent` e `accentLight`
 * são a identidade visual e não podem mudar de família de cor — apenas variantes
 * dentro do mesmo azul, ou ajustes de contraste nas cores semânticas, são permitidos.
 */

/** Converte um hex (#RGB ou #RRGGBB) + opacidade (0–1) em string rgba(). */
export const alpha = (hex: string, opacity: number): string => {
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  const clampedOpacity = Math.min(1, Math.max(0, opacity));

  return `rgba(${r}, ${g}, ${b}, ${clampedOpacity})`;
};

export type ColorScheme = "light" | "dark";

const brand = {
  primary: "#0A1628",
  secondary: "#1E3A5F",
  accent: "#1A6EBD",
  accentLight: "#4A9EFF",
};

/**
 * Os tokens são papéis semânticos, não valores literais — o mesmo nome muda de
 * valor entre os esquemas:
 *  - `primary`   → fundo de tela / cabeçalho
 *  - `secondary` → cards e superfícies elevadas
 *  - `text`      → texto principal sobre `primary`/`secondary`/`card`
 *  - `onAccent`  → texto/ícone sobre cores sólidas (accent, vermelho, verde…);
 *                  é sempre branco nos dois esquemas.
 */
const darkColors = {
  ...brand,

  surface: "#17315B",
  surfaceRaised: "#274870",

  accentGreen: "#2ECC71",
  accentOrange: "#F39C12",
  accentRed: "#E74C3C",

  // Contraste AA validado sobre `secondary` (#1E3A5F):
  accentOnDark: "#6BB2FF", // 5.17:1
  successOnDark: "#4ADE80", // 6.60:1
  warningOnDark: "#FBBF24", // 6.89:1
  dangerOnDark: "#FF8A80", // 5.04:1

  white: "#FFFFFF",
  black: "#000000",
  onAccent: "#FFFFFF",

  canvas: "#0A1628",
  background: "#0A1628",
  card: "#1E3A5F",
  text: "#FFFFFF",
  textSecondary: "#B8C4D6",
  textMuted: "#94A3B8",
  textLight: "#A0AEC0",
  border: "rgba(255, 255, 255, 0.14)",

  overlaySubtle: alpha("#FFFFFF", 0.06),
  overlaySoft: alpha("#FFFFFF", 0.1),
  overlayMedium: alpha("#FFFFFF", 0.16),
  overlayStrong: alpha("#FFFFFF", 0.3),
  // Placeholder sobre fundo escuro: 0.35 falha contraste AA (3.22:1), 0.55 passa.
  placeholderOnDark: alpha("#FFFFFF", 0.55),
};

export type ThemeColors = { [K in keyof typeof darkColors]: string };

const lightColors: ThemeColors = {
  primary: "#F5F7FB",
  secondary: "#FFFFFF",
  accent: "#1A6EBD",
  accentLight: "#1F74C4",

  surface: "#FFFFFF",
  surfaceRaised: "#E8EEF5",

  accentGreen: "#1F9D55",
  accentOrange: "#C77700",
  accentRed: "#D0342C",

  accentOnDark: "#1A6EBD",
  successOnDark: "#1F8A4C",
  warningOnDark: "#A96400",
  dangerOnDark: "#C0392B",

  white: "#FFFFFF",
  black: "#000000",
  onAccent: "#FFFFFF",

  canvas: "#FFFFFF",
  background: "#F0F4F8",
  card: "#FFFFFF",
  text: "#0A1628",
  textSecondary: "#4A5568",
  textMuted: "#6B7280",
  textLight: "#64748B",
  border: "#E2E8F0",

  overlaySubtle: alpha("#0A1628", 0.04),
  overlaySoft: alpha("#0A1628", 0.06),
  overlayMedium: alpha("#0A1628", 0.1),
  overlayStrong: alpha("#0A1628", 0.24),
  placeholderOnDark: alpha("#0A1628", 0.5),
};

export const palettes: Record<ColorScheme, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};

/**
 * Paleta estática (esquema escuro, a identidade original da marca). Só use
 * fora de componentes — dentro deles use `useTheme().colors`.
 */
export const Colors: ThemeColors = darkColors;

export type ColorToken = keyof ThemeColors;
