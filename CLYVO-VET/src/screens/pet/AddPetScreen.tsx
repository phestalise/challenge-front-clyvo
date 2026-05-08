import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

const SPECIES = ["Cachorro", "Gato", "Pássaro", "Coelho", "Outro"];

export default function AddPetScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert("Informe o nome do pet."); return; }
    if (!species) { Alert.alert("Selecione a espécie."); return; }

    setSaving(true);
    try {
      const existing = await storageService.getPets();
      const newPet = {
        id: Date.now().toString(),
        name: name.trim(),
        species,
        breed: breed.trim() || species,
        age: parseFloat(age) || 0,
        weight: parseFloat(weight) || 0,
        vaccines: [],
        medications: [],
        nextCheckup: "",
      };
      await storageService.savePets([...existing, newPet]);

      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch {
      Alert.alert("Erro ao salvar pet. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Novo Pet</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Ionicons
              name={species === "Gato" ? "happy" : species === "Pássaro" ? "sunny" : "paw"}
              size={40}
              color={Colors.accentLight}
            />
          </View>
          <Text style={styles.avatarHint}>
            {name.trim() ? name : "Novo pet"}
          </Text>
        </View>

        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Thor, Luna..."
          placeholderTextColor={Colors.textLight}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Espécie *</Text>
        <View style={styles.chipRow}>
          {SPECIES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, species === s && styles.chipSelected]}
              onPress={() => setSpecies(s)}
            >
              <Text style={[styles.chipText, species === s && styles.chipTextSelected]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Raça</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Labrador, Persa..."
          placeholderTextColor={Colors.textLight}
          value={breed}
          onChangeText={setBreed}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Idade (anos)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 3"
              placeholderTextColor={Colors.textLight}
              value={age}
              onChangeText={setAge}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 12.5"
              placeholderTextColor={Colors.textLight}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
          <Text style={styles.saveBtnText}>
            {saving ? "Salvando..." : "Finalizar e ir para Início"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    backgroundColor: Colors.secondary,
  },
  back: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 18, fontWeight: "700", color: Colors.white },
  content: { padding: 20, paddingBottom: 60 },
  avatarArea: { alignItems: "center", marginBottom: 28, gap: 10 },
  avatar: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.accentLight + "20",
    alignItems: "center", justifyContent: "center",
  },
  avatarHint: { fontSize: 18, fontWeight: "700", color: Colors.white },
  label: { fontSize: 13, color: Colors.textLight, marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: Colors.secondary, borderRadius: 12, padding: 14,
    color: Colors.white, fontSize: 15,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  row: { flexDirection: "row" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
    backgroundColor: Colors.secondary,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },
  chipSelected: { backgroundColor: Colors.accentLight, borderColor: Colors.accentLight },
  chipText: { color: Colors.textLight, fontSize: 14, fontWeight: "600" },
  chipTextSelected: { color: Colors.white },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, backgroundColor: Colors.accentLight,
    borderRadius: 14, paddingVertical: 16, marginTop: 32,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});