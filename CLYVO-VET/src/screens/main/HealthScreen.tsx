import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Pet } from "../../types";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import VaccineCard from "../../components/VaccineCard";
import MedicationCard from "../../components/MedicationCard";

type Tab = "vacinas" | "medicamentos" | "checkup";

export default function HealthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [tab, setTab] = useState<Tab>("vacinas");

  useFocusEffect(useCallback(() => { storageService.getPets().then(setPets); }, []));

  const allVax = pets.flatMap((p) => (p.vaccines ?? []).map((v) => ({ ...v, petName: p.name })));
  const allMeds = pets.flatMap((p) => (p.medications ?? []).map((m) => ({ ...m, petName: p.name })));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <Text style={styles.title}>Saúde & Cuidados</Text>
        <View style={styles.insightBox}>
          <Ionicons name="sparkles" size={14} color={Colors.accentLight} />
          <Text style={styles.insightText}>{allVax.filter((v) => !v.done).length} vacina(s) pendente(s) · {allMeds.filter((m) => m.active).length} medicamento(s) ativo(s)</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(["vacinas", "medicamentos", "checkup"] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {pets.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>Cadastre um pet para ver informações de saúde</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate("AddPet")}>
              <Text style={styles.emptyBtnText}>Adicionar pet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {tab === "vacinas" && (
              allVax.length === 0 ? <Text style={styles.noData}>Nenhuma vacina registrada</Text>
              : allVax.map((v, i) => <VaccineCard key={i} vaccine={v} petName={v.petName} />)
            )}
            {tab === "medicamentos" && (
              allMeds.length === 0 ? <Text style={styles.noData}>Nenhum medicamento registrado</Text>
              : allMeds.map((m, i) => <MedicationCard key={i} medication={m} petName={m.petName} />)
            )}
            {tab === "checkup" && pets.map((pet) => (
              <TouchableOpacity key={pet.id} style={styles.checkupCard} onPress={() => navigation.navigate("PetDetail", { petId: pet.id })}>
                <View style={styles.checkupIcon}><Ionicons name="calendar" size={22} color={Colors.accent} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkupName}>{pet.name}</Text>
                  <Text style={styles.checkupMeta}>{pet.species} · {pet.breed}</Text>
                  <Text style={styles.checkupDate}>Retorno: {pet.nextCheckup || "Não agendado"}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: "800", color: Colors.white },
  insightBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(74,158,255,0.15)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  insightText: { color: "rgba(255,255,255,0.75)", fontSize: 12, flex: 1 },
  tabs: { flexDirection: "row", backgroundColor: Colors.card, paddingHorizontal: 16, paddingVertical: 10, gap: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: Colors.accent + "18" },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600" },
  tabTextActive: { color: Colors.accent },
  scroll: { padding: 20, paddingBottom: 30 },
  empty: { alignItems: "center", paddingTop: 60, gap: 14 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: "center" },
  emptyBtn: { backgroundColor: Colors.accentLight, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { color: Colors.primary, fontWeight: "700" },
  noData: { textAlign: "center", color: Colors.textSecondary, paddingTop: 40 },
  checkupCard: { backgroundColor: Colors.card, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  checkupIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: Colors.accent + "15", justifyContent: "center", alignItems: "center" },
  checkupName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  checkupMeta: { fontSize: 12, color: Colors.textSecondary },
  checkupDate: { fontSize: 12, color: Colors.accentOrange, marginTop: 2 },
});