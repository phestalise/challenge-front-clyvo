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

import { Colors, alpha } from "../../styles/colors";
import { RootStackParamList } from "../../types";
import { styles } from "../../styles/HealthCalendarScreen.styles";

import { usePets } from "../../hooks/usePets";
import { parseBrDate } from "../../utils/dateConversion";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type CalendarEvent = {
  id: string;
  petName: string;
  petId: string;
  type: "vaccine" | "medication";
  name: string;
  date: string;
  done: boolean;
};

type EventState = "done" | "pending" | "overdue";

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

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const getEventState = (event: CalendarEvent): EventState => {
    if (event.done) return "done";

    const eventDate = parseBrDate(event.date);

    if (eventDate && eventDate < startOfToday) return "overdue";

    return "pending";
  };

  const events = useMemo<CalendarEvent[]>(() => {
    const allEvents: CalendarEvent[] = [];

    pets.forEach((pet) => {
      (pet.vaccines ?? []).forEach((v) => {
        if (v.startDate) {
          allEvents.push({
            id: `vac-${v.id}`,
            petName: pet.name,
            petId: pet.id,
            type: "vaccine",
            name: v.name,
            date: v.startDate,
            done: v.done,
          });
        }

        if (v.endDate) {
          allEvents.push({
            id: `vac-next-${v.id}`,
            petName: pet.name,
            petId: pet.id,
            type: "vaccine",
            name: `${v.name} - Próxima dose`,
            date: v.endDate,
            done: false,
          });
        }
      });

      (pet.medications ?? []).forEach((m) => {
        if (m.startDate) {
          allEvents.push({
            id: `med-${m.id}`,
            petName: pet.name,
            petId: pet.id,
            type: "medication",
            name: m.name,
            date: m.startDate,
            done: !m.active,
          });
        }
      });
    });

    return allEvents;
  }, [pets]);

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

  const selectDay = (day: number) => {
    setSelectedDay(day);

    const date = `${pad2(day)}/${pad2(selectedMonth + 1)}/${selectedYear}`;

    navigation.navigate("AddHealthRecord", { date });
  };

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

  const todayPendingEvents = useMemo(() => {
    return events.filter((event) => {
      if (event.done) return false;

      const eventDate = parseBrDate(event.date);

      return (
        eventDate !== null &&
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      );
    });
  }, [events]);

  const renderTodayPendingItem = (event: CalendarEvent) => {
    const iconColor =
      getEventState(event) === "overdue" ? Colors.accentRed : Colors.accent;

    return (
      <TouchableOpacity
        key={event.id}
        style={styles.todayItem}
        onPress={() => navigation.navigate("PetDetail", { petId: event.petId })}
      >
        <View
          style={[
            styles.todayItemIcon,
            { backgroundColor: alpha(iconColor, 0.12) },
          ]}
        >
          <Ionicons name={TYPE_ICONS[event.type]} size={16} color={iconColor} />
        </View>

        <View style={styles.flexOne}>
          <Text style={styles.todayItemName}>{event.name}</Text>

          <Text style={styles.todayItemPet}>{event.petName}</Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.titleWrap}>
            <View style={styles.titleBadge}>
              <Ionicons
                name="calendar-outline"
                size={15}
                color={alpha(Colors.white, 0.85)}
              />

              <Text style={styles.title}>Calendário</Text>
            </View>
          </View>

          <View style={{ width: 36 }} />
        </View>
      )}

      {loading && pets.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.white}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {error && <Text style={styles.emptyText}>{error}</Text>}

          <View style={styles.todayCard}>
            <View style={styles.todayCardHeader}>
              <Text style={styles.todayCardTitle}>Pendências de hoje</Text>

              {todayPendingEvents.length > 0 && (
                <View style={styles.todayCountBadge}>
                  <Text style={styles.todayCountText}>
                    {todayPendingEvents.length}
                  </Text>
                </View>
              )}
            </View>

            {todayPendingEvents.length === 0 ? (
              <Text style={styles.todayEmptyText}>
                Nenhuma pendência para hoje
              </Text>
            ) : (
              <View style={styles.todayList}>
                {todayPendingEvents.map(renderTodayPendingItem)}
              </View>
            )}
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.monthRow}>
              <TouchableOpacity
                style={styles.monthNavBtn}
                onPress={goToPreviousMonth}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>

              <Text style={styles.monthText}>{monthName}</Text>

              <View style={styles.monthNavRight}>
                {!isCurrentMonth && (
                  <TouchableOpacity style={styles.todayBtn} onPress={goToToday}>
                    <Text style={styles.todayBtnText}>Hoje</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.monthNavBtn}
                  onPress={goToNextMonth}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.tapHint}>
              Toque em um dia para adicionar um novo registro
            </Text>

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
                            isSelected && styles.dayNumberSelected,
                          ]}
                        >
                          {day}
                        </Text>

                        {dayEvents.length > 0 && (
                          <View style={styles.dotsRow}>
                            {dayEvents.length > MAX_DOTS_PER_DAY ? (
                              <>
                                {dayEvents.slice(0, 2).map((event) => (
                                  <View
                                    key={event.id}
                                    style={[
                                      styles.dot,
                                      {
                                        backgroundColor: isSelected
                                          ? Colors.white
                                          : getEventState(event) === "overdue"
                                            ? Colors.accentRed
                                            : Colors.accentLight,
                                      },
                                    ]}
                                  />
                                ))}

                                <Text
                                  style={[
                                    styles.dotOverflowText,
                                    {
                                      color: isSelected
                                        ? Colors.white
                                        : Colors.textSecondary,
                                    },
                                  ]}
                                >
                                  +{dayEvents.length - 2}
                                </Text>
                              </>
                            ) : (
                              dayEvents.map((event) => (
                                <View
                                  key={event.id}
                                  style={[
                                    styles.dot,
                                    {
                                      backgroundColor: isSelected
                                        ? Colors.white
                                        : getEventState(event) === "overdue"
                                          ? Colors.accentRed
                                          : Colors.accentLight,
                                    },
                                  ]}
                                />
                              ))
                            )}
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View style={styles.legendRing} />

                <Text style={styles.legendText}>Hoje</Text>
              </View>

              <View style={styles.legendRow}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: Colors.accentLight },
                  ]}
                />

                <Text style={styles.legendText}>Lembrete</Text>
              </View>

              <View style={styles.legendRow}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: Colors.accentRed },
                  ]}
                />

                <Text style={styles.legendText}>Atrasado</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
