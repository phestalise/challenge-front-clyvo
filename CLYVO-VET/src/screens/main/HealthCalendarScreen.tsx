import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

// ✅ FIX 4: HealthCalendarScreen completo e funcional
// Exibe todos os eventos (vacinas e medicamentos) em ordem cronológica

type CalendarEvent = {
  id: string;
  petName: string;
  petId: string;
  type: "vaccine" | "medication";
  name: string;
  date: string;
  done: boolean;
  color: string;
};

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function HealthCalendarScreen() {
  const navigation = useNavigation<any>();
  const [pets, setPets] = useState<any[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  const load = async () => {
    const data = await storageService.getPets();
    const allPets = Array.isArray(data) ? data : [];
    setPets(allPets);

    // Monta lista de eventos de todos os pets
    const allEvents: CalendarEvent[] = [];

    allPets.forEach((pet: any) => {
      // Vacinas
      (pet.vaccines ?? []).forEach((v: any) => {
        if (v.date) {
          allEvents.push({
            id: `vac-${v.id}`,
            petName: pet.name,
            petId: pet.id,
            type: "vaccine",
            name: v.name,
            date: v.date,
            done: v.done,
            color: Colors.accentGreen,
          });
        }
        if (v.nextDue) {
          allEvents.push({
            id: `vac-next-${v.id}`,
            petName: pet.name,
            petId: pet.id,
            type: "vaccine",
            name: `${v.name} (próxima dose)`,
            date: v.nextDue,
            done: false,
            color: Colors.accentOrange,
          });
        }
      });

      // Medicamentos
      (pet.medications ?? []).forEach((m: any) => {
        if (m.startDate) {
          allEvents.push({
            id: `med-${m.id}`,
            petName: pet.name,
            petId: pet.id,
            type: "medication",
            name: m.name,
            date: m.startDate,
            done: !m.active,
            color: Colors.accentLight,
          });
        }
      });

      // Próxima consulta
      if (pet.nextCheckup) {
        allEvents.push({
          id: `checkup-${pet.id}`,
          petName: pet.name,
          petId: pet.id,
          type: "vaccine",
          name: "Consulta de retorno",
          date: pet.nextCheckup,
          done: false,
          color: "#9B59B6",
        });
      }
    });

    // Ordena por data
    allEvents.sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      return da - db;
    });

    setEvents(allEvents);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // Converte DD/MM/AAAA para timestamp
  const parseDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return 0;
    return new Date(
      parseInt(parts[2]),
      parseInt(parts[1]) - 1,
      parseInt(parts[0])
    ).getTime();
  };

  // Filtra eventos do mês selecionado
  const filteredEvents = events.filter((e) => {
    const parts = e.date.split("/");
    if (parts.length !== 3) return false;
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    return month === selectedMonth && year === selectedYear;
  });

  // Conta eventos por mês para mostrar badges
  const eventsPerMonth = MONTHS.map((_, idx) =>
    events.filter((e) => {
      const parts = e.date.split("/");
      if (parts.length !== 3) return false;
      return parseInt(parts[1]) - 1 === idx && parseInt(parts[2]) === selectedYear;
    }).length
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Calendário de Saúde</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Seletor de meses */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.monthsScroll}
        contentContainerStyle={styles.monthsContent}
      >
        {MONTHS.map((m, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.monthBtn,
              selectedMonth === idx && styles.monthBtnActive,
            ]}
            onPress={() => setSelectedMonth(idx)}
          >
            <Text
              style={[
                styles.monthText,
                selectedMonth === idx && styles.monthTextActive,
              ]}
            >
              {m}
            </Text>
            {eventsPerMonth[idx] > 0 && (
              <View
                style={[
                  styles.monthBadge,
                  selectedMonth === idx && styles.monthBadgeActive,
                ]}
              >
                <Text style={styles.monthBadgeText}>
                  {eventsPerMonth[idx]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accentLight}
          />
        }
      >
        <Text style={styles.monthTitle}>
          {MONTH_NAMES[selectedMonth]} {selectedYear}
        </Text>

        {filteredEvents.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="calendar-outline"
              size={56}
              color={Colors.accentOrange + "40"}
            />
            <Text style={styles.emptyText}>
              Nenhum evento neste mês
            </Text>
            <Text style={styles.emptySubText}>
              Adicione vacinas e medicamentos para ver aqui
            </Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("PetDetail", { petId: event.petId })
              }
            >
              <View
                style={[
                  styles.eventIcon,
                  { backgroundColor: event.color + "20" },
                ]}
              >
                <Ionicons
                  name={
                    event.type === "vaccine"
                      ? "shield-checkmark"
                      : "medical"
                  }
                  size={20}
                  color={event.color}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventPet}>🐾 {event.petName}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
              </View>

              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: event.done
                      ? Colors.accentGreen
                      : Colors.accentOrange,
                  },
                ]}
              />
            </TouchableOpacity>
          ))
        )}

        {/* Resumo total */}
        {events.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumo geral</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.accentGreen }]}>
                  {events.filter((e) => e.done).length}
                </Text>
                <Text style={styles.summaryLabel}>Concluídos</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.accentOrange }]}>
                  {events.filter((e) => !e.done).length}
                </Text>
                <Text style={styles.summaryLabel}>Pendentes</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.white }]}>
                  {events.length}
                </Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.secondary,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18, fontWeight: "700", color: Colors.white },
  monthsScroll: {
    backgroundColor: Colors.secondary,
    maxHeight: 64,
  },
  monthsContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  monthBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    minWidth: 52,
  },
  monthBtnActive: {
    backgroundColor: Colors.accentOrange,
  },
  monthText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textLight,
  },
  monthTextActive: { color: Colors.white },
  monthBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accentRed,
    alignItems: "center",
    justifyContent: "center",
  },
  monthBadgeActive: { backgroundColor: Colors.white },
  monthBadgeText: { fontSize: 9, fontWeight: "700", color: Colors.white },
  content: { padding: 16, paddingBottom: 40, gap: 10 },
  monthTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 4,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  eventName: { fontSize: 14, fontWeight: "600", color: Colors.white },
  eventPet: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  eventDate: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: { fontSize: 16, color: Colors.textSecondary, fontWeight: "600" },
  emptySubText: { fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center" },
  summaryCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: { alignItems: "center", gap: 4 },
  summaryValue: { fontSize: 22, fontWeight: "800" },
  summaryLabel: { fontSize: 11, color: Colors.textLight },
});