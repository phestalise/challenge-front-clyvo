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

import { useVaccines } from "../../hooks/useVaccines";

import { useVaccinesScreenStyles } from "../../styles/VaccinesScreen.styles";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "Vaccines">;

export default function VaccinesScreen() {
  const styles = useVaccinesScreenStyles();
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
    addVaccine,
    toggleDone,
    removeVaccine,
  } = useVaccines();

  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedPetId, setSelectedPetId] = useState("");

  const [vaccineName, setVaccineName] = useState("");

  const [vaccineDate, setVaccineDate] = useState("");

  const [vaccineNextDue, setVaccineNextDue] = useState("");

  const [errors, setErrors] = useState<{ pet?: string; name?: string }>({});

  const allVaccines = pets.flatMap((p) => p.vaccines ?? []);

  React.useEffect(() => {
    if (route.params?.date) {
      setVaccineDate(route.params.date);
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
    setVaccineName("");
    setVaccineDate("");
    setVaccineNextDue("");
    setSelectedPetId("");
  };

  const handleAdd = async () => {
    const newErrors: { pet?: string; name?: string } = {};

    if (!selectedPetId) newErrors.pet = "Selecione o pet para a vacina.";
    if (!vaccineName.trim()) newErrors.name = "Informe o nome da vacina.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const ok = await addVaccine(selectedPetId, {
      name: vaccineName.trim(),
      startDate: vaccineDate,
      endDate: vaccineNextDue,
    });

    if (!ok) {
      showAlert(
        "Erro ao salvar",
        "Não foi possível salvar a vacina. Tente novamente.",
      );
      return;
    }

    closeModal();
  };

  const handleToggleDone = async (petId: string, vaccineId: string) => {
    const ok = await toggleDone(petId, vaccineId);

    if (!ok) {
      showAlert(
        "Erro",
        "Não foi possível atualizar a vacina. Tente novamente.",
      );
    }
  };

  const handleDelete = async (petId: string, vaccineId: string) => {
    showAlert("Remover vacina", "Deseja remover esta vacina?", [
      {
        text: "Cancelar",
        style: "cancel",
      },

      {
        text: "Remover",

        style: "destructive",

        onPress: async () => {
          const ok = await removeVaccine(petId, vaccineId);

          if (!ok) {
            showAlert(
              "Erro ao remover",
              "Não foi possível remover a vacina. Tente novamente.",
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
            <Text style={styles.pageBadgeText}>Vacinas</Text>
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

          {allVaccines.length > 0 && (
            <Text style={styles.sectionLabel}>
              {allVaccines.length} vacina{allVaccines.length > 1 ? "s" : ""}
            </Text>
          )}

          {pets.flatMap((pet) =>
            (pet.vaccines ?? []).map((v) => {
              const statusColor = v.done
                ? Colors.accentGreen
                : Colors.accentOrange;

              return (
                <View key={v.id} style={styles.card}>
                  <View
                    style={[
                      styles.iconChip,
                      { backgroundColor: alpha(statusColor, 0.15) },
                    ]}
                  >
                    <Ionicons
                      name={v.done ? "shield-checkmark" : "shield-half-outline"}
                      size={18}
                      color={statusColor}
                    />
                  </View>

                  <View style={styles.flexOne}>
                    <Text style={styles.vacName}>{v.name}</Text>

                    <Text style={styles.vacSub}>{pet.name}</Text>

                    {v.startDate ? (
                      <Text style={styles.vacDate}>
                        Aplicada: {v.startDate}
                      </Text>
                    ) : null}

                    {v.endDate ? (
                      <Text style={styles.vacDate}>Próxima: {v.endDate}</Text>
                    ) : null}
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => handleToggleDone(pet.id, v.id)}
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
                          {v.done ? "Aplicada" : "Pendente"}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(pet.id, v.id)}
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

          {allVaccines.length === 0 && (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="shield-checkmark"
                  size={44}
                  color={Colors.accentGreen}
                />
              </View>

              <Text style={styles.emptyTitle}>Nenhuma vacina cadastrada</Text>

              <Text style={styles.emptyText}>
                Registre as vacinas do seu pet aqui
              </Text>

              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyBtnText}>Adicionar vacina</Text>
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
              <Text style={styles.pageBadgeText}>Nova Vacina</Text>
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
              style={{
                marginBottom: 4,
              }}
            >
              <View style={styles.petRow}>
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

                        selectedPetId === p.id && {
                          color: Colors.onAccent,
                        },
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

            <Text style={styles.inputLabel}>Nome da vacina *</Text>

            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Ex: V10, Antirrábica..."
              placeholderTextColor={Colors.textLight}
              value={vaccineName}
              onChangeText={(v) => {
                setVaccineName(v);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <Text style={styles.inputLabel}>Data de aplicação</Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textLight}
              value={vaccineDate}
              onChangeText={setVaccineDate}
            />

            <Text style={styles.inputLabel}>Próxima dose</Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textLight}
              value={vaccineNextDue}
              onChangeText={setVaccineNextDue}
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

              <Text style={styles.saveText}>
                {saving ? "Salvando..." : "Salvar Vacina"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
