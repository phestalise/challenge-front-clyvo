import React, { useCallback, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../types";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import StatCard from "../../components/StatCard";
import { primeiroNome } from "../../utils/formatters";
import { styles } from "../../styles/DashboardScreenStyles";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const [u, p] = await Promise.all([
      storageService.getUser(),
      storageService.getPets(),
    ]);
    setUser(u);
    setPets(p);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const upcoming = pets
    .flatMap((p) =>
      (p.vaccines ?? [])
        .filter((v: any) => !v.done)
        .map((v: any) => ({
          petName: p.name,
          type: "Vacina",
          name: v.name,
          date: v.nextDue,
          color: Colors.accentGreen,
          icon: "shield-checkmark",
        }))
    )
    .slice(0, 3);

  const quickActions = [
    { icon: "add-circle", label: "Novo Pet", color: Colors.accentLight, onPress: () => navigation.navigate("AddPet") },
    { icon: "calendar", label: "Saúde", color: Colors.accentGreen, onPress: () => navigation.navigate("HealthCalendar") },
    { icon: "clipboard", label: "Histórico", color: Colors.accentOrange, onPress: () => {} },
    { icon: "chatbubble-ellipses", label: "Chat IA", color: "#9B59B6", onPress: () => navigation.navigate("PetChat") },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accentLight} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {primeiroNome(user?.name ?? "")} 👋</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </Text>
          </View>
          <TouchableOpacity style={styles.notif}>
            <Ionicons name="notifications-outline" size={22} color={Colors.white} />
            {upcoming.length > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>

        <View style={styles.aiBanner}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={20} color={Colors.accentLight} />
          </View>
          <Text style={styles.aiText}>
            {pets.length === 0
              ? "Cadastre seu primeiro pet para insights de IA"
              : `Monitorando ${pets.length} pet${pets.length > 1 ? "s" : ""} — saúde em dia`}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Pets" value={pets.length} icon="paw" color={Colors.accentLight} />
          <StatCard label="Vacinas OK" value={pets.flatMap((p) => p.vaccines ?? []).filter((v: any) => v.done).length} icon="shield-checkmark" color={Colors.accentGreen} />
          <StatCard label="Medicamentos" value={pets.flatMap((p) => p.medications ?? []).filter((m: any) => m.active).length} icon="medical" color={Colors.accentOrange} />
          <StatCard label="Pendências" value={pets.flatMap((p) => p.vaccines ?? []).filter((v: any) => !v.done).length} icon="alert-circle" color={Colors.accentRed} />
        </View>

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

        {pets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meus pets</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pets.map((pet) => (
                <TouchableOpacity key={pet.id} style={styles.petChip} onPress={() => navigation.navigate("PetDetail", { petId: pet.id })}>
                  <View style={styles.petChipAvatar}>
                    <Ionicons name="paw" size={22} color={Colors.accentLight} />
                  </View>
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

        <View style={[styles.section, styles.bottomSection]}>
          <Text style={styles.sectionTitle}>Próximas vacinas</Text>
          {upcoming.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-circle" size={34} color={Colors.accentGreen} />
              <Text style={styles.emptyText}>
                {pets.length === 0 ? "Cadastre um pet para ver eventos" : "Nenhuma pendência 🎉"}
              </Text>
            </View>
          ) : (
            upcoming.map((ev, i) => (
              <View key={i} style={styles.eventRow}>
                <View style={[styles.eventIcon, { backgroundColor: ev.color + "20" }]}>
                  <Ionicons name={ev.icon as any} size={18} color={ev.color} />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName}>{ev.name}</Text>
                  <Text style={styles.eventPet}>{ev.petName}</Text>
                </View>
                <Text style={styles.eventDate}>{ev.date}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}