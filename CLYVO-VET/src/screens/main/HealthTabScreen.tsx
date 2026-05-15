import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import { petService } from "../../services/PetService";
import { calcularIdadeTexto } from "../../utils/formatters";

export default function HealthTabScreen() {
  const navigation = useNavigation<any>();

  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] =
    useState(false);

  const load = async () => {
    try {
      const data =
        await storageService.getPets();

      setPets(
        Array.isArray(data)
          ? data
          : []
      );
    } catch {
      setPets([]);
    }
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

  const getPetIcon = (
    species: string
  ) => {
    if (species === "Gato") {
      return "logo-octocat";
    }

    if (species === "Pássaro") {
      return "leaf";
    }

    return "paw";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="heart"
            size={20}
            color={Colors.accentRed}
          />

          <Text style={styles.title}>
            Saúde
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addButton}
          onPress={() =>
            navigation.navigate(
              "AddHealthRecord"
            )
          }
        >
          <Ionicons
            name="add"
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={
              Colors.accentLight
            }
          />
        }
      >
        {pets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="heart"
                size={52}
                color={
                  Colors.accentRed +
                  "55"
                }
              />
            </View>

            <Text style={styles.emptyTitle}>
              Nenhum pet cadastrado
            </Text>

            <Text style={styles.emptyText}>
              Adicione um pet para
              acompanhar a saúde
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.emptyButton}
              onPress={() =>
                navigation.navigate(
                  "AddPet"
                )
              }
            >
              <Text
                style={
                  styles.emptyButtonText
                }
              >
                Adicionar Pet
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          pets.map((pet) => {
            const score =
              petService.getHealthScore(
                pet
              );

            const scoreColor =
              score >= 70
                ? Colors.accentGreen
                : score >= 40
                  ? Colors.accentOrange
                  : Colors.accentRed;

            const vaccinesDone = (
              pet.vaccines ?? []
            ).filter(
              (item: any) =>
                item.done
            ).length;

            const vaccinesTotal = (
              pet.vaccines ?? []
            ).length;

            const activeMedications = (
              pet.medications ?? []
            ).filter(
              (item: any) =>
                item.active
            ).length;

            const pendingVaccines = (
              pet.vaccines ?? []
            ).filter(
              (item: any) =>
                !item.done
            ).length;

            return (
              <TouchableOpacity
                key={pet.id}
                activeOpacity={0.9}
                style={styles.card}
                onPress={() =>
                  navigation.navigate(
                    "PetDetail",
                    {
                      petId: pet.id,
                    }
                  )
                }
              >
                <View
                  style={styles.cardHeader}
                >
                  <View
                    style={styles.avatar}
                  >
                    <Ionicons
                      name={getPetIcon(
                        pet.species
                      )}
                      size={24}
                      color={
                        Colors.accentLight
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.cardInfo
                    }
                  >
                    <Text
                      style={
                        styles.petName
                      }
                    >
                      {pet.name}
                    </Text>

                    <Text
                      style={
                        styles.petMeta
                      }
                    >
                      {pet.species} •{" "}
                      {pet.breed} •{" "}
                      {calcularIdadeTexto(
                        pet.age
                      )}
                    </Text>
                  </View>

                  {pendingVaccines >
                    0 && (
                    <View
                      style={
                        styles.pendingBadge
                      }
                    >
                      <Text
                        style={
                          styles.pendingText
                        }
                      >
                        {
                          pendingVaccines
                        }{" "}
                        pendente
                        {pendingVaccines >
                        1
                          ? "s"
                          : ""}
                      </Text>
                    </View>
                  )}

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={
                      Colors.textLight
                    }
                  />
                </View>

                <View
                  style={
                    styles.healthContainer
                  }
                >
                  <Text
                    style={
                      styles.healthLabel
                    }
                  >
                    Saúde
                  </Text>

                  <View
                    style={
                      styles.progressBackground
                    }
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${score}%`,
                          backgroundColor:
                            scoreColor,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.healthValue,
                      {
                        color:
                          scoreColor,
                      },
                    ]}
                  >
                    {score}%
                  </Text>
                </View>

                <View
                  style={
                    styles.statsContainer
                  }
                >
                  <View
                    style={styles.stat}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={14}
                      color={
                        Colors.accentGreen
                      }
                    />

                    <Text
                      style={
                        styles.statText
                      }
                    >
                      {
                        vaccinesDone
                      }
                      /
                      {
                        vaccinesTotal
                      }{" "}
                      vacinas
                    </Text>
                  </View>

                  <View
                    style={styles.stat}
                  >
                    <Ionicons
                      name="medical"
                      size={14}
                      color={
                        Colors.accentOrange
                      }
                    />

                    <Text
                      style={
                        styles.statText
                      }
                    >
                      {
                        activeMedications
                      }{" "}
                      meds
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.checkupContainer
                  }
                >
                  <Ionicons
                    name="calendar"
                    size={14}
                    color={
                      Colors.accentLight
                    }
                  />

                  <Text
                    style={
                      styles.checkupText
                    }
                  >
                    Próximo retorno:{" "}
                    {pet.nextCheckup ||
                      "Não definido"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.primary,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.white,
  },

  addButton: {
    width: 52,
    height: 52,

    borderRadius: 18,

    backgroundColor:
      Colors.accentRed,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 14,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 90,
  },

  emptyIcon: {
    width: 110,
    height: 110,

    borderRadius: 30,

    backgroundColor:
      Colors.secondary,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.white,
  },

  emptyText: {
    marginTop: 10,

    fontSize: 14,
    lineHeight: 22,

    textAlign: "center",

    color: Colors.textLight,
  },

  emptyButton: {
    marginTop: 26,

    paddingHorizontal: 28,
    paddingVertical: 14,

    borderRadius: 18,

    backgroundColor:
      Colors.accentRed,
  },

  emptyButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
  },

  card: {
    padding: 16,

    borderRadius: 24,

    backgroundColor:
      Colors.secondary,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.05)",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,

    borderRadius: 18,

    backgroundColor:
      Colors.accentLight + "18",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 14,
  },

  cardInfo: {
    flex: 1,
  },

  petName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
  },

  petMeta: {
    marginTop: 2,

    fontSize: 13,
    color: Colors.textLight,
  },

  pendingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 999,

    marginRight: 10,

    backgroundColor:
      Colors.accentRed + "20",
  },

  pendingText: {
    fontSize: 11,
    fontWeight: "700",

    color: Colors.accentRed,
  },

  healthContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 18,
  },

  healthLabel: {
    width: 50,
    fontSize: 12,
    color: Colors.textLight,
  },

  progressBackground: {
    flex: 1,
    height: 7,

    borderRadius: 999,

    overflow: "hidden",

    backgroundColor:
      "rgba(255,255,255,0.08)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  healthValue: {
    width: 45,

    fontSize: 12,
    fontWeight: "700",

    textAlign: "right",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent:
      "space-between",

    marginTop: 18,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statText: {
    fontSize: 11,
    color: Colors.textLight,
  },

  checkupContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    marginTop: 18,

    paddingTop: 14,

    borderTopWidth: 1,

    borderTopColor:
      "rgba(255,255,255,0.06)",
  },

  checkupText: {
    fontSize: 12,
    color: Colors.textLight,
  },
});