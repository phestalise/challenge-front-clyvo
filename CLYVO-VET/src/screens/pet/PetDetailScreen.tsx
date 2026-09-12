import React, { useRef, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";

import Svg, { Circle } from "react-native-svg";

import * as ImagePicker from "expo-image-picker";

import { showAlert } from "../../utils/showAlert";

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../../types";

import { Colors, alpha } from "../../styles/colors";

import { petService } from "../../services/PetService";
import { usePet } from "../../hooks/usePet";

import VaccineCard from "../../components/VaccineCard";
import MedicationCard from "../../components/MedicationCard";

import { calcularIdadeTexto } from "../../utils/formatters";

import { styles } from "../../styles/PetDetailScreen.styles";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Route = RouteProp<RootStackParamList, "PetDetail">;

type Tab = "info" | "vacinas" | "medicamentos";

const TABS: { key: Tab; label: string }[] = [
  { key: "info", label: "Info" },
  { key: "vacinas", label: "Vacinas" },
  { key: "medicamentos", label: "Remédios" },
];

const RING_SIZE = 76;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

export default function PetDetailScreen() {
  const navigation = useNavigation<Nav>();

  const route = useRoute<Route>();

  const insets = useSafeAreaInsets();

  const petId = route?.params?.petId;

  const [tab, setTab] = useState<Tab>("info");

  const [menuOpen, setMenuOpen] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const kebabRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  const openMenu = () => {
    kebabRef.current?.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        const screenWidth = Dimensions.get("window").width;

        setMenuAnchor({
          top: y + height + 8,
          right: screenWidth - (x + width),
        });

        setMenuOpen(true);
      },
    );
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const [photoSaving, setPhotoSaving] = useState(false);

  const { pet, loading, error, remove, save, reload } = usePet(petId);

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showAlert(
        "Permissão necessária",
        "Precisamos de acesso às suas fotos para escolher uma imagem do pet.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (result.canceled || !result.assets?.[0]?.uri || !pet) return;

    setPhotoSaving(true);

    const ok = await save({ ...pet, photoUri: result.assets[0].uri });

    if (ok) {
      await reload();
    } else {
      showAlert(
        "Erro ao salvar",
        "Não foi possível salvar a foto. Tente novamente.",
      );
    }

    setPhotoSaving(false);
  };

  const handleDelete = () => {
    if (!pet || !petId) {
      return;
    }

    showAlert("Remover", `Remover ${pet.name}?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          const ok = await remove();

          if (!ok) {
            showAlert(
              "Erro ao remover",
              "Não foi possível remover o pet. Tente novamente.",
            );
            return;
          }

          navigation.goBack();
        },
      },
    ]);
  };

  if (!petId) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Pet não encontrado</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accentLight} />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>{error ?? "Pet não encontrado"}</Text>
      </View>
    );
  }

  const score = petService.getHealthScore(pet);

  const scoreColor =
    score > 70
      ? Colors.accentGreen
      : score > 40
        ? Colors.accentOrange
        : Colors.accentRed;

  const vaccinesDone = pet.vaccines?.filter((v) => v.done).length ?? 0;
  const vaccinesTotal = pet.vaccines?.length ?? 0;
  const activeMedications =
    pet.medications?.filter((m) => m.active).length ?? 0;

  const infoRows: { label: string; value: string }[] = [
    { label: "Nome", value: pet.name },
    { label: "Espécie", value: pet.species },
    { label: "Raça", value: pet.breed },
    { label: "Idade", value: calcularIdadeTexto(pet.birthDate) },
    { label: "Peso", value: `${pet.weight} kg` },
    {
      label: "Próximo retorno",
      value: pet.nextCheckup || "Não agendado",
    },
  ];

  return (
    <View style={styles.container}>
      <Ionicons
        name="paw"
        size={120}
        color={alpha(Colors.white, 0.05)}
        style={styles.pawWatermark}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <Ionicons name="paw" size={16} color={Colors.accentLight} />

            <Text style={styles.logo}>CLYVO</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>Detalhes</Text>
          </View>

          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate("AddPet", { petId })}
          >
            <Ionicons name="create-outline" size={18} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            ref={kebabRef}
            style={styles.headerBtn}
            onPress={openMenu}
          >
            <Ionicons name="ellipsis-vertical" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            {photoSaving ? (
              <ActivityIndicator size="small" color={Colors.accentLight} />
            ) : pet.photoUri ? (
              <Image
                source={{ uri: pet.photoUri }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarInitial}>{getInitial(pet.name)}</Text>
            )}
          </View>
        </View>

        <Text style={styles.petName}>{pet.name}</Text>

        <Text style={styles.petMeta}>
          {pet.species} · {pet.breed}
        </Text>

        <View style={styles.chips}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {calcularIdadeTexto(pet.birthDate)}
            </Text>
          </View>

          <View style={styles.chip}>
            <Text style={styles.chipText}>{pet.weight} kg</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Resumo de saúde</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.ringWrap}>
              <Svg width={RING_SIZE} height={RING_SIZE}>
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  stroke={Colors.border}
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
                  strokeDashoffset={RING_CIRCUMFERENCE * (1 - score / 100)}
                  transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                />
              </Svg>

              <View style={styles.ringCenter}>
                <Text style={[styles.ringNum, { color: scoreColor }]}>
                  {score}%
                </Text>

                <Text style={styles.ringLabel}>Saúde</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {vaccinesDone}/{vaccinesTotal}
                </Text>

                <Text style={styles.summaryLabel}>Vacinas</Text>
              </View>

              <View style={styles.summaryStatDivider} />

              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {activeMedications}
                </Text>

                <Text style={styles.summaryLabel}>Medicamentos</Text>
              </View>
            </View>
          </View>

          <View style={styles.checkupRow}>
            <Text style={styles.checkupLabel}>Próximo retorno</Text>

            <Text style={styles.checkupValue} numberOfLines={1}>
              {pet.nextCheckup || "Não agendado"}
            </Text>
          </View>
        </View>

        <View style={styles.tabsRow}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
              onPress={() => setTab(t.key)}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  tab === t.key && styles.tabBtnTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "info" && (
          <View style={styles.infoBlock}>
            {infoRows.map((row, i) => (
              <View
                key={row.label}
                style={[
                  styles.infoRow,
                  i === infoRows.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.infoKey}>{row.label}</Text>

                <Text style={styles.infoVal}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}

        {tab === "vacinas" &&
          ((pet.vaccines ?? []).length === 0 ? (
            <View style={styles.tabEmpty}>
              <Text style={styles.tabEmptyText}>Nenhuma vacina registrada</Text>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate("Vaccines")}
              >
                <Text style={styles.secondaryBtnText}>Adicionar vacina</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.tabContent}>
              {pet.vaccines!.map((v, i) => (
                <VaccineCard key={i} vaccine={v} petName={pet.name} />
              ))}
            </View>
          ))}

        {tab === "medicamentos" &&
          ((pet.medications ?? []).length === 0 ? (
            <View style={styles.tabEmpty}>
              <Text style={styles.tabEmptyText}>
                Nenhum medicamento registrado
              </Text>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate("Medications")}
              >
                <Text style={styles.secondaryBtnText}>
                  Adicionar medicamento
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.tabContent}>
              {pet.medications!.map((m, i) => (
                <MedicationCard key={i} medication={m} petName={pet.name} />
              ))}
            </View>
          ))}
      </ScrollView>

      <Modal
        visible={menuOpen && !!menuAnchor}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.menuBackdrop} onPress={closeMenu}>
          {menuAnchor && (
            <View
              style={[
                styles.menuCard,
                { top: menuAnchor.top, right: menuAnchor.right },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  handlePickPhoto();
                }}
              >
                <Text style={styles.menuItemText}>
                  {pet.photoUri ? "Alterar foto" : "Adicionar foto"}
                </Text>
              </TouchableOpacity>

              <View style={styles.menuItemDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  handleDelete();
                }}
              >
                <Text style={styles.menuItemTextDanger}>Excluir pet</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}
