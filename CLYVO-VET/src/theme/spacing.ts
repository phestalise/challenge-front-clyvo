/**
 * Grid de 4. Todo padding/margin do app deve mapear para um destes —
 * hoje existem 38 valores distintos, todos redundantes com esta escala.
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export type SpacingToken = keyof typeof Spacing;
