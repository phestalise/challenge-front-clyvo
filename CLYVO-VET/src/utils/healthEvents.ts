import { Pet } from "../types";
import { parseBrDate } from "./dateConversion";

export type HealthEvent = {
  id: string;
  petName: string;
  petId: string;
  type: "vaccine" | "medication";
  name: string;
  date: string;
  done: boolean;
};

export type HealthEventState = "done" | "pending" | "overdue";

/** Transforma vacinas e medicamentos dos pets em eventos datados. */
export function buildHealthEvents(pets: Pet[]): HealthEvent[] {
  const events: HealthEvent[] = [];

  pets.forEach((pet) => {
    (pet.vaccines ?? []).forEach((v) => {
      if (v.startDate) {
        events.push({
          id: `vac-${v.id}`,
          petName: pet.name,
          petId: pet.id,
          type: "vaccine",
          name: v.name,
          date: v.startDate,
          done: v.done,
        });
      }

      if (v.endDate) {
        events.push({
          id: `vac-next-${v.id}`,
          petName: pet.name,
          petId: pet.id,
          type: "vaccine",
          name: `${v.name} - Próxima dose`,
          date: v.endDate,
          done: false,
        });
      }
    });

    (pet.medications ?? []).forEach((m) => {
      if (m.startDate) {
        events.push({
          id: `med-${m.id}`,
          petName: pet.name,
          petId: pet.id,
          type: "medication",
          name: m.name,
          date: m.startDate,
          done: !m.active,
        });
      }
    });
  });

  return events;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getEventState(
  event: HealthEvent,
  today: Date = new Date(),
): HealthEventState {
  if (event.done) return "done";

  const eventDate = parseBrDate(event.date);

  if (eventDate && eventDate < startOfDay(today)) return "overdue";

  return "pending";
}

/** Dias (inteiros) entre hoje e a data do evento; negativo = já passou. */
export function daysUntil(event: HealthEvent, today: Date = new Date()) {
  const eventDate = parseBrDate(event.date);
  if (!eventDate) return null;

  return Math.round(
    (eventDate.getTime() - startOfDay(today).getTime()) / 86_400_000,
  );
}

/** Eventos que pedem atenção: atrasados e os que vencem nos próximos dias. */
export function getAttentionEvents(
  events: HealthEvent[],
  withinDays = 7,
  today: Date = new Date(),
): HealthEvent[] {
  return events
    .filter((event) => {
      if (event.done) return false;

      const days = daysUntil(event, today);
      return days !== null && days <= withinDays;
    })
    .sort(
      (a, b) =>
        (parseBrDate(a.date)?.getTime() ?? 0) -
        (parseBrDate(b.date)?.getTime() ?? 0),
    );
}
