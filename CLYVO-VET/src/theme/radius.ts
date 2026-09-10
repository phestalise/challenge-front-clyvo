/**
 * Todo borderRadius do app deve mapear para um destes — hoje existem 21
 * valores distintos (incluindo 13 e 19, claramente acidentais).
 *
 * Exceção: avatares/imagens circulares usam borderRadius = tamanho / 2 para
 * formar um círculo perfeito; isso continua computado a partir do tamanho do
 * elemento, não faz parte desta escala.
 */
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export type RadiusToken = keyof typeof Radius;
