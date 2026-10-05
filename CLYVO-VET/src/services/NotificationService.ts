import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

import { Pet, Vaccine, Medication } from "../types";
import { parseBrDate } from "../utils/dateConversion";

type HealthItem = Vaccine | Medication;

export type HealthNotificationData = {
  screen: "Vaccines" | "Medications" | "Health";
  petId: string;
  itemId: string;
};

const CHANNEL_ID = "lembretes-saude";
const ID_PREFIX = "health-";
const REMINDER_HOUR = 9;
const IMMEDIATE_DELAY_SECONDS = 5;

const isSupported = Platform.OS !== "web";

type ReminderContent = { title: string; tomorrow: string; today: string };

const checkupIdOf = (petId: string) => `checkup-${petId}`;

// Lembretes de vacina/medicamento são notificações LOCAIS: o app agenda no
// próprio aparelho a partir das datas cadastradas na API, sem servidor push.
class NotificationService {
  async setup(): Promise<void> {
    if (!isSupported) return;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Lembretes de saúde",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!isSupported) return false;

    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;

    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  }

  // Agenda os lembretes de um registro de saúde (vacina ou medicamento).
  async scheduleHealthReminders(
    petId: string,
    petName: string,
    item: HealthItem,
    options: { notifyIfImminent: boolean } = { notifyIfImminent: false },
  ): Promise<void> {
    if (!isSupported) return;

    await this.cancelHealthReminders(item.id);

    const target = reminderTargetOf(item);
    if (!target) return;

    await this.scheduleReminders(
      item.id,
      target.date,
      this.buildContent(petName, item, target.kind),
      {
        screen: item.type === "vaccine" ? "Vaccines" : "Medications",
        petId,
        itemId: item.id,
      },
      options.notifyIfImminent,
    );
  }

  // Lembrete do retorno ao veterinário agendado na tela de Saúde.
  async scheduleCheckupReminders(
    pet: Pet,
    options: { notifyIfImminent: boolean } = { notifyIfImminent: false },
  ): Promise<void> {
    if (!isSupported) return;

    await this.cancelHealthReminders(checkupIdOf(pet.id));

    const date = parseBrDate(pet.nextCheckup);
    if (!date) return;

    await this.scheduleReminders(
      checkupIdOf(pet.id),
      date,
      {
        title: `Retorno de ${pet.name} 🩺`,
        tomorrow: `${pet.name} tem retorno ao veterinário amanhã.`,
        today: `Hoje é o dia do retorno de ${pet.name} ao veterinário.`,
      },
      { screen: "Health", petId: pet.id, itemId: checkupIdOf(pet.id) },
      options.notifyIfImminent,
    );
  }

  // Um lembrete no dia anterior e outro no dia do vencimento, às 9h. Quando o
  // horário ideal já passou mas o vencimento é hoje/amanhã, avisa em alguns
  // segundos — é o que acontece ao cadastrar algo que vence logo.
  private async scheduleReminders(
    id: string,
    dueDate: Date,
    content: ReminderContent,
    data: HealthNotificationData,
    notifyIfImminent: boolean,
  ): Promise<void> {
    const granted = await this.requestPermission();
    if (!granted) return;

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const daysUntilDue = Math.round(
      (dueDate.getTime() - startOfToday.getTime()) / 86_400_000,
    );

    if (daysUntilDue < 0) return;

    const slots = [
      {
        suffix: "d1",
        day: addDays(dueDate, -1),
        body: content.tomorrow,
        daysAhead: 1,
      },
      { suffix: "d0", day: dueDate, body: content.today, daysAhead: 0 },
    ];

    for (const slot of slots) {
      const at = new Date(slot.day);
      at.setHours(REMINDER_HOUR, 0, 0, 0);

      if (at.getTime() > now.getTime()) {
        await this.schedule(id, slot.suffix, content.title, slot.body, data, {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: at,
          channelId: CHANNEL_ID,
        });
      } else if (notifyIfImminent && daysUntilDue === slot.daysAhead) {
        await this.schedule(id, slot.suffix, content.title, slot.body, data, {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: IMMEDIATE_DELAY_SECONDS,
          channelId: CHANNEL_ID,
        });
      }
    }
  }

