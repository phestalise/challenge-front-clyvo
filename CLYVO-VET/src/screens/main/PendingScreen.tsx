// PendingScreen.tsx

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

import { styles } from "../../styles/PendingScreenStyles";

export default function PendingScreen() {
  const navigation = useNavigation<any>();

  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] =
    useState(false);

  const load = async () =>
    setPets(await storageService.getPets());

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

  const pending = pets.flatMap((pet) =>
    (pet.vaccines ?? [])
      .filter((v: any) => !v.done)
      .map((v: any) => ({
        ...v,
        petName: pet.name,
        type: "Vacina",
      }))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={styles.back}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={Colors.white}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Pendências
        </Text>

        <View
          style={styles.headerSpacer}
        />
      </View>

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
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {pending.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="checkmark-circle"
              size={56}
              color={
                Colors.accentGreen +
                "60"
              }
            />

            <Text
              style={styles.emptyTitle}
            >
              Tudo em dia! 🎉
            </Text>

            <Text
              style={styles.emptyText}
            >
              Nenhuma vacina
              pendente
            </Text>

            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() =>
                navigation.navigate(
                  "Vaccines"
                )
              }
            >
              <Text
                style={
                  styles.emptyBtnText
                }
              >
                Ver vacinas
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          pending.map((item, i) => (
            <View
              key={i}
              style={styles.card}
            >
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
                  name="time"
                  size={22}
                  color={
                    Colors.accentRed
                  }
                />
              </View>

              <View
                style={styles.info}
              >
                <Text
                  style={
                    styles.itemName
                  }
                >
                  {item.name}
                </Text>

                <Text
                  style={
                    styles.itemSub
                  }
                >
                  Pet:{" "}
                  {item.petName} ·{" "}
                  {item.type}
                </Text>

                {item.nextDue ? (
                  <Text
                    style={
                      styles.itemDate
                    }
                  >
                    Prevista:{" "}
                    {item.nextDue}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={
                  styles.resolveBtn
                }
                onPress={() =>
                  navigation.navigate(
                    "Vaccines"
                  )
                }
              >
                <Text
                  style={
                    styles.resolveBtnText
                  }
                >
                  Resolver
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}