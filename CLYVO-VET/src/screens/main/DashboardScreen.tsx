import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../types";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import { petService } from "../../services/PetService";
import StatCard from "../../components/StatCard";
import { primeiroNome } from "../../utils/formatters";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const [u, p] = await Promise.all([storageService.getUser(), storageService.getPets()]);
    setUser(u); setPets(p);
  };

  useFocusEffect(useCallback(() => { load(); }, []));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const upcoming = pets.flatMap((p) =>
    (p.vaccines ?? []).filter((v: any) => !v.done).map((v: any) => ({ petName: p.name, type: "Vacina", name: v.name, date: v.nextDue, color: Colors.accentGreen, icon: "shield-checkmark" }))
  ).slice(0, 3);

  const quickActions = [
    { icon: "add-circle", label: "Novo Pet", color: Colors.accentLight, onPress: () => navigation.navigate("AddPet") },
    { icon: "calendar", label: "Saúde", color: Colors.accentGreen, onPress: () => {} },
    { icon: "clipboard", label: "Histórico", color: Colors.accentOrange, onPress: () => {} },
    { icon: "chatbubble-ellipses", label: "Chat IA", color: "#9B59B6", onPress: () => {} },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accentLight} />} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {primeiroNome(user?.name ?? "")} 👋</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</Text>
          </View>
          <TouchableOpacity style={styles.notif}>
            <Ionicons name="notifications-outline" size={22} color={Colors.white} />
            {upcoming.length > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>

        {/* AI Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiIcon}><Ionicons name="sparkles" size={20} color={Colors.accentLight} /></View>
          <Text style={styles.aiText}>
            {pets.length === 0 ? "Cadastre seu primeiro pet para insights de IA" : `Monitorando ${pets.length} pet${pets.length > 1 ? "s" : ""} — saúde em dia`}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Pets" value={pets.length} icon="paw" color={Colors.accentLight} />
          <StatCard label="Vacinas OK" value={pets.flatMap((p) => p.vaccines ?? []).filter((v: any) => v.done).length} icon="shield-checkmark" color={Colors.accentGreen} />
          <StatCard label="Medicamentos" value={pets.flatMap((p) => p.medications ?? []).filter((m: any) => m.active).length} icon="medical" color={Colors.accentOrange} />
          <StatCard label="Pendências" value={pets.flatMap((p) => p.vaccines ?? []).filter((v: any) => !v.done).length} icon="alert-circle" color={Colors.accentRed} />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>
          <View style={styles.actionsRow}>
            {quickActions.map((a, i) => (
              <TouchableOpacity key={i} style={styles.quickBtn} onPress={a.onPress}>
                <View style={[styles.quickIcon, { backgroundColor: a.color + "20" }]}>
                  <Ionicons name={a.icon as any} size={26} color={a.color} />
                </View>
                <Text style={styles.quickLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pets strip */}
        {pets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meus pets</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pets.map((pet) => (
                <TouchableOpacity key={pet.id} style={styles.petChip} onPress={() => navigation.navigate("PetDetail", { petId: pet.id })}>
                  <View style={styles.petChipAvatar}><Ionicons name="paw" size={22} color={Colors.accentLight} /></View>
                  <Text style={styles.petChipName}>{pet.name}</Text>
                  <Text style={styles.petChipMeta}>{pet.species}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.petChipAdd} onPress={() => navigation.navigate("AddPet")}>
                <Ionicons name="add" size={28} color={Colors.accentLight} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Upcoming events */}
        <View style={[styles.section, { paddingBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Próximas vacinas</Text>
          {upcoming.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-circle" size={34} color={Colors.accentGreen} />
              <Text style={styles.emptyText}>{pets.length === 0 ? "Cadastre um pet para ver eventos" : "Nenhuma pendência 🎉"}</Text>
            </View>
          ) : upcoming.map((ev, i) => (
            <View key={i} style={styles.eventRow}>
              <View style={[styles.eventIcon, { backgroundColor: ev.color + "20" }]}>
                <Ionicons name={ev.icon as any} size={18} color={ev.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventName}>{ev.name}</Text>
                <Text style={styles.eventPet}>{ev.petName}</Text>
              </View>
              <Text style={styles.eventDate}>{ev.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { fontSize: 22, fontWeight: "800", color: Colors.white },
  date: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2, textTransform: "capitalize" },
  notif: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  badge: { position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accentRed },
  aiBanner: { flexDirection: "row", alignItems: "center", gap: 10, margin: 20, marginBottom: 4, backgroundColor: Colors.secondary, borderRadius: 14, padding: 14 },
  aiIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.accent + "40", justifyContent: "center", alignItems: "center" },
  aiText: { color: "rgba(255,255,255,0.75)", fontSize: 13, flex: 1 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, padding: 20, paddingTop: 16 },
  section: { paddingHorizontal: 20, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: Colors.text, marginBottom: 14 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  quickBtn: { alignItems: "center", gap: 8 },
  quickIcon: { width: 60, height: 60, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  quickLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: "600" },
  petChip: { width: 110, backgroundColor: Colors.card, borderRadius: 16, padding: 14, marginRight: 12, alignItems: "center", gap: 6, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  petChipAvatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: Colors.accentLight + "15", justifyContent: "center", alignItems: "center" },
  petChipName: { fontSize: 13, fontWeight: "700", color: Colors.text },
  petChipMeta: { fontSize: 11, color: Colors.textSecondary },
  petChipAdd: { width: 90, backgroundColor: Colors.card, borderRadius: 16, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: Colors.accentLight + "35", borderStyle: "dashed" },
  emptyBox: { backgroundColor: Colors.card, borderRadius: 14, padding: 24, alignItems: "center", gap: 10 },
  emptyText: { color: Colors.textSecondary, fontSize: 14, textAlign: "center" },
  eventRow: { backgroundColor: Colors.card, borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  eventIcon: { width: 38, height: 38, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  eventName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  eventPet: { fontSize: 12, color: Colors.textSecondary },
  eventDate: { fontSize: 11, color: Colors.textSecondary, backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 },
});