import { Pet } from "../types";

const normalize = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const has = (text: string, ...terms: string[]) =>
  terms.some((term) => text.includes(term));

const bullets = (lines: string[]) => lines.map((l) => `• ${l}`).join("\n");

// Assistente baseado nos dados reais do tutor (pets, vacinas, medicamentos e
// retornos vindos da API): entende algumas intenções por palavra-chave e
// responde com o que está cadastrado.
export function buildAssistantReply(question: string, pets: Pet[]): string {
  if (pets.length === 0) {
    return "Você ainda não tem pets cadastrados. Vá em Pets e toque em + para cadastrar o primeiro. 🐾";
  }

  const q = normalize(question);

  if (has(q, "vacina", "vacinas", "imuniza")) {
    const pending = pets.flatMap((pet) =>
      pet.vaccines
        .filter((v) => !v.done)
        .map(
          (v) =>
            `${pet.name}: ${v.name}${v.startDate ? ` (agendada para ${v.startDate})` : ""}`,
        ),
    );
    const next = pets.flatMap((pet) =>
      pet.vaccines
        .filter((v) => v.done && v.endDate)
        .map((v) => `${pet.name}: ${v.name} — próxima dose em ${v.endDate}`),
    );

    if (pending.length === 0 && next.length === 0) {
      return "Não há vacinas pendentes nem próximas doses cadastradas. 💉";
    }

    return [
      pending.length ? `Vacinas pendentes:\n${bullets(pending)}` : "",
      next.length ? `Próximas doses:\n${bullets(next)}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (has(q, "medic", "remedio", "dose", "tratamento")) {
    const active = pets.flatMap((pet) =>
      pet.medications
        .filter((m) => m.active)
        .map(
          (m) =>
            `${pet.name}: ${m.name}${m.dose ? ` (${m.dose})` : ""}${m.frequency ? `, ${m.frequency}` : ""}${m.endDate ? ` — até ${m.endDate}` : ""}`,
        ),
    );

    return active.length
      ? `Medicamentos em uso:\n${bullets(active)}`
      : "Nenhum medicamento em uso no momento. 💊";
  }

  if (has(q, "retorno", "consulta", "veterinario", "checkup")) {
    const scheduled = pets
      .filter((p) => p.nextCheckup)
      .map((p) => `${p.name}: retorno em ${p.nextCheckup}`);

    return scheduled.length
      ? `Retornos agendados:\n${bullets(scheduled)}`
      : "Nenhum retorno agendado. Você pode marcar um na aba Saúde. 🩺";
  }

  if (has(q, "pendencia", "pendente", "atras", "falta")) {
    const pending = pets.flatMap((pet) =>
      pet.vaccines.filter((v) => !v.done).map((v) => `${pet.name}: ${v.name}`),
    );

    return pending.length
      ? `Pendências:\n${bullets(pending)}`
      : "Tudo em dia! Nenhuma pendência. ✅";
  }

  const summary = pets.map((pet) => {
    const pendingCount = pet.vaccines.filter((v) => !v.done).length;
    const medsCount = pet.medications.filter((m) => m.active).length;
    return `${pet.name} (${pet.species}): ${pendingCount} vacina(s) pendente(s), ${medsCount} medicamento(s) em uso`;
  });

  return `Resumo dos seus pets:\n${bullets(summary)}\n\nPergunte sobre vacinas, medicamentos, retornos ou pendências.`;
}
