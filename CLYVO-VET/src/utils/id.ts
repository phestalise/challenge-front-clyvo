// A API espera Id* como Int32 (C# int), não Int64 — Date.now() (13 dígitos,
// ~1.7 trilhão) estoura o limite de Int32 (2.147.483.647) e o JSON falha ao
// converter ("could not be converted to System.Int32"). Gera um inteiro
// positivo aleatório dentro desse limite; a chance de colisão é desprezível
// pro volume de dados de um projeto de estudo.
export function gerarIdNumerico(): number {
  return Math.floor(Math.random() * 2_000_000_000) + 1;
}
