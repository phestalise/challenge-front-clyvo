import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import { styles, DAY_SIZE } from "../../styles/Healthcalendarscreen.styles";

const WEEK_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const EVENT_TYPES: Record<string, { color: string; icon: string }> = {
  Vacina: { color: Colors.accentGreen, icon: "shield-checkmark" },
  Medicamento: { color: Colors.accentOrange, icon: "medical" },
  Consulta: { color: Colors.accentLight, icon: "calendar" },
};

function parseDate(str: string): Date | null {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 3) {
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function HealthCalendarScreen() {
  const navigation = useNavigation();
  const [pets, setPets] = useState<any[]>([]);
  const [today] = useState(new Date());
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);

  useFocusEffect(useCallback(() => {
    storageService.getPets().then(setPets);
  }, []));

  const allEvents = pets.flatMap((pet) => [
    ...(pet.vaccines ?? []).map((v: any) => ({
      petName: pet.name,
      type: "Vacina",
      name: v.name,
      date: v.nextDue,
      done: v.done,
    })),
    ...(pet.medications ?? []).map((m: any) => ({
      petName: pet.name,
      type: "Medicamento",
      name: m.name,
      date: m.startDate,
      done: !m.active,
    })),
    ...(pet.appointments ?? []).map((a: any) => ({
      petName: pet.name,
      type: "Consulta",
      name: a.reason ?? "Consulta",
      date: a.date,
      done: a.done ?? false,
    })),
  ]);

  const eventsForDay = (day: Date) =>
    allEvents.filter((ev) => {
      const d = parseDate(ev.date);
      return d && isSameDay(d, day);
    });

  const hasEvent = (day: Date) => eventsForDay(day).length > 0;

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; month: "prev" | "current" | "next"; date: Date }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push({ day: d, month: "prev", date: new Date(year, month - 1, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: "current", date: new Date(year, month, d) });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, month: "next", date: new Date(year, month + 1, d) });
  }

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const selectedEvents = eventsForDay(selected);

  const monthLabel = current.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Calendário de Saúde</Text>
            <Text style={styles.headerSub}>{allEvents.filter((e) => !e.done).length} eventos pendentes</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarCard}>
          <View style={styles.calNavRow}>
            <TouchableOpacity style={styles.calNavBtn} onPress={prevMonth}>
              <Ionicons name="chevron-back" size={18} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.calMonthLabel}>{monthLabel}</Text>
            <TouchableOpacity style={styles.calNavBtn} onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={18} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {WEEK_LABELS.map((l) => (
              <Text key={l} style={styles.weekLabel}>{l}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {cells.map((cell, idx) => {
              const isToday = isSameDay(cell.date, today);
              const isSelected = isSameDay(cell.date, selected);
              const hasEv = hasEvent(cell.date);
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dayCell,
                    isToday && !isSelected && styles.dayCellToday,
                    isSelected && styles.dayCellSelected,
                  ]}
                  onPress={() => setSelected(cell.date)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayNum,
                      isToday && !isSelected && styles.dayNumToday,
                      isSelected && styles.dayNumSelected,
                      cell.month !== "current" && styles.dayNumOtherMonth,
                    ]}
                  >
                    {cell.day}
                  </Text>
                  {hasEv && <View style={styles.eventDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.legend}>
          {Object.entries(EVENT_TYPES).map(([type, meta]) => (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: meta.color }]} />
              <Text style={styles.legendText}>{type}</Text>
            </View>
          ))}
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.eventsSectionTitle}>
            {selected.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </Text>

          {selectedEvents.length === 0 ? (
            <View style={styles.emptyDay}>
              <Ionicons name="calendar-outline" size={40} color={Colors.textSecondary} />
              <Text style={styles.emptyDayText}>Nenhum evento neste dia</Text>
            </View>
          ) : (
            selectedEvents.map((ev, i) => {
              const meta = EVENT_TYPES[ev.type] ?? { color: Colors.accentLight, icon: "calendar" };
              return (
                <View
                  key={i}
                  style={[styles.eventCard, { borderLeftColor: meta.color }]}
                >
                  <View style={[styles.eventIconBox, { backgroundColor: meta.color + "20" }]}>
                    <Ionicons name={meta.icon as any} size={20} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventCardTitle}>{ev.name}</Text>
                    <Text style={styles.eventCardPet}>{ev.petName} · {ev.type}</Text>
                  </View>
                  <Text style={styles.eventCardDate}>{ev.done ? "✓ feito" : "pendente"}</Text>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}