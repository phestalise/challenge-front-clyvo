import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";

import { storageService } from "../../services/StorageService";

export default function PetsScreen() {
  const navigation = useNavigation<any>();

  const [pets, setPets] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [])
  );

  const loadPets = async () => {
    const data = await storageService.getPets();
    setPets(data || []);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Meus Pets
        </Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            navigation.navigate("AddPet")
          }
        >
          <Ionicons
            name="add"
            size={24}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {pets.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="paw"
              size={60}
              color={Colors.textSecondary}
            />

            <Text style={styles.emptyText}>
              Nenhum pet cadastrado
            </Text>

            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() =>
                navigation.navigate("AddPet")
              }
            >
              <Text style={styles.emptyBtnText}>
                Cadastrar Pet
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate(
                  "PetDetail",
                  {
                    petId: pet.id,
                  }
                )
              }
            >
              <View style={styles.avatar}>
                <Ionicons
                  name={
                    pet.species === "Gato"
                      ? "happy"
                      : "paw"
                  }
                  size={28}
                  color={Colors.accentLight}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.petName}>
                  {pet.name}
                </Text>

                <Text style={styles.petMeta}>
                  {pet.species} • {pet.breed}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          ))
        )}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.secondary,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.white,
  },

  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 16,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor:
      Colors.accentLight + "20",
    justifyContent: "center",
    alignItems: "center",
  },

  petName: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.white,
  },

  petMeta: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 3,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },

  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },

  emptyBtn: {
    marginTop: 20,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },

  emptyBtnText: {
    color: Colors.white,
    fontWeight: "700",
  },
});