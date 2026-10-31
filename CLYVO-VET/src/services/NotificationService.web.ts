import type { Pet } from "../types";

export type HealthNotificationData = {
  screen: "Vaccines" | "Medications" | "Health";
  petId: string;
  itemId: string;
};

class NotificationServiceWeb {
  async setup(): Promise<void> {}
  async requestPermission(): Promise<boolean> { return false; }
  async scheduleHealthReminders(): Promise<void> {}
  async scheduleCheckupReminders(): Promise<void> {}
  async syncHealthReminders(_pets: Pet[]): Promise<void> {}
  async cancelAll(): Promise<void> {}
  async cancelHealthReminders(_itemId: string): Promise<void> {}
}

export const notificationService = new NotificationServiceWeb();
