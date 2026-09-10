import { Platform } from "react-native";

const API_URL = "https://clyvovet-api-nnke.onrender.com";

// A API ainda não libera CORS, então o navegador bloqueia fetch direto nela
// quando o app roda como web (Expo Go/iOS/Android não são afetados, CORS é
// uma restrição só de navegador). Em dev, "expo start --web" usa o proxy
// configurado em metro.config.js ("/api-proxy" -> API_URL) pra contornar
// isso sem precisar mexer na API. Fora do servidor de desenvolvimento (build
// web publicado), essa rota não existe e as chamadas voltam a falhar até a
// API liberar CORS de verdade.
export const API_BASE_URL = Platform.OS === "web" ? "/api-proxy" : API_URL;
