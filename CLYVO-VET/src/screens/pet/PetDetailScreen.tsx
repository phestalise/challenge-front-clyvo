import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import {
  RootStackParamList,
  Pet,
} from "../../types";

import { Colors } from "../../styles/colors";

import { petService } from "../../services/PetService";

import VaccineCard from "../../components/VaccineCard";
import MedicationCard from "../../components/MedicationCard";

import { calcularIdadeTexto } from "../../utils/formatters";

type Nav =
  NativeStackNavigationProp<RootStackParamList>;

type Route = RouteProp<
  RootStackParamList,
  "PetDetail"
>;

type Tab =
  | "info"
  | "vacinas"
  | "medicamentos";

export default function PetDetailScreen() {
  const navigation = useNavigation<Nav>();

  const route = useRoute<Route>();

  const petId = route?.params?.petId;

  const [pet, setPet] = useState<Pet | null>(
    null
  );

  const [tab, setTab] =
    useState<Tab>("info");

  useFocusEffect(
    useCallback(() => {
      if (!petId) {
        return;
      }

      petService
        .getById(petId)
        .then((data) => {
          setPet(data ?? null);
        });
    }, [petId])
  );

  const handleDelete = () => {
    if (!pet || !petId) {
      return;
    }

    Alert.alert(
      "Remover",
      `Remover ${pet.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            await petService.remove(petId);

            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!petId) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>
          Pet não encontrado
        </Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>
          Carregando...
        </Text>
      </View>
    );
  }

  const score =
    petService.getHealthScore(pet);

  const scoreColor =
    score > 70
      ? Colors.accentGreen
      : score > 40
      ? Colors.accentOrange
      : Colors.accentRed;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={Colors.white}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {pet.name}
        </Text>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
        >
          <Ionicons
            name="trash-outline"
            size={19}
            color={Colors.accentRed}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name={
                pet.species === "Gato"
                  ? "happy"
                  : "paw"
              }
              size={42}
              color={Colors.accentLight}
            />
          </View>

          <Text style={styles.petName}>
            {pet.name}
          </Text>

          <Text style={styles.petMeta}>
            {pet.species} · {pet.breed}
          </Text>

          <View
            style={[
              styles.ring,
              {
                borderColor: scoreColor,
              },
            ]}
          >
            <Text
              style={[
                styles.ringNum,
                {
                  color: scoreColor,
                },
              ]}
            >
              {score}%
            </Text>

            <Text style={styles.ringLabel}>
              Saúde
            </Text>
          </View>

          <View style={styles.chips}>
            {[
              {
                icon: "calendar-outline",
                text: calcularIdadeTexto(
                  pet.age
                ),
              },
              {
                icon: "fitness-outline",
                text: `${pet.weight} kg`,
              },
              {
                icon: "color-palette-outline",
                text: pet.color,
              },
            ].map((c, i) => (
              <View
                key={i}
                style={styles.chip}
              >
                <Ionicons
                  name={c.icon as any}
                  size={13}
                  color={
                    Colors.textSecondary
                  }
                />

                <Text style={styles.chipText}>
                  {c.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text
              style={[
                styles.statVal,
                {
                  color:
                    Colors.accentGreen,
                },
              ]}
            >
              {pet.vaccines?.filter(
                (v) => v.done
              ).length ?? 0}
              /
              {pet.vaccines?.length ?? 0}
            </Text>

            <Text style={styles.statLabel}>
              Vacinas
            </Text>
          </View>

          <View style={styles.statDiv} />

          <View style={styles.stat}>
            <Text
              style={[
                styles.statVal,
                {
                  color:
                    Colors.accentLight,
                },
              ]}
            >
              {pet.medications?.filter(
                (m) => m.active
              ).length ?? 0}
            </Text>

            <Text style={styles.statLabel}>
              Medicamentos
            </Text>
          </View>

          <View style={styles.statDiv} />

          <View style={styles.stat}>
            <Text
              style={[
                styles.statVal,
                {
                  color:
                    Colors.accentOrange,
                  fontSize: 12,
                },
              ]}
            >
              {pet.nextCheckup || "—"}
            </Text>

            <Text style={styles.statLabel}>
              Retorno
            </Text>
          </View>
        </View>

        <View style={styles.tabsRow}>
          {(
            [
              "info",
              "vacinas",
              "medicamentos",
            ] as Tab[]
          ).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.tabBtn,
                tab === t &&
                  styles.tabBtnActive,
              ]}
              onPress={() => setTab(t)}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  tab === t &&
                    styles.tabBtnTextActive,
                ]}
              >
                {t.charAt(0).toUpperCase() +
                  t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "info" && (
          <View style={styles.infoBlock}>
            {[
              ["Nome", pet.name],
              ["Espécie", pet.species],
              ["Raça", pet.breed],
              [
                "Idade",
                calcularIdadeTexto(
                  pet.age
                ),
              ],
              [
                "Peso",
                `${pet.weight} kg`,
              ],
              ["Cor", pet.color],
              [
                "Próximo retorno",
                pet.nextCheckup ||
                  "Não agendado",
              ],
              [
                "Cadastrado",
                new Date(
                  pet.createdAt
                ).toLocaleDateString(
                  "pt-BR"
                ),
              ],
            ].map(([k, v], i, arr) => (
              <View
                key={i}
                style={[
                  styles.infoRow,
                  i === arr.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <Text style={styles.infoKey}>
                  {k}
                </Text>

                <Text style={styles.infoVal}>
                  {v}
                </Text>
              </View>
            ))}
          </View>
        )}

        {tab === "vacinas" &&
          ((pet.vaccines ?? []).length ===
          0 ? (
            <Text style={styles.noData}>
              Nenhuma vacina registrada
            </Text>
          ) : (
            pet.vaccines!.map((v, i) => (
              <VaccineCard
                key={i}
                vaccine={v}
                petName={pet.name}
              />
            ))
          ))}

        {tab === "medicamentos" &&
          ((pet.medications ?? [])
            .length === 0 ? (
            <Text style={styles.noData}>
              Nenhum medicamento
              registrado
            </Text>
          ) : (
            pet.medications!.map((m, i) => (
              <MedicationCard
                key={i}
                medication={m}
                petName={pet.name}
              />
            ))
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  loadingText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor:
      "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: Colors.white,
  },

  deleteBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor:
      Colors.accentRed + "20",
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },

  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor:
      Colors.accentLight + "15",
    justifyContent: "center",
    alignItems: "center",
  },

  petName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },

  petMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  ring: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
  },

  ringNum: {
    fontSize: 18,
    fontWeight: "900",
  },

  ringLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  chips: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.background,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 9,
  },

  chipText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  statsRow: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  stat: {
    alignItems: "center",
    gap: 4,
  },

  statVal: {
    fontSize: 16,
    fontWeight: "900",
  },

  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  statDiv: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },

  tabsRow: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 13,
    padding: 4,
    gap: 4,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },

  tabBtnActive: {
    backgroundColor: Colors.primary,
  },

  tabBtnText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  tabBtnTextActive: {
    color: Colors.white,
  },

  infoBlock: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: "hidden",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  infoKey: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  infoVal: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },

  noData: {
    textAlign: "center",
    color: Colors.textSecondary,
    paddingTop: 30,
  },
});