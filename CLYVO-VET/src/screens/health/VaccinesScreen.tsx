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

import { Colors, alpha } from "../../styles/colors";
import { RootStackParamList } from "../../types";

import { useVaccines } from "../../hooks/useVaccines";

import { styles } from "../../styles/VaccinesScreen.styles";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "Vaccines">;

export default function VaccinesScreen() {
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

  const handleAdd = async () => {
    if (!selectedPetId) {
      showAlert("Atenção", "Selecione o pet para a vacina.");
      return;
    }

    if (!vaccineName.trim()) {
      showAlert("Atenção", "Informe o nome da vacina.");
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

    setModalVisible(false);

    setVaccineName("");
    setVaccineDate("");
    setVaccineNextDue("");
    setSelectedPetId("");
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
      <View style={styles.orb} pointerEvents="none" />

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

        <View style={styles.headerActions}>
          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>Vacinas</Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
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

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nova Vacina</Text>

            <Text style={styles.inputLabel}>Pet</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                marginBottom: 12,
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
                    onPress={() => setSelectedPetId(p.id)}
                  >
                    <Text
                      style={[
                        styles.petChipText,

                        selectedPetId === p.id && {
                          color: Colors.white,
                        },
                      ]}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.inputLabel}>Nome da vacina</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: V10, Antirrábica..."
              placeholderTextColor={Colors.textLight}
              value={vaccineName}
              onChangeText={setVaccineName}
            />

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

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleAdd}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.saveText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
