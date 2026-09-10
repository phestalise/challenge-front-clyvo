import React from "react";
import { View, Text } from "react-native";

import { Vaccine } from "../types";
import { obterCorStatus, obterTextoStatus } from "../utils/formatters";

import { styles } from "../styles/VaccineCard.styles";

type Props = {
  vaccine: Vaccine;
  petName: string;
};

export default function VaccineCard({ vaccine, petName }: Props) {
  const cor = obterCorStatus(vaccine.done ? "done" : "pendente");

  return (
    <View style={[styles.card, { borderLeftWidth: 3, borderLeftColor: cor }]}>
      <View style={styles.info}>
        <Text style={styles.name}>{vaccine.name}</Text>

        <Text style={styles.sub}>Pet: {petName}</Text>

        <View style={styles.dates}>
          <Text style={styles.date}>Aplicada: {vaccine.startDate || "—"}</Text>

          <Text style={styles.date}>Próxima: {vaccine.endDate || "—"}</Text>
        </View>
      </View>

      <View
        style={[
          styles.badge,
          {
            backgroundColor: cor,
          },
        ]}
      >
        <Text style={styles.badgeText}>
          {obterTextoStatus(vaccine.done ? "done" : "pendente")}
        </Text>
      </View>
    </View>
  );
}
