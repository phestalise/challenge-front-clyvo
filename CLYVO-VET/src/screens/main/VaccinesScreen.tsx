import React, { useCallback, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, StyleSheet, Alert, Modal, TextInput,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import { obterCorStatus } from "../../utils/formatters";

export default function VaccinesScreen() {
  const navigation = useNavigation<any>();
  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [vaccineDate, setVaccineDate] = useState("");
  const [vaccineNextDue, setVaccineNextDue] = useState("");

  const load = async () => {
    const p = await storageService.getPets();
    setPets(p);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleAdd = async () => {
    if (!selectedPetId || !vaccineName) {
      Alert.alert("Preencha o nome da vacina e selecione o pet.");
      return;
    }
    const allPets = await storageService.getPets();
    const updated = allPets.map((p: any) => {
      if (p.id !== selectedPetId) return p;
      const vaccines = p.vaccines ?? [];
      vaccines.push({
        id: Date.now().toString(),
        name: vaccineName,
        date: vaccineDate,
        nextDue: vaccineNextDue,
        done: !!vaccineDate,
      });
      return { ...p, vaccines };
    });
    await storageService.savePets(updated);
    setModalVisible(false);
    setVaccineName(""); setVaccineDate(""); setVaccineNextDue(""); setSelectedPetId("");
    load();
  };

  const toggleDone = async (petId: string, vaccineId: string) => {
    const allPets = await storageService.getPets();
    const updated = allPets.map((p: any) => {
      if (p.id !== petId) return p;
      return {
        ...p,
        vaccines: (p.vaccines ?? []).map((v: any) =>
          v.id === vaccineId ? { ...v, done: !v.done } : v
        ),
      };
    });
    await storageService.savePets(updated);
    load();
  };

  const handleDelete = async (petId: string, vaccineId: string) => {
    Alert.alert("Remover vacina", "Deseja remover esta vacina?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover", style: "destructive", onPress: async () => {
          const allPets = await storageService.getPets();
          const updated = allPets.map((p: any) => {
            if (p.id !== petId) return p;
            return { ...p, vaccines: (p.vaccines ?? []).filter((v: any) => v.id !== vaccineId) };
          });
          await storageService.savePets(updated);
          load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Vacinas</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accentLight} />}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {pets.flatMap((pet) =>
          (pet.vaccines ?? []).map((v: any) => {
            const cor = obterCorStatus(v.done ? "done" : "pendente");
            return (
              <View key={v.id} style={styles.card}>
                <View style={[styles.iconBox, { backgroundColor: cor + "20" }]}>
                  <Ionicons name={v.done ? "checkmark-circle" : "time"} size={22} color={cor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vacName}>{v.name}</Text>
                  <Text style={styles.vacSub}>Pet: {pet.name}</Text>
                  {v.date ? <Text style={styles.vacDate}>Aplicada: {v.date}</Text> : null}
                  {v.nextDue ? <Text style={styles.vacDate}>Próxima: {v.nextDue}</Text> : null}
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => toggleDone(pet.id, v.id)} style={styles.actionBtn}>
                    <Ionicons name={v.done ? "close-circle" : "checkmark-circle"} size={20} color={v.done ? Colors.textLight : Colors.accentGreen} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(pet.id, v.id)} style={styles.actionBtn}>
                    <Ionicons name="trash" size={18} color={Colors.accentRed} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
        {pets.flatMap((p) => p.vaccines ?? []).length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="shield-checkmark" size={48} color={Colors.accentGreen + "40"} />
            <Text style={styles.emptyText}>Nenhuma vacina cadastrada</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.emptyBtnText}>Adicionar vacina</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nova Vacina</Text>
            <Text style={styles.inputLabel}>Pet</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {pets.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.petChip, selectedPetId === p.id && styles.petChipSelected]}
                    onPress={() => setSelectedPetId(p.id)}
                  >
                    <Text style={[styles.petChipText, selectedPetId === p.id && { color: Colors.white }]}>{p.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.inputLabel}>Nome da vacina</Text>
            <TextInput style={styles.input} placeholder="Ex: V10, Antirrábica..." placeholderTextColor={Colors.textLight} value={vaccineName} onChangeText={setVaccineName} />
            <Text style={styles.inputLabel}>Data de aplicação</Text>
            <TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor={Colors.textLight} value={vaccineDate} onChangeText={setVaccineDate} />
            <Text style={styles.inputLabel}>Próxima dose</Text>
            <TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor={Colors.textLight} value={vaccineNextDue} onChangeText={setVaccineNextDue} />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: Colors.textLight, fontWeight: "600" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={{ color: Colors.white, fontWeight: "700" }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "700", color: Colors.white },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.accentGreen + "30", alignItems: "center", justifyContent: "center" },
  card: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.secondary, borderRadius: 14, padding: 14,
  },
  iconBox: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  vacName: { fontSize: 15, fontWeight: "600", color: Colors.white },
  vacSub: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  vacDate: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 1 },
  actions: { flexDirection: "row", gap: 4 },
  actionBtn: { padding: 6 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { color: Colors.textLight, fontSize: 15, fontWeight: "600" },
  emptyBtn: { marginTop: 4, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.accentGreen, borderRadius: 12 },
  emptyBtnText: { color: Colors.white, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: Colors.secondary, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: Colors.white, marginBottom: 16 },
  inputLabel: { fontSize: 12, color: Colors.textLight, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: Colors.primary, borderRadius: 12, padding: 14,
    color: Colors.white, fontSize: 15, marginBottom: 4,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  petChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.primary, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  petChipSelected: { backgroundColor: Colors.accentGreen, borderColor: Colors.accentGreen },
  petChipText: { color: Colors.textLight, fontWeight: "600", fontSize: 13 },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: Colors.primary, alignItems: "center" },
  saveBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: Colors.accentGreen, alignItems: "center" },
});