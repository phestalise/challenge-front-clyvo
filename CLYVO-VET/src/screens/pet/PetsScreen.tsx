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

export default function PetsScreen() {
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
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddPet")
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
                name="paw"
                size={52}
                color={
                  Colors.accentLight +
                  "55"
                }
              />
            </View>

            <Text style={styles.emptyTitle}>
              Nenhum pet cadastrado
            </Text>

            <Text style={styles.emptyText}>
              Cadastre seu primeiro pet
              para começar
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
                Cadastrar Pet
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
                      {pet.breed}
                    </Text>

                    <View
                      style={
                        styles.tagsRow
                      }
                    >
                      <View
                        style={
                          styles.tag
                        }
                      >
                        <Text
                          style={
                            styles.tagText
                          }
                        >
                          {calcularIdadeTexto(
                            pet.age
                          )}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.tag
                        }
                      >
                        <Text
                          style={
                            styles.tagText
                          }
                        >
                          {pet.weight} kg
                        </Text>
                      </View>
                    </View>
                  </View>

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

  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 14,
    alignItems: "flex-end",
  },

  addButton: {
    width: 52,
    height: 52,

    borderRadius: 18,

    backgroundColor:
      Colors.accentLight,

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
      Colors.accentLight,
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

  tagsRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },

  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.08)",
  },

  tagText: {
    fontSize: 11,
    color: Colors.textLight,
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
});