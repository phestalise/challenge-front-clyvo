import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import Svg, { Circle } from "react-native-svg";

import { Colors, alpha } from "../../styles/colors";
import { RootStackParamList } from "../../types";
import { petService } from "../../services/PetService";
import { calcularIdadeTexto } from "../../utils/formatters";
import { usePets } from "../../hooks/usePets";
import { blurActiveElement } from "../../utils/blurActiveElement";

import { styles } from "../../styles/PetsScreen.styles";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const RING_SIZE = 44;
const RING_STROKE = 3.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

export default function PetsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const { pets, loading, error, reload } = usePets();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await reload();

    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.orb} pointerEvents="none" />

      <Ionicons
        name="paw"
        size={110}
        color={alpha(Colors.white, 0.05)}
        style={styles.pawWatermark}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.headerEyebrow}>Meus pets</Text>

          <Text style={styles.headerCount}>
            {pets.length > 0
              ? `${pets.length} pet${pets.length > 1 ? "s" : ""} cadastrado${pets.length > 1 ? "s" : ""}`
              : "Nenhum pet ainda"}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addBtn}
          onPress={() => {
            blurActiveElement();
            navigation.navigate("AddPet");
          }}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {loading && pets.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.accentLight} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accentLight}
            />
          }
        >
          {error && <Text style={styles.emptyText}>{error}</Text>}

          {pets.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="paw"
                  size={52}
                  color={Colors.accentLight + "55"}
                />
              </View>

              <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>

              <Text style={styles.emptyText}>
                Cadastre seu primeiro pet para começar
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.emptyBtn}
                onPress={() => {
                  blurActiveElement();
                  navigation.navigate("AddPet");
                }}
              >
                <Text style={styles.emptyBtnText}>Cadastrar Pet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            pets.map((pet) => {
              const score = petService.getHealthScore(pet);

              const scoreColor =
                score >= 70
                  ? Colors.accentGreen
                  : score >= 40
                    ? Colors.accentOrange
                    : Colors.accentRed;

              const vaccinesDone = (pet.vaccines ?? []).filter(
                (item: any) => item.done,
              ).length;

              const vaccinesTotal = (pet.vaccines ?? []).length;

              const activeMedications = (pet.medications ?? []).filter(
                (item: any) => item.active,
              ).length;

              return (
                <TouchableOpacity
                  key={pet.id}
                  activeOpacity={0.85}
                  style={styles.card}
                  onPress={() => {
                    blurActiveElement();
                    navigation.navigate("PetDetail", {
                      petId: pet.id,
                    });
                  }}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.avatar}>
                      {pet.photoUri ? (
                        <Image
                          source={{ uri: pet.photoUri }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={styles.avatarInitial}>
                          {getInitial(pet.name)}
                        </Text>
                      )}
                    </View>

                    <View style={styles.cardInfo}>
                      <Text style={styles.petName} numberOfLines={1}>
                        {pet.name}
                      </Text>

                      <Text style={styles.petMeta} numberOfLines={1}>
                        {pet.species} · {pet.breed}
                      </Text>

                      <View style={styles.tagsRow}>
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>
                            {calcularIdadeTexto(pet.birthDate)}
                          </Text>
                        </View>

                        <View style={styles.tag}>
                          <Text style={styles.tagText}>{pet.weight} kg</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.ringWrap}>
                      <Svg width={RING_SIZE} height={RING_SIZE}>
                        <Circle
                          cx={RING_SIZE / 2}
                          cy={RING_SIZE / 2}
                          r={RING_RADIUS}
                          stroke={Colors.border}
                          strokeWidth={RING_STROKE}
                          fill="none"
                        />

                        <Circle
                          cx={RING_SIZE / 2}
                          cy={RING_SIZE / 2}
                          r={RING_RADIUS}
                          stroke={scoreColor}
                          strokeWidth={RING_STROKE}
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${RING_CIRCUMFERENCE}`}
                          strokeDashoffset={
                            RING_CIRCUMFERENCE * (1 - score / 100)
                          }
                          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                        />
                      </Svg>

                      <View style={styles.ringCenter}>
                        <Text style={[styles.ringText, { color: scoreColor }]}>
                          {score}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <Text style={styles.statsText}>
                    {vaccinesDone}/{vaccinesTotal} vacinas · {activeMedications}{" "}
                    medicamentos
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}
