// MedicationsScreen.tsx

import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { showAlert } from "../../utils/showAlert";

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { alpha } from "../../styles/colors";
import { useTheme } from "../../theme";
import { RootStackParamList } from "../../types";

import { useMedicationsScreenStyles } from "../../styles/MedicationsScreen.styles";

import { useMedications } from "../../hooks/useMedications";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "Medications">;

export default function MedicationsScreen() {
  const styles = useMedicationsScreenStyles();
  const { colors: Colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const {
    pets,
    loading,
    error,
    saving,
    reload,
    addMedication,
    toggleActive,
    removeMedication,
  } = useMedications();

  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedPetId, setSelectedPetId] = useState("");

  const [medName, setMedName] = useState("");

  const [dosage, setDosage] = useState("");

  const [frequency, setFrequency] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [errors, setErrors] = useState<{ pet?: string; name?: string }>({});

  const allMedications = pets.flatMap((p) => p.medications ?? []);

  React.useEffect(() => {
    if (route.params?.date) {
      setStartDate(route.params.date);
      setModalVisible(true);
    }
  }, [route.params?.date]);

  const onRefresh = async () => {
    setRefreshing(true);

    await reload();

    setRefreshing(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setErrors({});
    setMedName("");
    setDosage("");
    setFrequency("");
    setStartDate("");
    setEndDate("");
    setSelectedPetId("");
  };

  const handleAdd = async () => {
    const newErrors: { pet?: string; name?: string } = {};

    if (!selectedPetId) newErrors.pet = "Selecione o pet do medicamento.";
    if (!medName.trim()) newErrors.name = "Informe o nome do medicamento.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const ok = await addMedication(selectedPetId, {
      name: medName.trim(),
      dose: dosage,
      frequency,
      startDate,
      endDate,
    });

    if (!ok) {
      showAlert(
        "Erro ao salvar",
        "Não foi possível salvar o medicamento. Tente novamente.",
      );
      return;
    }

    closeModal();
  };

  const handleToggleActive = async (petId: string, medId: string) => {
    const ok = await toggleActive(petId, medId);

    if (!ok) {
      showAlert(
        "Erro",
        "Não foi possível atualizar o medicamento. Tente novamente.",
      );
    }
  };

  const handleDelete = async (petId: string, medId: string) => {
    showAlert("Remover medicamento", "Deseja remover?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Remover",
        style: "destructive",

        onPress: async () => {
          const ok = await removeMedication(petId, medId);

          if (!ok) {
            showAlert(
              "Erro ao remover",
              "Não foi possível remover o medicamento. Tente novamente.",
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBtn}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <Ionicons name="paw" size={16} color={Colors.accentLight} />

            <Text style={styles.logo}>CLYVO</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>Remédios</Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={20} color={Colors.onAccent} />
          </TouchableOpacity>
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

          {allMedications.length > 0 && (
            <Text style={styles.sectionLabel}>
              {allMedications.length} medicamento
              {allMedications.length > 1 ? "s" : ""}
            </Text>
          )}

          {pets.flatMap((pet) =>
            (pet.medications ?? []).map((m) => {
              const statusColor = m.active
                ? Colors.accentGreen
                : Colors.textSecondary;

              return (
                <View key={m.id} style={styles.card}>
                  <View
                    style={[
                      styles.iconChip,
                      { backgroundColor: alpha(statusColor, 0.15) },
                    ]}
                  >
                    <Ionicons name="medical" size={18} color={statusColor} />
                  </View>

                  <View style={styles.flexOne}>
                    <Text style={styles.medName}>{m.name}</Text>

                    <Text style={styles.medSub}>
                      {pet.name} · {m.dose}
                    </Text>

                    <Text style={styles.medSub}>
                      {m.frequency}
                      {m.endDate ? ` · até ${m.endDate}` : ""}
                    </Text>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => handleToggleActive(pet.id, m.id)}
                      style={styles.actionBtn}
                    >
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: alpha(statusColor, 0.15) },
                        ]}
                      >
                        <Text
                          style={[styles.badgeText, { color: statusColor }]}
                        >
                          {m.active ? "Ativo" : "Fim"}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(pet.id, m.id)}
                      style={styles.actionBtn}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={Colors.accentRed}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }),
          )}

          {allMedications.length === 0 && (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="medical"
                  size={44}
                  color={Colors.accentOrange}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Nenhum medicamento cadastrado
              </Text>

              <Text style={styles.emptyText}>
                Registre os remédios em uso do seu pet
              </Text>

              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyBtnText}>Adicionar medicamento</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.container}>
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={closeModal} style={styles.headerBtn}>
                <Ionicons name="close" size={20} color={Colors.text} />
              </TouchableOpacity>

              <View style={styles.logoRow}>
                <Ionicons name="paw" size={16} color={Colors.accentLight} />

                <Text style={styles.logo}>CLYVO</Text>
              </View>
            </View>

            <View style={styles.pageBadge}>
              <Text style={styles.pageBadgeText}>Novo Medicamento</Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.inputLabel}>Pet *</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.petScroll}
            >
              <View style={styles.petScrollRow}>
                {pets.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.petChip,
                      selectedPetId === p.id && styles.petChipSelected,
                    ]}
                    onPress={() => {
                      setSelectedPetId(p.id);
                      setErrors((prev) => ({ ...prev, pet: undefined }));
                    }}
                  >
                    <Text
                      style={[
                        styles.petChipText,
                        selectedPetId === p.id && styles.petChipTextSelected,
                      ]}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {errors.pet ? (
              <Text style={styles.errorText}>{errors.pet}</Text>
            ) : null}

            <Text style={styles.inputLabel}>Nome do medicamento *</Text>

            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Ex: Simparic, Bravecto..."
              placeholderTextColor={Colors.textLight}
              value={medName}
              onChangeText={(v) => {
                setMedName(v);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <Text style={styles.inputLabel}>Dosagem</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 1 comprimido"
              placeholderTextColor={Colors.textLight}
              value={dosage}
              onChangeText={setDosage}
            />

            <Text style={styles.inputLabel}>Frequência</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 1x ao dia"
              placeholderTextColor={Colors.textLight}
              value={frequency}
              onChangeText={setFrequency}
            />

            <Text style={styles.inputLabel}>Data de início</Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textLight}
              value={startDate}
              onChangeText={setStartDate}
            />

            <Text style={styles.inputLabel}>Data de término</Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textLight}
              value={endDate}
              onChangeText={setEndDate}
            />

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleAdd}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator size="small" color={Colors.onAccent} />
              ) : (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={Colors.onAccent}
                />
              )}

              <Text style={styles.saveBtnText}>
                {saving ? "Salvando..." : "Salvar Medicamento"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
