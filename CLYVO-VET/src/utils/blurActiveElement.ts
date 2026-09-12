import { Platform } from "react-native";

// No web, o RNW mantém o foco no elemento clicado mesmo depois que a
// navegação esconde a tela atual com aria-hidden, o que dispara o aviso do
// navegador "Blocked aria-hidden on an element because its descendant
// retained focus". Tirar o foco do botão antes de navegar evita o aviso.
export function blurActiveElement(): void {
  if (Platform.OS !== "web") return;
  (document.activeElement as HTMLElement | null)?.blur?.();
}
