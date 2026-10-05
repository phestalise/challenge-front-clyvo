import Constants from "expo-constants";

// Valores injetados no build por app.config.js (ver hash do commit lá).
const extra = (Constants.expoConfig?.extra ?? {}) as {
  commitHash?: string;
  buildDate?: string;
};

const commitHash = extra.commitHash ?? "desconhecido";

export const buildInfo = {
  appName: Constants.expoConfig?.name ?? "CLYVO VET",
  version: Constants.expoConfig?.version ?? "1.0.0",
  commitHash,
  commitShort: commitHash.slice(0, 7),
  buildDate: extra.buildDate ?? null,
};
