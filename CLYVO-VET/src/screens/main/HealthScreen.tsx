
import React, {
  useCallback,
  useState,
} from "react";

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

import { styles } from "../../styles/HealthScreenStyles";

import { storageService } from "../../services/StorageService";

export default function HealthScreen() {
  const navigation = useNavigation<any>();

  const [pets, setPets] = useState<any[]>(
    []
  );

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
    } catch (error) {
      console.log(error);
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

  const goToStack = (
    name: string,
    params?: object
  ) => {
    navigation
      .getParent()
      ?.navigate(name, params);
  };

  const getHealthScore = (
    pet: any
  ): number => {
    if (
      !pet.vaccines ||
      pet.vaccines.length === 0
    ) {
      return 100;
    }

    const done =
      pet.vaccines.filter(
        (v: any) => v.done
      ).length;

    return Math.round(
      (done /
        pet.vaccines.length) *
        100
    );
  };

  const getScoreColor = (
    score: number
  ) => {
    if (score > 70)
      return Colors.accentGreen;

    if (score > 40)
      return Colors.accentOrange;

    return Colors.accentRed;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Saúde
        </Text>

        <TouchableOpacity
          style={styles.calendarBtn}
          onPress={() =>
            goToStack(
              "HealthCalendar"
            )
          }
        >
          <Ionicons
            name="calendar"
            size={20}
            color={
              Colors.accentOrange
            }
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={onRefresh}
            tintColor={
              Colors.accentLight
            }
          />
        }
      >
        {pets.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="medkit"
              size={60}
              color={
                Colors.accentGreen +
                "40"
              }
            />

            <Text
              style={
                styles.emptyText
              }
            >
              Nenhum pet cadastrado
            </Text>

            <TouchableOpacity
              style={
                styles.emptyBtn
              }
              onPress={() =>
                goToStack(
                  "AddPet"
                )
              }
            >
              <Text
                style={
                  styles.emptyBtnText
                }
              >
                Adicionar Pet
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text
              style={
                styles.sectionTitle
              }
            >
              SEUS PETS
            </Text>

            {pets.map((pet) => {
              const score =
                getHealthScore(
                  pet
                );

              const scoreColor =
                getScoreColor(
                  score
                );

              const vaccinesDone =
                (
                  pet.vaccines ??
                  []
                ).filter(
                  (v: any) =>
                    v.done
                ).length;

              const vaccinesTotal =
                (
                  pet.vaccines ??
                  []
                ).length;

              const medsActive =
                (
                  pet.medications ??
                  []
                ).filter(
                  (m: any) =>
                    m.active
                ).length;

              return (
                <TouchableOpacity
                  key={pet.id}
                  style={
                    styles.petCard
                  }
                  activeOpacity={
                    0.85
                  }
                  onPress={() =>
                    goToStack(
                      "PetDetail",
                      {
                        petId:
                          pet.id,
                      }
                    )
                  }
                >
                  <View
                    style={
                      styles.petCardTop
                    }
                  >
                    <View
                      style={
                        styles.avatar
                      }
                    >
                      <Ionicons
                        name={
                          pet.species ===
                          "Gato"
                            ? "happy"
                            : "paw"
                        }
                        size={26}
                        color={
                          Colors.accentLight
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.flexOne
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
                        {
                          pet.species
                        }{" "}
                        ·{" "}
                        {pet.breed}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.scoreText,
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
                      styles.progressBg
                    }
                  >
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${score}%`,
                          backgroundColor:
                            scoreColor,
                        },
                      ]}
                    />
                  </View>

                  <View
                    style={
                      styles.petStats
                    }
                  >
                    <View
                      style={
                        styles.petStat
                      }
                    >
                      <Ionicons
                        name="shield-checkmark"
                        size={13}
                        color={
                          Colors.accentGreen
                        }
                      />

                      <Text
                        style={
                          styles.petStatText
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
                      style={
                        styles.petStat
                      }
                    >
                      <Ionicons
                        name="medical"
                        size={13}
                        color={
                          Colors.accentLight
                        }
                      />

                      <Text
                        style={
                          styles.petStatText
                        }
                      >
                        {
                          medsActive
                        }{" "}
                        med.
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}