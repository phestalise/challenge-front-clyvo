import React, { useCallback, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, StyleSheet,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import { petService } from "../../services/PetService";
import { calcularIdadeTexto } from "../../utils/formatters";

export default function HealthTabScreen() {
  const navigation = useNavigation<any>();
  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => setPets(await storageService.getPets());
  useFocusEffect(useCallback(() => { load(); }, []));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saúde</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AddHealthRecord")}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accentLight} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {pets.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart" size={56} color={Colors.accentRed + "40"} />
            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptyText}>Adicione um pet para acompanhar a saúde</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate("AddPet")}>
              <Text style={styles.emptyBtnText}>+ Adicionar pet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          pets.map((pet) => {
            const score = petService.getHealthScore(pet);
            const scoreColor = score > 70 ? Colors.accentGreen : score > 40 ? Colors.accentOrange : Colors.accentRed;
            const vaccinesDone = (pet.vaccines ?? []).filter((v: any) => v.done).length;
            const vaccinesTotal = (pet.vaccines ?? []).length;
            const medActive = (pet.medications ?? []).filter((m: any) => m.active).length;
            const pending = (pet.vaccines ?? []).filter((v: any) => !v.done).length;

            return (
              <TouchableOpacity
                key={pet.id}
                style={styles.card}
                onPress={() => navigation.navigate("PetDetail", { petId: pet.id })}
                activeOpacity={0.85}
              >
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Ionicons
                      name={pet.species === "Gato" ? "happy" : pet.species === "Pássaro" ? "sunny" : "paw"}
                      size={28} color={Colors.accentLight}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petMeta}>{pet.species} · {pet.breed} · {calcularIdadeTexto(pet.age)}</Text>
                  </View>
                  {pending > 0 && (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>{pending} pendente{pending > 1 ? "s" : ""}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
                </View>

                <View style={styles.healthRow}>
                  <Text style={styles.healthLabel}>Saúde</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${score}%` as any, backgroundColor: scoreColor }]} />
                  </View>
                  <Text style={[styles.healthPct, { color: scoreColor }]}>{score}%</Text>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Ionicons name="shield-checkmark" size={13} color={Colors.accentGreen} />
                    <Text style={styles.statText}>{vaccinesDone}/{vaccinesTotal} vacinas</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="medical" size={13} color={Colors.accentOrange} />
                    <Text style={styles.statText}>{medActive} medicamentos</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="calendar" size={13} color={Colors.accentLight} />
                    <Text style={styles.statText}>{pet.nextCheckup || "Sem retorno"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    backgroundColor: Colors.secondary,
  },
  title: { fontSize: 22, fontWeight: "700", color: Colors.white },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.accentGreen + "25",
    alignItems: "center", justifyContent: "center",
  },
  list: { padding: 16, gap: 12, paddingBottom: 40 },
  empty: { alignItems: "center", paddingTop: 100, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: Colors.white },
  emptyText: { fontSize: 14, color: Colors.textLight, textAlign: "center" },
  emptyBtn: { marginTop: 8, paddingHorizontal: 28, paddingVertical: 13, backgroundColor: Colors.accentLight, borderRadius: 14 },
  emptyBtnText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  card: {
    backgroundColor: Colors.secondary, borderRadius: 16, padding: 16, gap: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: Colors.accentLight + "20",
    alignItems: "center", justifyContent: "center",
  },
  petName: { fontSize: 16, fontWeight: "700", color: Colors.white },
  petMeta: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  pendingBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: Colors.accentRed + "20", borderRadius: 20,
  },
  pendingText: { fontSize: 11, color: Colors.accentRed, fontWeight: "700" },
  healthRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  healthLabel: { fontSize: 12, color: Colors.textLight, width: 36 },
  barBg: { flex: 1, height: 6, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },
  healthPct: { fontSize: 12, fontWeight: "700", width: 36, textAlign: "right" },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  stat: { flexDirection: "row", alignItems: "center", gap: 5 },
  statText: { fontSize: 12, color: Colors.textLight },
});