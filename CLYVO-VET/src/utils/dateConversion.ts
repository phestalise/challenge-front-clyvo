// Conversões entre o formato usado nos formulários/telas (DD/MM/AAAA) e o
// formato ISO que a API/Oracle esperam e devolvem (ex: "2021-03-10T00:00:00").

export function brDateToIso(data: string | null | undefined): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data?.trim() ?? "");
  if (!match) return null;

  const [, dia, mes, ano] = match;
  return `${ano}-${mes}-${dia}`;
}

export function isoDateToBr(data: string | null | undefined): string {
  if (!data) return "";

  const [datePart] = data.split("T");
  const [ano, mes, dia] = datePart.split("-");
  if (!ano || !mes || !dia) return data;

  return `${dia}/${mes}/${ano}`;
}
