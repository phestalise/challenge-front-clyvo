import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";
import { styles } from "../../styles/DashboardScreen.styles";
import { usePets } from "../../hooks/usePets";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

  const { pets, reload } = usePets();
  const [refreshing, setRefreshing] = useState(false);

  const bounceScale = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      bounceScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 700 }),
          withTiming(1, { duration: 700 }),
        ),
        -1,
      );
    }, []),
  );

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounceScale.value }],
  }));

  const onRefresh = async () => {
    setRefreshing(true);

    await reload();

    setRefreshing(false);
  };

  const allVaccines = pets.flatMap((p) => p.vaccines ?? []);

  const allMeds = pets.flatMap((p) => p.medications ?? []);

  const vaccinesDone = allVaccines.filter((v) => v.done).length;

  const pendingVaccines = allVaccines.filter((v) => !v.done).length;

  const activeMeds = allMeds.filter((m) => m.active).length;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accentLight}
          />
        }
      >
        <View style={styles.topHeader} />

        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <View style={styles.bannerIcon}>
              <Ionicons name="sparkles" size={22} color={Colors.accentLight} />
            </View>

            <Text style={styles.bannerText} numberOfLines={2}>
              {pets.length === 0
                ? "Cadastre seu primeiro pet"
                : `${pets.length} pet${pets.length > 1 ? "s" : ""} cadastrado${pets.length > 1 ? "s" : ""}`}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.chatButton}
            onPress={() => navigation.navigate("PetChat")}
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
            onPress={() => navigation.navigate("Pets")}
          >
            <View style={styles.cardTop}>
              <Animated.View style={bounceStyle}>
                <Ionicons
                  name="paw-outline"
                  size={20}
                  color={Colors.accentLight}
                />
              </Animated.View>

              <Text style={styles.cardValue}>{pets.length}</Text>
            </View>

            <Text style={styles.cardLabel}>Pets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Vaccines")}
          >
            <View style={styles.cardTop}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={Colors.accentLight}
              />

              <Text style={styles.cardValue}>{vaccinesDone}</Text>
            </View>

            <Text style={styles.cardLabel}>Vacinas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Medications")}
          >
            <View style={styles.cardTop}>
              <Ionicons
                name="medical-outline"
                size={20}
                color={Colors.accentLight}
              />

              <Text style={styles.cardValue}>{activeMeds}</Text>
            </View>

            <Text style={styles.cardLabel}>Medicamentos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("HealthCalendar")}
          >
            <View style={styles.cardTop}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={Colors.accentLight}
              />

              <Text style={styles.cardValue}>{pendingVaccines}</Text>
            </View>

            <Text style={styles.cardLabel}>Pendências</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
