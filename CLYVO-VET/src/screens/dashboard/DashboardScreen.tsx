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

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors, alpha } from "../../styles/colors";
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

  const hasPets = pets.length > 0;

  const statCards: {
    key: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    value: number;
    label: string;
    color: string;
    onPress: () => void;
    animated?: boolean;
  }[] = [
    {
      key: "pets",
      icon: "paw-outline",
      value: pets.length,
      label: "Pets",
      color: Colors.accentOnDark,
      onPress: () => navigation.navigate("Pets"),
      animated: true,
    },
    {
      key: "vaccines",
      icon: "shield-check-outline",
      value: vaccinesDone,
      label: "Vacinas",
      color: Colors.successOnDark,
      onPress: () => navigation.navigate("Vaccines"),
    },
    {
      key: "meds",
      icon: "pill",
      value: activeMeds,
      label: "Medicamentos",
      color: Colors.warningOnDark,
      onPress: () => navigation.navigate("Medications"),
    },
    {
      key: "pending",
      icon: "alert-circle-outline",
      value: pendingVaccines,
      label: "Pendências",
      color: Colors.dangerOnDark,
      onPress: () => navigation.navigate("HealthCalendar"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.orbTop} pointerEvents="none" />
      <View style={styles.orbBottom} pointerEvents="none" />

      <MaterialCommunityIcons
        name="paw-outline"
        size={130}
        color={alpha(Colors.white, 0.04)}
        style={styles.pawWatermarkTop}
      />

      <MaterialCommunityIcons
        name="paw-outline"
        size={90}
        color={alpha(Colors.white, 0.04)}
        style={styles.pawWatermarkBottom}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          !hasPets && styles.contentCentered,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accentLight}
          />
        }
      >
        <View style={styles.topHeader} />

        {hasPets ? (
          <>
            <Text style={styles.sectionTitle}>Visão geral</Text>

            <View style={styles.statsGrid}>
              {statCards.map((item) => {
                const hasValue = item.value > 0;

                const icon = (
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={18}
                    color={item.color}
                  />
                );

                const iconChip = (
                  <View
                    style={[
                      styles.cardIconChip,
                      { backgroundColor: alpha(item.color, 0.15) },
                    ]}
                  >
                    {icon}
                  </View>
                );

                return (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.card}
                    onPress={item.onPress}
                  >
                    {hasValue ? (
                      <>
                        <View style={styles.cardTop}>
                          {item.animated ? (
                            <Animated.View
                              style={[
                                styles.cardIconChip,
                                { backgroundColor: alpha(item.color, 0.15) },
                                bounceStyle,
                              ]}
                            >
                              {icon}
                            </Animated.View>
                          ) : (
                            iconChip
                          )}

                          <Text style={styles.cardValue}>{item.value}</Text>
                        </View>

                        <Text style={styles.cardLabel}>{item.label}</Text>
                      </>
                    ) : (
                      <View style={styles.cardEmpty}>
                        {iconChip}

                        <Text style={styles.cardLabel}>{item.label}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyBadge}>
              <View style={styles.emptyBadgeDot} />

              <Text style={styles.emptyBadgeText}>Comece por aqui</Text>
            </View>

            <View style={styles.emptyLogo}>
              <MaterialCommunityIcons
                name="paw-outline"
                size={36}
                color={Colors.accentOnDark}
              />
            </View>

            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>

            <Text style={styles.emptySubtitle}>
              Cadastre seu primeiro pet para acompanhar vacinas, medicamentos e
              consultas por aqui.
            </Text>

            <TouchableOpacity
              style={styles.emptyCta}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("AddPet")}
            >
              <Text style={styles.emptyCtaText}>
                Cadastrar meu primeiro pet
              </Text>

              <View style={styles.emptyCtaArrow}>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={16}
                  color={Colors.white}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.chatFab}
        onPress={() => navigation.navigate("PetChat")}
      >
        <MaterialCommunityIcons
          name="creation-outline"
          size={24}
          color={Colors.white}
        />
      </TouchableOpacity>
    </View>
  );
}
