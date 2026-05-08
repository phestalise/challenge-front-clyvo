import React, { useCallback, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

export default function HealthScreen() {
  const navigation = useNavigation<any>();
  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const data = await storageService.getPets();
    setPets(Array.isArray(data) ? data : []);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // HealthScreen é uma aba do Tab.
  // PetDetail, HealthCalendar, Vaccines, Medications estão no RootStack.
  // → usa getParent() para acessá-los.
  const goToStack = (name: string, params?: object) => {
    navigation.getParent()?.navigate(name, params);
  };

  const getHealthScore = (pet: any): number => {
    if (!pet.vaccines || pet.vaccines.length === 0) return 100;
    const done = pet.vaccines.filter((v: any) => v.done).length;
    return Math.round((done / pet.vaccines.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return Colors.accentGreen;
    if (score > 40) return Colors.accentOrange;
    return Colors.accentRed;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saúde</Text>
        <TouchableOpacity
          style={styles.calendarBtn}
          onPress={() => goToStack("HealthCalendar")}
        >
          <Ionicons name="calendar" size={20} color={Colors.accentOrange} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accentLight} />
        }
      >
        {pets.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="medkit" size={60} color={Colors.accentGreen + "40"} />
            <Text style={styles.emptyText}>Nenhum pet cadastrado</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => goToStack("AddPet")}>
              <Text style={styles.emptyBtnText}>Adicionar Pet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>SEUS PETS</Text>

            {pets.map((pet) => {
              const score = getHealthScore(pet);
              const scoreColor = getScoreColor(score);
              const vaccinesDone = (pet.vaccines ?? []).filter((v: any) => v.done).length;
              const vaccinesTotal = (pet.vaccines ?? []).length;
              const medsActive = (pet.medications ?? []).filter((m: any) => m.active).length;

              return (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.petCard}
                  activeOpacity={0.85}
                  onPress={() => goToStack("PetDetail", { petId: pet.id })}
                >
                  <View style={styles.petCardTop}>
                    <View style={styles.avatar}>
                      <Ionicons
                        name={pet.species === "Gato" ? "happy" : "paw"}
                        size={26}
                        color={Colors.accentLight}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.petMeta}>{pet.species} · {pet.breed}</Text>
                    </View>
                    <Text style={[styles.scoreText, { color: scoreColor }]}>{score}%</Text>
                  </View>

                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${score}%` as any, backgroundColor: scoreColor },
                      ]}
                    />
                  </View>

                  <View style={styles.petStats}>
                    <View style={styles.petStat}>
                      <Ionicons name="shield-checkmark" size={13} color={Colors.accentGreen} />
                      <Text style={styles.petStatText}>{vaccinesDone}/{vaccinesTotal} vacinas</Text>
                    </View>
                    <View style={styles.petStat}>
                      <Ionicons name="medical" size={13} color={Colors.accentLight} />
                      <Text style={styles.petStatText}>{medsActive} med.</Text>
                    </View>
                    <View style={styles.petStat}>
                      <Ionicons name="chevron-forward" size={13} color={Colors.accentLight} />
                      <Text style={[styles.petStatText, { color: Colors.accentLight }]}>
                        Ver detalhes
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>AÇÕES RÁPIDAS</Text>

            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard} onPress={() => goToStack("Vaccines")}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.accentGreen + "20" }]}>
                  <Ionicons name="shield-checkmark" size={24} color={Colors.accentGreen} />
                </View>
                <Text style={styles.actionLabel}>Vacinas</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => goToStack("Medications")}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.accentLight + "20" }]}>
                  <Ionicons name="medical" size={24} color={Colors.accentLight} />
                </View>
                <Text style={styles.actionLabel}>Medicamentos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => goToStack("HealthCalendar")}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.accentOrange + "20" }]}>
                  <Ionicons name="calendar" size={24} color={Colors.accentOrange} />
                </View>
                <Text style={styles.actionLabel}>Calendário</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => goToStack("PetChat")}>
                <View style={[styles.actionIcon, { backgroundColor: "#9B59B620" }]}>
                  <Ionicons name="chatbubble-ellipses" size={24} color="#9B59B6" />
                </View>
                <Text style={styles.actionLabel}>Chat IA</Text>
              </TouchableOpacity>
            </View>
          </>
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
  calendarBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.accentOrange + "20",
    alignItems: "center", justifyContent: "center",
  },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  sectionTitle: {
    fontSize: 11, color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.5, textTransform: "uppercase",
  },
  petCard: {
    backgroundColor: Colors.secondary, borderRadius: 16,
    padding: 16, gap: 12,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  petCardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: Colors.accentLight + "20",
    justifyContent: "center", alignItems: "center",
  },
  petName: { fontSize: 16, fontWeight: "700", color: Colors.white },
  petMeta: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  scoreText: { fontSize: 18, fontWeight: "800" },
  progressBg: {
    height: 6, backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 3, overflow: "hidden",
  },
  progressBar: { height: 6, borderRadius: 3 },
  petStats: { flexDirection: "row", justifyContent: "space-between" },
  petStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  petStatText: { fontSize: 11, color: Colors.textLight },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 100, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
  emptyBtn: {
    marginTop: 8, backgroundColor: Colors.accentGreen,
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
  },
  emptyBtnText: { color: Colors.white, fontWeight: "700" },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actionCard: {
    width: "47%", backgroundColor: Colors.secondary,
    borderRadius: 14, padding: 16, alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  actionIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  actionLabel: { fontSize: 13, fontWeight: "600", color: Colors.white },
});