import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Modal,
  Pressable,
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

  const [menuVisible, setMenuVisible] =
    useState(false);

  const load = async () => {
    const p = await storageService.getPets();

    setPets(Array.isArray(p) ? p : []);
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
                          ? "happy"
                          : pet.species ===
                              "Pássaro"
                            ? "sunny"
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
                          width: `${score}%` as any,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.primary,
  },

  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  centerHeader: {
    flex: 1,
    alignItems: "center",
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },

  logoIcon: {
    width: 18,
    height: 18,
    borderRadius: 6,

    backgroundColor:
      Colors.accentLight + "20",

    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },

  menuButton: {
    width: 46,
    height: 46,

    borderRadius: 16,

    backgroundColor:
      "rgba(255,255,255,0.08)",

    alignItems: "center",
    justifyContent: "center",
  },

  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,

    backgroundColor:
      Colors.accentLight + "20",

    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",

    justifyContent: "flex-start",
    alignItems: "flex-start",

    paddingTop: 90,
    paddingLeft: 20,
  },

  menuContainer: {
    width: 220,

    borderRadius: 22,

    backgroundColor:
      "#17315B",

    paddingVertical: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",

    gap: 12,

    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  menuText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
  },

  list: {
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 12,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 90,
  },

  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: 32,

    backgroundColor:
      Colors.secondary,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 22,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.white,
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,

    color: Colors.textLight,
  },

  emptyBtn: {
    marginTop: 24,

    paddingHorizontal: 28,
    paddingVertical: 14,

    borderRadius: 18,

    backgroundColor:
      Colors.accentLight,
  },

  emptyBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
  },

  card: {
    backgroundColor:
      Colors.secondary,

    borderRadius: 22,

    padding: 16,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.05)",
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,

    backgroundColor:
      Colors.accentLight + "18",

    alignItems: "center",
    justifyContent: "center",
  },

  petName: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.white,
  },

  petMeta: {
    fontSize: 13,
    marginTop: 2,
    color: Colors.textLight,
  },

  tags: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },

  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 20,

    backgroundColor:
      "rgba(255,255,255,0.08)",
  },

  tagText: {
    fontSize: 11,
    color: Colors.textLight,
  },

  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },

  healthLabel: {
    width: 44,
    fontSize: 12,
    color: Colors.textLight,
  },

  barBg: {
    flex: 1,
    height: 6,
    borderRadius: 999,

    backgroundColor:
      "rgba(255,255,255,0.08)",
  },

  barFill: {
    height: 6,
    borderRadius: 999,
  },

  healthPct: {
    width: 40,
    textAlign: "right",

    fontSize: 12,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",

    marginTop: 16,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  statText: {
    fontSize: 11,
    color: Colors.textLight,
  },
});