import React, {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Animated,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

  const [pets, setPets] = useState<any[]>(
    []
  );

  const [refreshing, setRefreshing] =
    useState(false);

  const bounceAnim = useRef(
    new Animated.Value(1)
  ).current;

  const load = async () => {
    try {
      const petsData =
        await storageService.getPets();

      setPets(
        Array.isArray(petsData)
          ? petsData
          : []
      );
    } catch {
      setPets([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();

      Animated.loop(
        Animated.sequence([
          Animated.timing(
            bounceAnim,
            {
              toValue: 1.1,
              duration: 700,
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            bounceAnim,
            {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }
          ),
        ])
      ).start();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);

    await load();

    setRefreshing(false);
  };

  const allVaccines =
    pets.flatMap(
      (p) => p.vaccines ?? []
    );

  const allMeds = pets.flatMap(
    (p) => p.medications ?? []
  );

  const vaccinesDone =
    allVaccines.filter((v) => v.done)
      .length;

  const pendingVaccines =
    allVaccines.filter((v) => !v.done)
      .length;

  const activeMeds =
    allMeds.filter((m) => m.active)
      .length;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
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
        <View style={styles.topHeader} />

        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <View style={styles.bannerIcon}>
              <Ionicons
                name="sparkles"
                size={22}
                color={
                  Colors.accentLight
                }
              />
            </View>

            <Text style={styles.bannerText}>
              {pets.length === 0
                ? "Cadastre seu primeiro pet"
                : `${pets.length} pet${pets.length > 1 ? "s" : ""} cadastrado${pets.length > 1 ? "s" : ""}`}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.chatButton}
            onPress={() =>
              navigation.navigate(
                "PetChat"
              )
            }
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={22}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Pets")
            }
          >
            <View style={styles.cardTop}>
              <Animated.View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      Colors.accentLight +
                      "20",

                    transform: [
                      {
                        scale:
                          bounceAnim,
                      },
                    ],
                  },
                ]}
              >
                <Ionicons
                  name="paw"
                  size={22}
                  color={
                    Colors.accentLight
                  }
                />
              </Animated.View>

              <Text
                style={[
                  styles.cardValue,
                  {
                    color:
                      Colors.accentLight,
                  },
                ]}
              >
                {pets.length}
              </Text>
            </View>

            <Text style={styles.cardLabel}>
              Pets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                "Vaccines"
              )
            }
          >
            <View style={styles.cardTop}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      Colors.accentGreen +
                      "20",
                  },
                ]}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={22}
                  color={
                    Colors.accentGreen
                  }
                />
              </View>

              <Text
                style={[
                  styles.cardValue,
                  {
                    color:
                      Colors.accentGreen,
                  },
                ]}
              >
                {vaccinesDone}
              </Text>
            </View>

            <Text style={styles.cardLabel}>
              Vacinas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                "Medications"
              )
            }
          >
            <View style={styles.cardTop}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      Colors.accentOrange +
                      "20",
                  },
                ]}
              >
                <Ionicons
                  name="medical"
                  size={22}
                  color={
                    Colors.accentOrange
                  }
                />
              </View>

              <Text
                style={[
                  styles.cardValue,
                  {
                    color:
                      Colors.accentOrange,
                  },
                ]}
              >
                {activeMeds}
              </Text>
            </View>

            <Text style={styles.cardLabel}>
              Medicamentos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                "HealthCalendar"
              )
            }
          >
            <View style={styles.cardTop}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      Colors.accentRed +
                      "20",
                  },
                ]}
              >
                <Ionicons
                  name="alert-circle"
                  size={22}
                  color={
                    Colors.accentRed
                  }
                />
              </View>

              <Text
                style={[
                  styles.cardValue,
                  {
                    color:
                      Colors.accentRed,
                  },
                ]}
              >
                {pendingVaccines}
              </Text>
            </View>

            <Text style={styles.cardLabel}>
              Pendências
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  content: {
    paddingBottom: 120,
  },

  topHeader: {
    height: 10,
  },

  banner: {
    marginHorizontal: 16,
    marginTop: 10,

    borderRadius: 20,

    padding: 18,

    backgroundColor:
      Colors.accentLight + "15",

    borderWidth: 1,

    borderColor:
      Colors.accentLight + "30",

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  bannerLeft: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",

    gap: 12,
  },

  bannerIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor:
      Colors.accentLight + "20",

    alignItems: "center",
    justifyContent: "center",
  },

  bannerText: {
    flex: 1,

    color: Colors.white,

    fontSize: 14,

    lineHeight: 20,

    fontWeight: "600",
  },

  chatButton: {
    width: 50,
    height: 50,

    borderRadius: 16,

    marginLeft: 14,

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

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent:
      "space-between",

    paddingHorizontal: 16,

    marginTop: 16,

    gap: 10,
  },

  card: {
    width: "48%",

    backgroundColor:
      Colors.secondary,

    borderRadius: 20,

    padding: 16,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.06)",
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent:
      "space-between",

    marginBottom: 12,
  },

  iconBox: {
    width: 46,
    height: 46,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",
  },

  cardValue: {
    fontSize: 26,
    fontWeight: "800",
  },

  cardLabel: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: "600",
  },
});