import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

import { HealthNotificationData } from "../services/NotificationService";
import { navigationRef } from "../navigation/navigationRef";

const READY_POLL_MS = 200;
const READY_MAX_ATTEMPTS = 25;

// Ao tocar numa notificação (com o app aberto, em segundo plano ou fechado),
// leva o usuário direto à tela relacionada ao lembrete. O hook só é usado
// dentro do app autenticado; na abertura a frio o navegador pode levar alguns
// instantes para ficar pronto, por isso a navegação espera por ele.
export function useNotificationNavigation() {
  // No navegador o expo-notifications não tem implementação: chamar o hook
  // lá lança UnavailabilityError. Platform.OS nunca muda durante a execução,
  // então a chamada condicional é estável entre renderizações.
  const response =
    Platform.OS === "web" ? null : Notifications.useLastNotificationResponse();
  const handledId = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS === "web" || !response) return;

    const requestId = response.notification.request.identifier;
    if (handledId.current === requestId) return;

    const data = response.notification.request.content
      .data as Partial<HealthNotificationData>;

    if (!data?.screen) return;

    let attempts = 0;

    const tryNavigate = () => {
      if (navigationRef.isReady()) {
        handledId.current = requestId;
        navigationRef.navigate(data.screen as "Vaccines");
        return true;
      }

      return ++attempts >= READY_MAX_ATTEMPTS;
    };

    if (tryNavigate()) return;

    const timer = setInterval(() => {
      if (tryNavigate()) clearInterval(timer);
    }, READY_POLL_MS);

    return () => clearInterval(timer);
  }, [response]);
}
