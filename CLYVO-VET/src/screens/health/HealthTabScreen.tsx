// HealthTabScreen.tsx

import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import Svg, { Circle } from "react-native-svg";

import { showAlert } from "../../utils/showAlert";

import { Colors, alpha } from "../../styles/colors";
import { RootStackParamList, Pet } from "../../types";

import { styles } from "../../styles/HealthTabScreen.styles";

import { petService } from "../../services/PetService";
import { usePets } from "../../hooks/usePets";

import { calcularIdadeTexto } from "../../utils/formatters";
import { parseBrDate } from "../../utils/dateConversion";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Urgency = "overdue" | "soon" | "ok" | "none";

type CheckupInfo = {
  days: number | null;
  label: string;
  urgency: Urgency;
};

const RING_SIZE = 44;
const RING_STROKE = 3.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const daysBetween = (target: Date, from: Date) =>
  Math.round(
    (startOfDay(target).getTime() - startOfDay(from).getTime()) / 86400000,
  );

function getCheckupInfo(pet: Pet, today: Date): CheckupInfo {
  const date = parseBrDate(pet.nextCheckup);

  if (!date) {
    return { days: null, label: "Sem retorno agendado", urgency: "none" };
  }

  const days = daysBetween(date, today);

  if (days < 0) {
    return {
      days,
      label: `Atrasado há ${Math.abs(days)} dia${Math.abs(days) > 1 ? "s" : ""}`,
      urgency: "overdue",
    };
  }

  if (days === 0) {
    return { days, label: "Retorno é hoje", urgency: "soon" };
  }

  if (days <= 7) {
    return {
      days,
      label: `Retorno em ${days} dia${days > 1 ? "s" : ""}`,
      urgency: "soon",
    };
  }

  return {
    days,
    label: `${pet.nextCheckup} · em ${days} dias`,
    urgency: "ok",
  };
}

