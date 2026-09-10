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

const brand = {
  primary: "#0A1628",
  secondary: "#1E3A5F",
  accent: "#1A6EBD",
  accentLight: "#4A9EFF",
};

const surfaces = {
  // Hoje hardcoded na tab bar e no drawer.
  surface: "#17315B",
  // Um passo acima de `secondary`, para cards elevados sobre outros cards.
  surfaceRaised: "#274870",
};

const semantic = {
  accentGreen: "#2ECC71",
  accentOrange: "#F39C12",
  accentRed: "#E74C3C",
};

const onDark = {
  // Contraste AA validado sobre `secondary` (#1E3A5F):
  accentOnDark: "#6BB2FF", // 5.17:1
  successOnDark: "#4ADE80", // 6.60:1
  warningOnDark: "#FBBF24", // 6.89:1
  dangerOnDark: "#FF8A80", // 5.04:1
};

const neutrals = {
  white: "#FFFFFF",
  black: "#000000",
  background: "#F0F4F8",
  card: "#FFFFFF",
  text: "#0A1628",
  textSecondary: "#4A5568",
  // Cinza neutro mais claro que `textSecondary`, para rótulos discretos em
  // telas de fundo claro (cards brancos sobre `background`).
  textMuted: "#6B7280",
  textLight: "#A0AEC0",
  border: "#E2E8F0",
};

const overlays = {
  overlaySubtle: alpha(neutrals.white, 0.06),
  overlaySoft: alpha(neutrals.white, 0.1),
  overlayMedium: alpha(neutrals.white, 0.16),
  overlayStrong: alpha(neutrals.white, 0.3),
  // Placeholder sobre fundo escuro: 0.35 falha contraste AA (3.22:1), 0.55 passa.
  placeholderOnDark: alpha(neutrals.white, 0.55),
};

export const Colors = {
  ...brand,
  ...surfaces,
  ...semantic,
  ...onDark,
  ...neutrals,
  ...overlays,
};

export type ColorToken = keyof typeof Colors;
