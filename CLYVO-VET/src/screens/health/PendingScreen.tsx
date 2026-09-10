// PendingScreen.tsx

import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { Colors, alpha } from "../../styles/colors";
import { RootStackParamList } from "../../types";
import { usePets } from "../../hooks/usePets";

import { styles } from "../../styles/PendingScreen.styles";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PendingScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const { pets, loading, error, reload } = usePets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await reload();

    setRefreshing(false);
  };

  const pending = pets.flatMap((pet) =>
    (pet.vaccines ?? [])
      .filter((v: any) => !v.done)
      .map((v: any) => ({
        ...v,
        petName: pet.name,
        type: "Vacina",
      })),
  );

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
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <Ionicons name="paw" size={16} color={Colors.accentLight} />

            <Text style={styles.logo}>CLYVO</Text>
          </View>
        </View>

        <View style={styles.pageBadge}>
          <Text style={styles.pageBadgeText}>Pendências</Text>
        </View>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accentLight}
            />
          }
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {error && <Text style={styles.emptyText}>{error}</Text>}

          {pending.length > 0 && (
            <Text style={styles.sectionLabel}>
              {pending.length} pendente{pending.length > 1 ? "s" : ""}
            </Text>
          )}

          {pending.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="checkmark-circle"
                  size={44}
                  color={Colors.accentGreen}
                />
              </View>

              <Text style={styles.emptyTitle}>Tudo em dia!</Text>

              <Text style={styles.emptyText}>Nenhuma vacina pendente</Text>

              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate("Vaccines")}
              >
                <Text style={styles.emptyBtnText}>Ver vacinas</Text>
              </TouchableOpacity>
            </View>
          ) : (
            pending.map((item, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.iconChip}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={Colors.accentOrange}
                  />
                </View>

                <View style={styles.info}>
                  <Text style={styles.itemName}>{item.name}</Text>

                  <Text style={styles.itemSub}>
                    {item.petName} · {item.type}
                  </Text>

                  {item.endDate ? (
                    <Text style={styles.itemDate}>
                      Prevista: {item.endDate}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={styles.resolveBtn}
                  onPress={() => navigation.navigate("Vaccines")}
                >
                  <Text style={styles.resolveBtnText}>Resolver</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
