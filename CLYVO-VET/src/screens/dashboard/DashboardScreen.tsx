import React, { useMemo, useState } from "react";

import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { alpha } from "../../styles/colors";
import { useTheme } from "../../theme";
import { useDashboardScreenStyles } from "../../styles/DashboardScreen.styles";
import { RootStackParamList } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { usePets } from "../../hooks/usePets";
import { primeiroNome } from "../../utils/formatters";
import {
  HealthEvent,
  buildHealthEvents,
  daysUntil,
  getAttentionEvents,
} from "../../utils/healthEvents";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MAX_ATTENTION_ITEMS = 3;

const initialsOf = (name: string | null | undefined) =>
  (name ?? "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

const greetingFor = (hour: number) => {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

function whenLabel(days: number): string {
  if (days < 0) return `Atrasado ${Math.abs(days)}d`;
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  return `Em ${days} dias`;
}

export default function DashboardScreen() {
  const styles = useDashboardScreenStyles();
  const { colors: Colors } = useTheme();
  const navigation = useNavigation<Nav>();

  const { user } = useAuth();
  const { pets, reload } = usePets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await reload();

    setRefreshing(false);
  };

  const now = new Date();

  const events = useMemo(() => buildHealthEvents(pets), [pets]);

  const attention = useMemo(() => getAttentionEvents(events), [events]);

  const allVaccines = pets.flatMap((p) => p.vaccines ?? []);
  const allMeds = pets.flatMap((p) => p.medications ?? []);

  const hasPets = pets.length > 0;

  const stats: {
    key: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    value: number;
    label: string;
    color: string;
    onPress: () => void;
  }[] = [
    {
      key: "pets",
      icon: "paw-outline",
      value: pets.length,
      label: "Pets",
      color: Colors.accentOnDark,
      onPress: () => navigation.navigate("Pets"),
    },
    {
      key: "vaccines",
      icon: "shield-check-outline",
      value: allVaccines.filter((v) => v.done).length,
      label: "Vacinas aplicadas",
      color: Colors.successOnDark,
      onPress: () => navigation.navigate("Vaccines"),
    },
    {
      key: "meds",
      icon: "pill",
      value: allMeds.filter((m) => m.active).length,
      label: "Em tratamento",
      color: Colors.warningOnDark,
      onPress: () => navigation.navigate("Medications"),
    },
    {
      key: "pending",
      icon: "alert-circle-outline",
      value: allVaccines.filter((v) => !v.done).length,
      label: "Pendências",
      color: Colors.dangerOnDark,
      onPress: () => navigation.navigate("Pending"),
    },
  ];

  const quickActions: {
    key: string;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
    onPress: () => void;
  }[] = [
    {
      key: "record",
      icon: "add-circle-outline",
      label: "Novo registro",
      color: Colors.accent,
      onPress: () => navigation.navigate("AddHealthRecord"),
    },
    {
      key: "calendar",
      icon: "calendar-outline",
      label: "Calendário",
      color: Colors.accentOnDark,
      onPress: () => navigation.navigate("Calendar"),
    },
    {
      key: "health",
      icon: "heart-outline",
      label: "Saúde",
      color: Colors.accentRed,
      onPress: () => navigation.navigate("Health"),
    },
    {
      key: "chat",
      icon: "chatbubble-ellipses-outline",
      label: "Assistente",
      color: Colors.accentOrange,
      onPress: () => navigation.navigate("PetChat"),
    },
  ];

  const attentionVisual = (event: HealthEvent) => {
    const days = daysUntil(event) ?? 0;
    const color =
      days < 0
        ? Colors.accentRed
        : days <= 1
          ? Colors.accentOrange
          : Colors.accent;

    return { days, color };
  };

  const pendingByPet = (petId: string) =>
    attention.filter((event) => event.petId === petId).length;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          !hasPets && styles.contentCentered,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
      >
        <View style={styles.greetingRow}>
          <View style={styles.greetingText}>
            <Text style={styles.greeting}>
              {greetingFor(now.getHours())},{" "}
              {primeiroNome(user?.name ?? "") || "tutor"}
            </Text>

            <Text style={styles.date}>
              {now.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatarBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.avatarBtnText}>{initialsOf(user?.name)}</Text>
          </TouchableOpacity>
        </View>

        {hasPets ? (
          <>
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Precisa de atenção</Text>
              </View>

              {attention.length === 0 ? (
                <View style={styles.attentionOk}>
                  <Ionicons
                    name="checkmark-circle"
                    size={32}
                    color={Colors.accentGreen}
                  />

                  <View>
                    <Text style={styles.attentionOkTitle}>Tudo em dia!</Text>

                    <Text style={styles.attentionOkText}>
                      Nada vencendo nos próximos 7 dias.
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.attentionCard}>
                  {attention
                    .slice(0, MAX_ATTENTION_ITEMS)
                    .map((event, index) => {
                      const { days, color } = attentionVisual(event);

                      return (
                        <TouchableOpacity
                          key={event.id}
                          activeOpacity={0.7}
                          style={[
                            styles.attentionRow,
                            index > 0 && styles.attentionRowDivider,
                          ]}
                          onPress={() =>
                            navigation.navigate("PetDetail", {
                              petId: event.petId,
                            })
                          }
                        >
                          <View
                            style={[
                              styles.attentionIcon,
                              { backgroundColor: alpha(color, 0.12) },
                            ]}
                          >
                            <Ionicons
                              name={
                                event.type === "vaccine"
                                  ? "shield-checkmark-outline"
                                  : "medical-outline"
                              }
                              size={20}
                              color={color}
                            />
                          </View>

                          <View style={styles.attentionInfo}>
                            <Text
                              style={styles.attentionName}
                              numberOfLines={1}
                            >
                              {event.name}
                            </Text>

                            <Text style={styles.attentionPet}>
                              {event.petName}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.attentionChip,
                              { backgroundColor: alpha(color, 0.12) },
                            ]}
                          >
                            <Text style={[styles.attentionChipText, { color }]}>
                              {whenLabel(days)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}

                  {attention.length > MAX_ATTENTION_ITEMS && (
                    <Text style={styles.attentionMore}>
                      +{attention.length - MAX_ATTENTION_ITEMS} outros
                    </Text>
                  )}
                </View>
              )}
            </View>

            <View style={styles.actionsRow}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.key}
                  style={styles.action}
                  activeOpacity={0.8}
                  onPress={action.onPress}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: alpha(action.color, 0.12) },
                    ]}
                  >
                    <Ionicons
                      name={action.icon}
                      size={26}
                      color={action.color}
                    />
                  </View>

                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Meus pets</Text>

                <TouchableOpacity onPress={() => navigation.navigate("Pets")}>
                  <Text style={styles.sectionLink}>Ver todos</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.petsRow}
              >
                {pets.map((pet) => {
                  const pending = pendingByPet(pet.id);

                  return (
                    <TouchableOpacity
                      key={pet.id}
                      style={styles.petCard}
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate("PetDetail", { petId: pet.id })
                      }
                    >
                      <View style={styles.petAvatar}>
                        {pet.photoUri ? (
                          <Image
                            source={{ uri: pet.photoUri }}
                            style={styles.petAvatarImage}
                          />
                        ) : (
                          <Text style={styles.petAvatarInitial}>
                            {initialsOf(pet.name)}
                          </Text>
                        )}
                      </View>

                      <Text style={styles.petName} numberOfLines={1}>
                        {pet.name}
                      </Text>

                      <Text
                        style={[
                          styles.petStatus,
                          {
                            color:
                              pending > 0
                                ? Colors.accentOrange
                                : Colors.accentGreen,
                          },
                        ]}
                      >
                        {pending > 0
                          ? `${pending} ${pending === 1 ? "aviso" : "avisos"}`
                          : "Em dia"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  style={styles.petAddCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("AddPet")}
                >
                  <Ionicons name="add" size={26} color={Colors.textMuted} />

                  <Text style={styles.petAddText}>Novo pet</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Resumo</Text>
              </View>

              <View style={styles.statsGrid}>
                {stats.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.statCard}
                    activeOpacity={0.8}
                    onPress={item.onPress}
                  >
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: alpha(item.color, 0.14) },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={20}
                        color={item.color}
                      />
                    </View>

                    <View>
                      <Text style={styles.statValue}>{item.value}</Text>

                      <Text style={styles.statLabel}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyLogo}>
              <MaterialCommunityIcons
                name="paw-outline"
                size={40}
                color={Colors.accent}
              />
            </View>

            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>

            <Text style={styles.emptySubtitle}>
              Cadastre seu primeiro pet para acompanhar vacinas, medicamentos e
              consultas por aqui.
            </Text>

            <TouchableOpacity
              style={styles.emptyCta}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("AddPet")}
            >
              <Ionicons name="add" size={20} color={Colors.onAccent} />

              <Text style={styles.emptyCtaText}>
                Cadastrar meu primeiro pet
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
