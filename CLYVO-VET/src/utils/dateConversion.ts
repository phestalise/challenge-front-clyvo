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

/** Converte uma data no formato DD/MM/AAAA em Date, ou null se inválida. */
export function parseBrDate(data: string | null | undefined): Date | null {
  if (!data) return null;

  const parts = data.split("/");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return null;
  }

  return new Date(year, month, day);
}
