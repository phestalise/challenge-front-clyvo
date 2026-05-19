import React, { useCallback, useState } from "react";

import {
  View,
  Text,
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
import { petService } from "../../services/PetService";
import { calcularIdadeTexto } from "../../utils/formatters";

import { styles } from "../../styles/PetsScreenStyles";

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
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addBtn}
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
          styles.list
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
          <View style={styles.empty}>
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
              style={styles.emptyBtn}
              onPress={() =>
                navigation.navigate(
                  "AddPet"
                )
              }
            >
              <Text
                style={
                  styles.emptyBtnText
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
                  style={styles.cardTop}
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
                    style={{
                      flex: 1,
                    }}
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
                        styles.tags
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
                    styles.healthRow
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
                    style={styles.barBg}
                  >
                    <View
                      style={[
                        styles.barFill,
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
                      styles.healthPct,
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
                    styles.statsRow
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