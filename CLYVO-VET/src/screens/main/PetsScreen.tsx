import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";
import { styles } from "../../styles/PetsScreenStyles";

import { storageService } from "../../services/StorageService";
import { petService } from "../../services/PetService";

import { calcularIdadeTexto } from "../../utils/formatters";

export default function PetsScreen() {
  const navigation = useNavigation<any>();

  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] =
    useState(false);

  const [menuVisible, setMenuVisible] =
    useState(false);

  const load = async () => {
    try {
      const p =
        await storageService.getPets();

      setPets(Array.isArray(p) ? p : []);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            setMenuVisible(true)
          }
        >
          <Ionicons
            name="menu"
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>

        <View style={styles.centerHeader}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons
                name="paw"
                size={11}
                color={
                  Colors.accentLight
                }
              />
            </View>

            <Text style={styles.logo}>
              CLYVO
            </Text>
          </View>

          <View style={styles.titleRow}>
            <Ionicons
              name="paw"
              size={14}
              color={
                Colors.accentLight
              }
            />

            <Text style={styles.title}>
              PETS
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            navigation.navigate("AddPet")
          }
        >
          <Ionicons
            name="add"
            size={20}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.overlay}
          onPress={() =>
            setMenuVisible(false)
          }
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);

                navigation.navigate(
                  "Dashboard"
                );
              }}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color={Colors.white}
              />

              <Text style={styles.menuText}>
                Início
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);

                navigation.navigate(
                  "Pets"
                );
              }}
            >
              <Ionicons
                name="paw-outline"
                size={20}
                color={Colors.white}
              />

              <Text style={styles.menuText}>
                Pets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);

                navigation.navigate(
                  "Health"
                );
              }}
            >
              <Ionicons
                name="heart-outline"
                size={20}
                color={Colors.white}
              />

              <Text style={styles.menuText}>
                Saúde
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);

                navigation.navigate(
                  "Profile"
                );
              }}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={Colors.white}
              />

              <Text style={styles.menuText}>
                Perfil
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={
              Colors.accentLight
            }
          />
        }
        contentContainerStyle={
          styles.list
        }
        showsVerticalScrollIndicator={
          false
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
              score > 70
                ? Colors.accentGreen
                : score > 40
                  ? Colors.accentOrange
                  : Colors.accentRed;

            const vaccinesDone = (
              pet.vaccines ?? []
            ).filter((v: any) => v.done)
              .length;

            const vaccinesTotal = (
              pet.vaccines ?? []
            ).length;

            const medActive = (
              pet.medications ?? []
            ).filter(
              (m: any) => m.active
            ).length;

            return (
              <TouchableOpacity
                key={pet.id}
                style={styles.card}
                activeOpacity={0.9}
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
                      name={
                        pet.species ===
                        "Gato"
                          ? "logo-octocat"
                          : pet.species ===
                              "Pássaro"
                            ? "leaf"
                            : "paw"
                      }
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
                      size={13}
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
                      size={13}
                      color={
                        Colors.accentOrange
                      }
                    />

                    <Text
                      style={
                        styles.statText
                      }
                    >
                      {medActive} meds
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