export default function HealthTabScreen() {
  const navigation = useNavigation<Nav>();

  const { pets, loading, error, reload } = usePets();

  const [refreshing, setRefreshing] = useState(false);

  const [scheduleTarget, setScheduleTarget] = useState<Pet | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [saving, setSaving] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await reload();

    setRefreshing(false);
  };

  const openScheduleModal = (pet: Pet) => {
    setScheduleTarget(pet);
    setScheduleDate(pet.nextCheckup || "");
  };

  const closeScheduleModal = () => {
    setScheduleTarget(null);
    setScheduleDate("");
  };

  const handleSaveSchedule = async () => {
    if (!scheduleTarget) return;

    if (scheduleDate.trim() && !parseBrDate(scheduleDate)) {
      showAlert("Data inválida", "Use o formato DD/MM/AAAA.");
      return;
    }

    setSaving(true);

    try {
      await petService.save({
        ...scheduleTarget,
        nextCheckup: scheduleDate.trim(),
      });

      await reload();
      closeScheduleModal();
    } catch {
      showAlert(
        "Erro ao salvar",
        "Não foi possível salvar o retorno. Tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  };

  const careHighlight = useMemo(() => {
    if (pets.length === 0) return null;

    const today = new Date();

    const scored = pets.map((pet) => ({
      pet,
      info: getCheckupInfo(pet, today),
    }));

    const overdue = scored
      .filter((s) => s.info.urgency === "overdue")
      .sort((a, b) => (a.info.days ?? 0) - (b.info.days ?? 0));

    if (overdue.length > 0) {
      return {
        type: "overdue" as const,
        pet: overdue[0].pet,
        days: Math.abs(overdue[0].info.days ?? 0),
      };
    }

    const soon = scored
      .filter((s) => s.info.urgency === "soon")
      .sort((a, b) => (a.info.days ?? 0) - (b.info.days ?? 0));

    if (soon.length > 0) {
      return {
        type: "soon" as const,
        pet: soon[0].pet,
        days: soon[0].info.days ?? 0,
      };
    }

    const missing = scored.filter((s) => s.info.urgency === "none");

    if (missing.length > 0) {
      return { type: "missing" as const, pet: missing[0].pet };
    }

    const upcoming = scored
      .filter((s) => s.info.urgency === "ok")
      .sort((a, b) => (a.info.days ?? 0) - (b.info.days ?? 0));

    return {
      type: "upcoming" as const,
      pet: upcoming[0].pet,
      days: upcoming[0].info.days ?? 0,
    };
  }, [pets]);

  const highlightContent = (() => {
    if (!careHighlight) return null;

    const { pet } = careHighlight;

    switch (careHighlight.type) {
      case "overdue":
        return {
          icon: "alert-circle" as const,
          color: Colors.accentRed,
          eyebrow: "Atenção necessária",
          message: `O retorno de ${pet.name} está atrasado há ${careHighlight.days} dia${careHighlight.days > 1 ? "s" : ""}.`,
          ctaLabel: "Ver pet",
          onPress: () => navigation.navigate("PetDetail", { petId: pet.id }),
        };
      case "soon":
        return {
          icon: "calendar" as const,
          color: Colors.accentOrange,
          eyebrow: "Chegando aí",
          message:
            careHighlight.days === 0
              ? `O retorno de ${pet.name} é hoje.`
              : `O retorno de ${pet.name} é em ${careHighlight.days} dia${careHighlight.days > 1 ? "s" : ""}.`,
          ctaLabel: "Ver pet",
          onPress: () => navigation.navigate("PetDetail", { petId: pet.id }),
        };
      case "missing":
        return {
          icon: "heart" as const,
          color: Colors.accentLight,
          eyebrow: "Um cuidado a mais",
          message: `Você ainda não agendou o próximo retorno de ${pet.name}.`,
          ctaLabel: "Agendar agora",
          onPress: () => openScheduleModal(pet),
        };
      case "upcoming":
      default:
        return {
          icon: "checkmark-circle" as const,
          color: Colors.accentGreen,
          eyebrow: "Tudo em dia",
          message: `Próximo retorno de ${pet.name} em ${careHighlight.days} dias. Seguimos cuidando bem dele.`,
          ctaLabel: null,
          onPress: undefined,
        };
    }
  })();

  return (
    <View style={styles.container}>
      <Ionicons
        name="paw"
        size={70}
        color={Colors.white}
        style={styles.pawWatermark}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>Central de cuidados</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addButton}
          onPress={() => navigation.navigate("AddHealthRecord")}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accentLight}
            />
          }
        >
          {error && <Text style={styles.emptyText}>{error}</Text>}

          {pets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="heart"
                  size={52}
                  color={Colors.accentRed + "55"}
                />
              </View>

              <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>

              <Text style={styles.emptyText}>
                Adicione um pet para acompanhar a saúde
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.emptyButton}
                onPress={() => navigation.navigate("AddPet")}
              >
                <Text style={styles.emptyButtonText}>Adicionar Pet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {highlightContent && (
                <View
                  style={[
                    styles.careBanner,
                    { borderLeftColor: highlightContent.color },
                  ]}
                >
                  <View style={styles.careBannerTop}>
                    <View
                      style={[
                        styles.careIconWrap,
                        {
                          backgroundColor: alpha(highlightContent.color, 0.15),
                        },
                      ]}
                    >
                      <Ionicons
                        name={highlightContent.icon}
                        size={20}
                        color={highlightContent.color}
                      />
                    </View>

                    <View style={styles.careTextWrap}>
                      <Text style={styles.careEyebrow}>
                        {highlightContent.eyebrow}
                      </Text>

                      <Text style={styles.careMessage}>
                        {highlightContent.message}
                      </Text>
                    </View>
                  </View>

                  {highlightContent.ctaLabel && (
                    <TouchableOpacity
                      style={[
                        styles.careCta,
                        { backgroundColor: highlightContent.color },
                      ]}
                      activeOpacity={0.85}
                      onPress={highlightContent.onPress}
                    >
                      <Text style={styles.careCtaText}>
                        {highlightContent.ctaLabel}
                      </Text>

                      <Ionicons
                        name="arrow-forward"
                        size={14}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {pets.map((pet) => {
                const score = petService.getHealthScore(pet);

                const scoreColor =
                  score >= 70
                    ? Colors.accentGreen
                    : score >= 40
                      ? Colors.accentOrange
                      : Colors.accentRed;

                const vaccinesDone = (pet.vaccines ?? []).filter(
                  (item: any) => item.done,
                ).length;

                const vaccinesTotal = (pet.vaccines ?? []).length;

                const activeMedications = (pet.medications ?? []).filter(
                  (item: any) => item.active,
                ).length;

                const pendingVaccines = (pet.vaccines ?? []).filter(
                  (item: any) => !item.done,
                ).length;

                const checkup = getCheckupInfo(pet, new Date());

                const checkupColor =
                  checkup.urgency === "overdue"
                    ? Colors.accentRed
                    : checkup.urgency === "soon"
                      ? Colors.accentOrange
                      : checkup.urgency === "ok"
                        ? Colors.accentLight
                        : Colors.textMuted;

                return (
                  <TouchableOpacity
                    key={pet.id}
                    activeOpacity={0.9}
                    style={styles.card}
                    onPress={() =>
                      navigation.navigate("PetDetail", {
                        petId: pet.id,
                      })
                    }
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarInitial}>
                          {getInitial(pet.name)}
                        </Text>
                      </View>

                      <View style={styles.cardInfo}>
                        <Text style={styles.petName}>{pet.name}</Text>

                        <Text style={styles.petMeta}>
                          {pet.species} · {calcularIdadeTexto(pet.birthDate)}
                        </Text>
                      </View>

                      {pendingVaccines > 0 && (
                        <View style={styles.pendingBadge}>
                          <Text style={styles.pendingText}>
                            {pendingVaccines} pendente
                            {pendingVaccines > 1 ? "s" : ""}
                          </Text>
                        </View>
                      )}

                      <View style={styles.ringWrap}>
                        <Svg width={RING_SIZE} height={RING_SIZE}>
                          <Circle
                            cx={RING_SIZE / 2}
                            cy={RING_SIZE / 2}
                            r={RING_RADIUS}
                            stroke={Colors.overlaySoft}
                            strokeWidth={RING_STROKE}
                            fill="none"
                          />

                          <Circle
                            cx={RING_SIZE / 2}
                            cy={RING_SIZE / 2}
                            r={RING_RADIUS}
                            stroke={scoreColor}
                            strokeWidth={RING_STROKE}
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${RING_CIRCUMFERENCE}`}
                            strokeDashoffset={
                              RING_CIRCUMFERENCE * (1 - score / 100)
                            }
                            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                          />
                        </Svg>

                        <View style={styles.ringCenter}>
                          <Text
                            style={[styles.ringText, { color: scoreColor }]}
                          >
                            {score}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.cardDivider} />

                    <Text style={styles.statsText}>
                      {vaccinesDone}/{vaccinesTotal} vacinas ·{" "}
                      {activeMedications} medicamentos
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.checkupRow,
                        { backgroundColor: alpha(checkupColor, 0.12) },
                      ]}
                      activeOpacity={checkup.urgency === "none" ? 0.7 : 1}
                      onPress={() => {
                        if (checkup.urgency === "none") {
                          openScheduleModal(pet);
                        }
                      }}
                    >
                      <Ionicons
                        name={
                          checkup.urgency === "overdue"
                            ? "alert-circle-outline"
                            : "calendar-outline"
                        }
                        size={14}
                        color={checkupColor}
                      />

                      <Text
                        style={[styles.checkupText, { color: checkupColor }]}
                      >
                        {checkup.label}
                      </Text>

                      {checkup.urgency === "none" && (
                        <Text style={styles.checkupAction}>Agendar</Text>
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>
      )}

      <Modal
        visible={!!scheduleTarget}
        transparent
        animationType="slide"
        onRequestClose={closeScheduleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Retorno de {scheduleTarget?.name}
            </Text>

            <Text style={styles.inputLabel}>Data do próximo retorno</Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textLight}
              value={scheduleDate}
              onChangeText={setScheduleDate}
              keyboardType="number-pad"
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeScheduleModal}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSaveSchedule}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.saveText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
