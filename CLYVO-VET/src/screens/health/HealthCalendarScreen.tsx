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

import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";
import {
  styles,
} from "../../styles/HealthCalendarScreen.styles";

import { usePets } from "../../hooks/usePets";

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

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function HealthCalendarScreen() {
  const navigation = useNavigation<any>();

  const { pets, loading, error, reload } = usePets();
  const [refreshing, setRefreshing] = useState(false);

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const events = useMemo<CalendarEvent[]>(() => {
    const allEvents: CalendarEvent[] = [];

    pets.forEach((pet) => {
      (pet.vaccines ?? []).forEach((v) => {
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
            name: `${v.name} - Próxima dose`,
            date: v.nextDue,
            done: false,
            color: Colors.accentOrange,
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
            color: Colors.accentLight,
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

  const getDaysInMonth = (
    month: number,
    year: number
  ) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (
    month: number,
    year: number
  ) => {
    return new Date(year, month, 1).getDay();
  };

  const hasEvent = (day: number) => {
    return events.some((event) => {
      const parts = event.date.split("/");

      if (parts.length !== 3) return false;

      const eventDay = parseInt(parts[0]);
      const eventMonth = parseInt(parts[1]) - 1;
      const eventYear = parseInt(parts[2]);

      return (
        eventDay === day &&
        eventMonth === selectedMonth &&
        eventYear === selectedYear
      );
    });
  };

  const getEventsByDay = (day: number) => {
    return events.filter((event) => {
      const parts = event.date.split("/");

      if (parts.length !== 3) return false;

      const eventDay = parseInt(parts[0]);
      const eventMonth = parseInt(parts[1]) - 1;
      const eventYear = parseInt(parts[2]);

      return (
        eventDay === day &&
        eventMonth === selectedMonth &&
        eventYear === selectedYear
      );
    });
  };

  const monthName = new Date(
    selectedYear,
    selectedMonth
  ).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(
    selectedMonth,
    selectedYear
  );

  const firstDay = getFirstDayOfMonth(
    selectedMonth,
    selectedYear
  );

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={Colors.white}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Calendário
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <View style={styles.monthRow}>
        <TouchableOpacity
          onPress={() => {
            if (selectedMonth === 0) {
              setSelectedMonth(11);
              setSelectedYear(selectedYear - 1);
            } else {
              setSelectedMonth(selectedMonth - 1);
            }
          }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {monthName}
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (selectedMonth === 11) {
              setSelectedMonth(0);
              setSelectedYear(selectedYear + 1);
            } else {
              setSelectedMonth(selectedMonth + 1);
            }
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {DAYS.map((day) => (
          <Text
            key={day}
            style={styles.weekText}
          >
            {day}
          </Text>
        ))}
      </View>

      {loading && pets.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.accentLight} />
        </View>
      ) : (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accentLight}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <Text style={styles.emptyText}>{error}</Text>
        )}

        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => {
            const dayEvents = day
              ? getEventsByDay(day)
              : [];

            return (
              <View
                key={index}
                style={[
                  styles.dayCard,
                  !day &&
                    styles.emptyDayCard,
                ]}
              >
                {day && (
                  <>
                    <Text style={styles.dayNumber}>
                      {day}
                    </Text>

                    {hasEvent(day) && (
                      <View style={styles.eventList}>
                        {dayEvents
                          .slice(0, 2)
                          .map((event) => (
                            <TouchableOpacity
                              key={event.id}
                              style={[
                                styles.eventBadge,
                                {
                                  backgroundColor:
                                    event.done
                                      ? Colors.accentGreen
                                      : Colors.accentOrange,
                                },
                              ]}
                              onPress={() =>
                                navigation.navigate(
                                  "PetDetail",
                                  {
                                    petId:
                                      event.petId,
                                  }
                                )
                              }
                            >
                              <Text
                                numberOfLines={1}
                                style={
                                  styles.eventBadgeText
                                }
                              >
                                {event.petName}
                              </Text>
                            </TouchableOpacity>
                          ))}

                        {dayEvents.length >
                          2 && (
                          <Text
                            style={
                              styles.moreText
                            }
                          >
                            +
                            {dayEvents.length -
                              2}
                          </Text>
                        )}
                      </View>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    Colors.accentGreen,
                },
              ]}
            />

            <Text style={styles.legendText}>
              Concluído
            </Text>
          </View>

          <View style={styles.legendRow}>
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    Colors.accentOrange,
                },
              ]}
            />

            <Text style={styles.legendText}>
              Pendente
            </Text>
          </View>
        </View>

        <View style={styles.pendingContainer}>
          <Text style={styles.pendingTitle}>
            Pendências cadastradas
          </Text>

          {events.filter((e) => !e.done)
            .length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma pendência encontrada
            </Text>
          ) : (
            events
              .filter((e) => !e.done)
              .map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.pendingCard}
                  onPress={() =>
                    navigation.navigate(
                      "PetDetail",
                      {
                        petId: event.petId,
                      }
                    )
                  }
                >
                  <View
                    style={[
                      styles.pendingIcon,
                      {
                        backgroundColor:
                          event.color + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        event.type ===
                        "vaccine"
                          ? "shield-checkmark"
                          : "medical"
                      }
                      size={18}
                      color={event.color}
                    />
                  </View>

                  <View style={styles.flexOne}>
                    <Text
                      style={
                        styles.pendingName
                      }
                    >
                      {event.name}
                    </Text>

                    <Text
                      style={
                        styles.pendingPet
                      }
                    >
                      🐾 {event.petName}
                    </Text>

                    <Text
                      style={
                        styles.pendingDate
                      }
                    >
                      {event.date}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
          )}
        </View>
      </ScrollView>
      )}
    </View>
  );
}