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

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const load = async () => {
    const data = await storageService.getPets();

    const pets = Array.isArray(data) ? data : [];

    const allEvents: CalendarEvent[] = [];

    pets.forEach((pet: any) => {
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
            name: `${v.name} - Próxima dose`,
            date: v.nextDue,
            done: false,
            color: Colors.accentOrange,
          });
        }
      });

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

        <View style={{ width: 40 }} />
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
                  !day && {
                    backgroundColor: "transparent",
                  },
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

                  <View style={{ flex: 1 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.secondary,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor:
      "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },

  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  monthText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  weekText: {
    width: "14.2%",
    textAlign: "center",
    color: Colors.textLight,
    fontWeight: "600",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },

  dayCard: {
    width: "14.2%",
    minHeight: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 4,
  },

  dayNumber: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  eventList: {
    gap: 4,
  },

  eventBadge: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },

  eventBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "600",
  },

  moreText: {
    color: Colors.textLight,
    fontSize: 10,
    marginTop: 2,
  },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 24,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendText: {
    color: Colors.textLight,
    fontSize: 12,
  },

  pendingContainer: {
    padding: 16,
    gap: 12,
    marginTop: 20,
  },

  pendingTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },

  pendingCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  pendingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  pendingName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  pendingPet: {
    color: Colors.textLight,
    fontSize: 12,
    marginTop: 2,
  },

  pendingDate: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 2,
  },

  emptyText: {
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 20,
  },
});