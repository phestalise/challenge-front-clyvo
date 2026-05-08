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
import { primeiroNome } from "../../utils/formatters";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const bounceLoop = useRef<Animated.CompositeAnimation | null>(null);

  const startBounce = () => {
    bounceLoop.current?.stop();

    bounceLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.15,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: false,
        }),
      ])
    );

    bounceLoop.current.start();
  };

  const load = async () => {
    try {
      const [u, p] = await Promise.all([
        storageService.getUser(),
        storageService.getPets(),
      ]);

      setUser(u);
      setPets(Array.isArray(p) ? p : []);
    } catch (error) {
      console.log(error);
      setPets([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
      startBounce();

      return () => {
        bounceLoop.current?.stop();
      };
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // ✅ NAVEGAÇÃO CORRIGIDA
  const goToStack = (name: string, params?: object) => {
    navigation.navigate(name, params);
  };

  const goToTab = (name: string) => {
    navigation.navigate(name);
  };

  const allVaccines = pets.flatMap((p) => p.vaccines ?? []);
  const allMeds = pets.flatMap((p) => p.medications ?? []);

  const vaccinesDone = allVaccines.filter((v) => v.done).length;
  const medActive = allMeds.filter((m) => m.active).length;
  const pending = allVaccines.filter((v) => !v.done).length;

  const quickActions = [
    {
      icon: "add-circle",
      label: "Novo Pet",
      color: Colors.accentLight,
      onPress: () => goToStack("AddPet"),
    },
    {
      icon: "medkit",
      label: "Saúde",
      color: Colors.accentGreen,
      onPress: () => goToTab("Health"),
    },
    {
      icon: "calendar",
      label: "Calendário",
      color: Colors.accentOrange,
      onPress: () => goToStack("HealthCalendar"),
    },
    {
      icon: "chatbubble-ellipses",
      label: "Chat IA",
      color: "#9B59B6",
      onPress: () => goToStack("PetChat"),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accentLight}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Olá, {primeiroNome(user?.name ?? "")} 👋
            </Text>

            <Text style={styles.date}>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
          </View>

          <TouchableOpacity style={styles.notif}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.white}
            />

            {pending > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>

        <View style={styles.aiBanner}>
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={20}
              color={Colors.accentLight}
            />
          </View>

          <Text style={styles.aiText}>
            {pets.length === 0
              ? "Cadastre seu primeiro pet"
              : `${pets.length} pet${
                  pets.length > 1 ? "s" : ""
                } cadastrado${
                  pets.length > 1 ? "s" : ""
                }`}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {/* PETS */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => goToTab("Pets")}
          >
            <View style={styles.statTop}>
              <Animated.View
                style={[
                  styles.statIconBox,
                  {
                    backgroundColor: Colors.accentLight + "20",
                    transform: [{ scale: bounceAnim }],
                  },
                ]}
              >
                <Ionicons
                  name="paw"
                  size={20}
                  color={Colors.accentLight}
                />
              </Animated.View>

              <Text
                style={[
                  styles.statValue,
                  { color: Colors.accentLight },
                ]}
              >
                {pets.length}
              </Text>
            </View>

            <Text style={styles.statLabel}>Pets</Text>
          </TouchableOpacity>

          {/* VACINAS */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => goToStack("HealthCalendar")}
          >
            <View style={styles.statTop}>
              <View
                style={[
                  styles.statIconBox,
                  {
                    backgroundColor:
                      Colors.accentGreen + "20",
                  },
                ]}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={Colors.accentGreen}
                />
              </View>

              <Text
                style={[
                  styles.statValue,
                  { color: Colors.accentGreen },
                ]}
              >
                {vaccinesDone}
              </Text>
            </View>

            <Text style={styles.statLabel}>
              Vacinas OK
            </Text>
          </TouchableOpacity>

          {/* MEDICAMENTOS */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => goToStack("HealthCalendar")}
          >
            <View style={styles.statTop}>
              <View
                style={[
                  styles.statIconBox,
                  {
                    backgroundColor:
                      Colors.accentOrange + "20",
                  },
                ]}
              >
                <Ionicons
                  name="medical"
                  size={20}
                  color={Colors.accentOrange}
                />
              </View>

              <Text
                style={[
                  styles.statValue,
                  { color: Colors.accentOrange },
                ]}
              >
                {medActive}
              </Text>
            </View>

            <Text style={styles.statLabel}>
              Medicamentos
            </Text>
          </TouchableOpacity>

          {/* PENDÊNCIAS */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => goToStack("HealthCalendar")}
          >
            <View style={styles.statTop}>
              <View
                style={[
                  styles.statIconBox,
                  {
                    backgroundColor:
                      Colors.accentRed + "20",
                  },
                ]}
              >
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={Colors.accentRed}
                />
              </View>

              <Text
                style={[
                  styles.statValue,
                  { color: Colors.accentRed },
                ]}
              >
                {pending}
              </Text>
            </View>

            <Text style={styles.statLabel}>
              Pendências
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ações rápidas
          </Text>

          <View style={styles.actionsRow}>
            {quickActions.map((a, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickBtn}
                activeOpacity={0.8}
                onPress={a.onPress}
              >
                <View
                  style={[
                    styles.quickIcon,
                    {
                      backgroundColor: a.color + "20",
                    },
                  ]}
                >
                  <Ionicons
                    name={a.icon as any}
                    size={26}
                    color={a.color}
                  />
                </View>

                <Text style={styles.quickLabel}>
                  {a.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.secondary,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
  },

  date: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },

  notif: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentRed,
    position: "absolute",
    top: 6,
    right: 6,
  },

  aiBanner: {
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.accentLight + "15",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.accentLight + "30",
  },

  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accentLight + "20",
    alignItems: "center",
    justifyContent: "center",
  },

  aiText: {
    flex: 1,
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 18,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  statCard: {
    width: "47%",
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  statTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    fontSize: 26,
    fontWeight: "700",
  },

  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 8,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: "uppercase",
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  quickBtn: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  quickLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
});