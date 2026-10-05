// HealthCalendarScreen.tsx

import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { alpha } from "../../styles/colors";
import { useTheme } from "../../theme";
import { RootStackParamList } from "../../types";
import { useHealthCalendarScreenStyles } from "../../styles/HealthCalendarScreen.styles";

import { usePets } from "../../hooks/usePets";
import { parseBrDate } from "../../utils/dateConversion";
import {
  HealthEvent,
  HealthEventState,
  buildHealthEvents,
  getEventState as computeEventState,
} from "../../utils/healthEvents";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type CalendarEvent = HealthEvent;

type EventState = HealthEventState;

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MAX_DOTS_PER_DAY = 3;

const TYPE_ICONS: Record<
  CalendarEvent["type"],
  keyof typeof Ionicons.glyphMap
> = {
  vaccine: "shield-checkmark-outline",
  medication: "medical-outline",
};

export default function HealthCalendarScreen() {
  const styles = useHealthCalendarScreenStyles();
  const { colors: Colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  // Esta tela é usada tanto como aba (rota "Calendar") quanto empilhada a
  // partir do Dashboard (rota "HealthCalendar") — só mostra o chevron de
  // voltar nesse segundo caso, já que como aba não há "voltar" para lugar
  // nenhum.
  const showBackButton = route.name !== "Calendar";

  const { pets, loading, error, reload } = usePets();
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [selectedDay, setSelectedDay] = useState<number | null>(
    today.getDate(),
  );

  const isCurrentMonth =
    selectedMonth === today.getMonth() && selectedYear === today.getFullYear();

  const getEventState = (event: CalendarEvent): EventState =>
    computeEventState(event, today);

  const events = useMemo(() => buildHealthEvents(pets), [pets]);

  const onRefresh = async () => {
    setRefreshing(true);

    await reload();

    setRefreshing(false);
  };

  const selectDayForMonth = (month: number, year: number) => {
    const isTargetCurrentMonth =
      month === today.getMonth() && year === today.getFullYear();

    setSelectedDay(isTargetCurrentMonth ? today.getDate() : 1);
  };

  const goToPreviousMonth = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear = selectedYear - 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    selectDayForMonth(newMonth, newYear);
  };

  const goToNextMonth = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear = selectedYear + 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    selectDayForMonth(newMonth, newYear);
  };

  const pad2 = (value: number) => String(value).padStart(2, "0");

  const selectDay = (day: number) => setSelectedDay(day);

  const goToToday = () => {
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
    setSelectedDay(today.getDate());
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();

    events.forEach((event) => {
      const eventDate = parseBrDate(event.date);

      if (!eventDate) return;

      if (
        eventDate.getMonth() !== selectedMonth ||
        eventDate.getFullYear() !== selectedYear
      ) {
        return;
      }

      const day = eventDate.getDate();
      const dayEvents = map.get(day) ?? [];

      dayEvents.push(event);
      map.set(day, dayEvents);
    });

    return map;
  }, [events, selectedMonth, selectedYear]);

  const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString(
    "pt-BR",
    {
      month: "long",
      year: "numeric",
    },
  );

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const selectedEvents =
    selectedDay !== null ? (eventsByDay.get(selectedDay) ?? []) : [];

  const selectedDateLabel =
    selectedDay !== null
      ? new Date(selectedYear, selectedMonth, selectedDay).toLocaleDateString(
          "pt-BR",
          { weekday: "long", day: "numeric", month: "long" },
        )
      : "";

  const stateVisual = (state: EventState) => {
    if (state === "done") {
      return { color: Colors.accentGreen, label: "Concluído" };
    }

    if (state === "overdue") {
      return { color: Colors.accentRed, label: "Atrasado" };
    }

    return { color: Colors.accent, label: "Pendente" };
  };

  const openNewRecord = () => {
    if (selectedDay === null) return;

    const date = `${pad2(selectedDay)}/${pad2(selectedMonth + 1)}/${selectedYear}`;

    navigation.navigate("AddHealthRecord", { date });
  };

  const renderEvent = (event: CalendarEvent) => {
    const { color, label } = stateVisual(getEventState(event));

    return (
      <TouchableOpacity
        key={event.id}
        activeOpacity={0.7}
        style={styles.eventRow}
        onPress={() => navigation.navigate("PetDetail", { petId: event.petId })}
      >
        <View
          style={[styles.eventIcon, { backgroundColor: alpha(color, 0.12) }]}
        >
          <Ionicons name={TYPE_ICONS[event.type]} size={20} color={color} />
        </View>

        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{event.name}</Text>

          <Text style={styles.eventPet}>{event.petName}</Text>
        </View>

        <View
          style={[styles.eventChip, { backgroundColor: alpha(color, 0.12) }]}
        >
          <Text style={[styles.eventChipText, { color }]}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const dotColor = (event: CalendarEvent, isSelected: boolean) => {
    if (isSelected) return Colors.onAccent;

    const state = getEventState(event);

    if (state === "overdue") return Colors.accentRed;
    if (state === "done") return Colors.accentGreen;

    return Colors.accent;
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Calendário</Text>

          <View style={{ width: 40 }} />
        </View>
      )}

      {loading && pets.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accent}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {error && <Text style={styles.emptyText}>{error}</Text>}

          <View style={styles.monthRow}>
            <View style={styles.monthTitleWrap}>
              <Text style={styles.monthText}>{monthName}</Text>

              <Text style={styles.monthSub}>
                {eventsByDay.size === 0
                  ? "Sem eventos neste mês"
                  : `${eventsByDay.size} ${eventsByDay.size === 1 ? "dia com eventos" : "dias com eventos"}`}
              </Text>
            </View>

            <View style={styles.monthNavRight}>
              {!isCurrentMonth && (
                <TouchableOpacity style={styles.todayBtn} onPress={goToToday}>
                  <Text style={styles.todayBtnText}>Hoje</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.monthNavBtn}
                onPress={goToPreviousMonth}
              >
                <Ionicons name="chevron-back" size={18} color={Colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.monthNavBtn}
                onPress={goToNextMonth}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.weekRow}>
            {DAYS.map((day) => (
              <View key={day} style={styles.weekTextWrapper}>
                <Text style={styles.weekText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              const dayEvents = day ? (eventsByDay.get(day) ?? []) : [];

              const isToday = isCurrentMonth && day === today.getDate();

              const isSelected = day !== null && day === selectedDay;

              const visibleDots =
                dayEvents.length > MAX_DOTS_PER_DAY
                  ? dayEvents.slice(0, 2)
                  : dayEvents;

              return (
                <View key={index} style={styles.dayCellWrapper}>
                  {day && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.dayCell,
                        isToday && styles.dayCellToday,
                        isSelected && styles.dayCellSelected,
                      ]}
                      onPress={() => selectDay(day)}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          isToday && styles.dayNumberToday,
                          isSelected && styles.dayNumberSelected,
                        ]}
                      >
                        {day}
                      </Text>

                      <View style={styles.dotsRow}>
                        {visibleDots.map((event) => (
                          <View
                            key={event.id}
                            style={[
                              styles.dot,
                              { backgroundColor: dotColor(event, isSelected) },
                            ]}
                          />
                        ))}

                        {dayEvents.length > MAX_DOTS_PER_DAY && (
                          <Text
                            style={[
                              styles.dotOverflowText,
                              {
                                color: isSelected
                                  ? Colors.onAccent
                                  : Colors.textMuted,
                              },
                            ]}
                          >
                            +{dayEvents.length - 2}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.legend}>
            {[
              { color: Colors.accent, label: "Pendente" },
              { color: Colors.accentRed, label: "Atrasado" },
              { color: Colors.accentGreen, label: "Concluído" },
            ].map((item) => (
              <View key={item.label} style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />

                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.agenda}>
            <View style={styles.agendaHeader}>
              <View style={styles.eventInfo}>
                <Text style={styles.agendaTitle}>{selectedDateLabel}</Text>

                <Text style={styles.agendaCount}>
                  {selectedEvents.length === 0
                    ? "Nada agendado"
                    : `${selectedEvents.length} ${selectedEvents.length === 1 ? "evento" : "eventos"}`}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addBtn}
                onPress={openNewRecord}
              >
                <Ionicons name="add" size={18} color={Colors.onAccent} />

                <Text style={styles.addBtnText}>Registro</Text>
              </TouchableOpacity>
            </View>

            {selectedEvents.length === 0 ? (
              <View style={styles.emptyAgenda}>
                <Ionicons
                  name="calendar-clear-outline"
                  size={32}
                  color={Colors.textLight}
                />

                <Text style={styles.emptyAgendaText}>
                  Nenhum evento neste dia.{"\n"}Toque em “Registro” para
                  adicionar uma vacina ou medicamento.
                </Text>
              </View>
            ) : (
              <View style={styles.eventList}>
                {selectedEvents.map(renderEvent)}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