  async cancelHealthReminders(itemId: string): Promise<void> {
    if (!isSupported) return;

    await Promise.all(
      ["d1", "d0"].map((suffix) =>
        Notifications.cancelScheduledNotificationAsync(
          `${ID_PREFIX}${itemId}-${suffix}`,
        ),
      ),
    );
  }

  // Mantém os lembretes do aparelho alinhados com o que veio da API: agenda
  // os que faltam e cancela os de registros removidos ou já concluídos.
  async syncHealthReminders(pets: Pet[]): Promise<void> {
    if (!isSupported) return;

    const granted = await this.requestPermission();
    if (!granted) return;

    const activeIds = new Set<string>();

    for (const pet of pets) {
      for (const item of [...pet.vaccines, ...pet.medications]) {
        if (!reminderTargetOf(item)) continue;

        activeIds.add(item.id);
        await this.scheduleHealthReminders(pet.id, pet.name, item);
      }
    }

    for (const pet of pets) {
      if (!parseBrDate(pet.nextCheckup)) continue;

      activeIds.add(checkupIdOf(pet.id));
      await this.scheduleCheckupReminders(pet);
    }

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const stale = scheduled.filter((n) => {
      if (!n.identifier.startsWith(ID_PREFIX)) return false;
      const itemId = n.identifier
        .slice(ID_PREFIX.length)
        .replace(/-d[01]$/, "");
      return !activeIds.has(itemId);
    });

    await Promise.all(
      stale.map((n) =>
        Notifications.cancelScheduledNotificationAsync(n.identifier),
      ),
    );
  }

  async cancelAll(): Promise<void> {
    if (!isSupported) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  private buildContent(petName: string, item: HealthItem, kind: ReminderKind) {
    if (item.type === "medication") {
      return {
        title: `Medicamento de ${petName} 💊`,
        tomorrow: `O tratamento com ${item.name} termina amanhã. Confira se ${petName} já tomou tudo.`,
        today: `Hoje termina o tratamento de ${petName} com ${item.name}.`,
      };
    }

    if (kind === "application") {
      return {
        title: `Vacina de ${petName} 💉`,
        tomorrow: `${item.name} está agendada para amanhã. Prepare ${petName} para a visita.`,
        today: `Hoje é o dia de aplicar ${item.name} em ${petName}.`,
      };
    }

    return {
      title: `Vacina de ${petName} 💉`,
      tomorrow: `A próxima dose de ${item.name} é amanhã. Não esqueça de levar ${petName} ao veterinário.`,
      today: `Hoje é o dia da próxima dose de ${item.name} de ${petName}.`,
    };
  }

  private async schedule(
    itemId: string,
    suffix: string,
    title: string,
    body: string,
    data: HealthNotificationData,
    trigger: Notifications.NotificationTriggerInput,
  ) {
    await Notifications.scheduleNotificationAsync({
      identifier: `${ID_PREFIX}${itemId}-${suffix}`,
      content: { title, body, data, sound: true },
      trigger,
    });
  }
}

type ReminderKind = "application" | "next-dose" | "treatment-end";

// Qual data de um registro merece lembrete: vacina ainda não aplicada avisa
// a data agendada; vacina aplicada avisa a próxima dose; medicamento em uso
// avisa o fim do tratamento.
function reminderTargetOf(
  item: HealthItem,
): { date: Date; kind: ReminderKind } | null {
  if (item.type === "medication") {
    const date = item.active ? parseBrDate(item.endDate) : null;
    return date ? { date, kind: "treatment-end" } : null;
  }

  if (!item.done) {
    const date = parseBrDate(item.startDate) ?? parseBrDate(item.endDate);
    return date ? { date, kind: "application" } : null;
  }

  const date = parseBrDate(item.endDate);
  return date ? { date, kind: "next-dose" } : null;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const notificationService = new NotificationService();
