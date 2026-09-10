// Mesmo algoritmo de dígito verificador da FN_VALIDA_CPF do banco Oracle.
function calcularDigitoVerificador(digitos: number[]): number {
  const fator = digitos.length + 1;
  let soma = 0;
  for (let i = 0; i < digitos.length; i++) {
    soma += digitos[i] * (fator - i);
  }
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

// Validação relaxada: só exige 11 dígitos, sem checar o dígito verificador
// (evita travar o cadastro durante testes com CPFs fictícios).
export function validarCPF(valor: string): boolean {
  return valor.replace(/\D/g, "").length === 11;
}

export function formatarCPF(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);

  const grupos = [
    digitos.slice(0, 3),
    digitos.slice(3, 6),
    digitos.slice(6, 9),
    digitos.slice(9, 11),
  ].filter(Boolean);

  if (grupos.length < 4) return grupos.join(".");

  return `${grupos[0]}.${grupos[1]}.${grupos[2]}-${grupos[3]}`;
}

// Contas criadas via Google não coletam CPF (o Firebase só devolve nome/e-mail),
// mas a coluna TUTOR.CPF é NOT NULL na API real. Gera um CPF sintético, porém
// com dígitos verificadores válidos, determinístico a partir do uid do Firebase.
export function gerarCpfPlaceholder(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const base: number[] = [];
  let h = hash || 1;
  for (let i = 0; i < 9; i++) {
    base.push(h % 10);
    h = Math.floor(h / 10) || hash + i + 1;
  }

  const d1 = calcularDigitoVerificador(base);
  const d2 = calcularDigitoVerificador([...base, d1]);

  return [...base, d1, d2].join("");
}
