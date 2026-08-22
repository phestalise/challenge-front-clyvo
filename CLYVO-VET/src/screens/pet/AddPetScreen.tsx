import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { showAlert } from "../../utils/showAlert";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

import { styles } from "../../styles/AddPetScreenStyles";

const SPECIES = [
  "Cachorro",
  "Gato",
  "Pássaro",
  "Coelho",
  "Outro",
];

export default function AddPetScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert(
        "Atenção",
        "Informe o nome do pet."
      );

      return;
    }

    if (!species) {
      showAlert(
        "Atenção",
        "Selecione a espécie."
      );

      return;
    }

    setSaving(true);

    try {
      const existing =
        await storageService.getPets();

      const newPet = {
        id: Date.now().toString(),
        name: name.trim(),
        species,
        breed:
          breed.trim() || species,
        age: parseFloat(age) || 0,
        weight:
          parseFloat(weight) || 0,
        vaccines: [],
        medications: [],
        nextCheckup: "",
        createdAt:
          new Date().toISOString(),
      };

      await storageService.savePets([
        ...existing,
        newPet,
      ]);

      navigation.goBack();
    } catch {
      showAlert(
        "Erro",
        "Erro ao salvar pet. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

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
          Novo Pet
        </Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Ionicons
              name={
                species === "Gato"
                  ? "happy"
                  : species ===
                      "Pássaro"
                    ? "sunny"
                    : "paw"
              }
              size={40}
              color={
                Colors.accentLight
              }
            />
          </View>

          <Text style={styles.avatarHint}>
            {name.trim()
              ? name
              : "Novo pet"}
          </Text>
        </View>

        <Text style={styles.label}>
          Nome *
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Thor, Luna..."
          placeholderTextColor={
            Colors.textLight
          }
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>
          Espécie *
        </Text>

        <View style={styles.chipRow}>
          {SPECIES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.chip,
                species === s &&
                  styles.chipSelected,
              ]}
              onPress={() =>
                setSpecies(s)
              }
            >
              <Text
                style={[
                  styles.chipText,
                  species === s &&
                    styles.chipTextSelected,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>
          Raça
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Labrador, Persa..."
          placeholderTextColor={
            Colors.textLight
          }
          value={breed}
          onChangeText={setBreed}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>
              Idade (anos)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 3"
              placeholderTextColor={
                Colors.textLight
              }
              value={age}
              onChangeText={setAge}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={{ width: 12 }} />

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>
              Peso (kg)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 12.5"
              placeholderTextColor={
                Colors.textLight
              }
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveBtn,
            saving &&
              styles.saveBtnDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={Colors.white}
          />

          <Text style={styles.saveBtnText}>
            {saving
              ? "Salvando..."
              : "Salvar Pet"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}