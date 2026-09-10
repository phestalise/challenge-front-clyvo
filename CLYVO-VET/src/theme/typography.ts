import type { TextStyle } from "react-native";

/**
 * Escala de 6 níveis. Todo fontSize do app deve mapear para um destes —
 * hoje existem 17 tamanhos distintos, todos redundantes com esta escala.
 * lineHeight = fontSize × 1.4, arredondado.
 */
type TypographyVariant = {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle["fontWeight"];
};

export const Typography: Record<
  "display" | "title" | "subtitle" | "body" | "label" | "caption",
  TypographyVariant
> = {
  display: { fontSize: 28, lineHeight: 39, fontWeight: "700" },
  title: { fontSize: 20, lineHeight: 28, fontWeight: "700" },
  subtitle: { fontSize: 17, lineHeight: 24, fontWeight: "600" },
  body: { fontSize: 15, lineHeight: 21, fontWeight: "400" },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  caption: { fontSize: 11, lineHeight: 15, fontWeight: "500" },
};

export type TypographyToken = keyof typeof Typography;
