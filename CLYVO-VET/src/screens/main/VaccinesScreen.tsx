import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";

import { showAlert } from "../../utils/showAlert";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";

import { storageService } from "../../services/StorageService";

import { obterCorStatus } from "../../utils/formatters";

import { styles } from "../../styles/VaccinesScreenStyles";

export default function VaccinesScreen() {
  const navigation = useNavigation<any>();

  const [pets, setPets] = useState<any[]>([]);

  const [refreshing, setRefreshing] =
    useState(false);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [selectedPetId, setSelectedPetId] =
    useState("");

  const [vaccineName, setVaccineName] =
    useState("");

  const [vaccineDate, setVaccineDate] =
    useState("");

  const [vaccineNextDue, setVaccineNextDue] =
    useState("");

  const load = async () => {
    const p = await storageService.getPets();

    setPets(p);
  };

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

  const handleAdd = async () => {
    if (!selectedPetId || !vaccineName) {
      showAlert(
        "Preencha o nome da vacina e selecione o pet."
      );

      return;
    }

    const allPets =
      await storageService.getPets();

    const updated = allPets.map(
      (p: any) => {
        if (p.id !== selectedPetId)
          return p;

        const vaccines =
          p.vaccines ?? [];

        vaccines.push({
          id: Date.now().toString(),
          name: vaccineName,
          date: vaccineDate,
          nextDue: vaccineNextDue,
          done: !!vaccineDate,
        });

        return { ...p, vaccines };
      }
    );

    await storageService.savePets(
      updated
    );

    setModalVisible(false);

    setVaccineName("");
    setVaccineDate("");
    setVaccineNextDue("");
    setSelectedPetId("");

    load();
  };

  const toggleDone = async (
    petId: string,
    vaccineId: string
  ) => {
    const allPets =
      await storageService.getPets();

    const updated = allPets.map(
      (p: any) => {
        if (p.id !== petId) return p;

        return {
          ...p,

          vaccines: (
            p.vaccines ?? []
          ).map((v: any) =>
            v.id === vaccineId
              ? {
                  ...v,
                  done: !v.done,
                }
              : v
          ),
        };
      }
    );

    await storageService.savePets(
      updated
    );

    load();
  };

  const handleDelete = async (
    petId: string,
    vaccineId: string
  ) => {
    showAlert(
      "Remover vacina",
      "Deseja remover esta vacina?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Remover",

          style: "destructive",

          onPress: async () => {
            const allPets =
              await storageService.getPets();

            const updated =
              allPets.map((p: any) => {
                if (p.id !== petId)
                  return p;

                return {
                  ...p,

                  vaccines: (
                    p.vaccines ?? []
                  ).filter(
                    (v: any) =>
                      v.id !== vaccineId
                  ),
                };
              });

            await storageService.savePets(
              updated
            );

            load();
          },
        },
      ]
    );
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
          Vacinas
        </Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            setModalVisible(true)
          }
        >
          <Ionicons
            name="add"
            size={22}
            color={Colors.white}
          />
        </TouchableOpacity>
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
        {pets.flatMap((pet) =>
          (pet.vaccines ?? []).map(
            (v: any) => {
              const cor =
                obterCorStatus(
                  v.done
                    ? "done"
                    : "pendente"
                );

              return (
                <View
                  key={v.id}
                  style={styles.card}
                >
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor:
                          cor + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        v.done
                          ? "checkmark-circle"
                          : "time"
                      }
                      size={22}
                      color={cor}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.vacName
                      }
                    >
                      {v.name}
                    </Text>

                    <Text
                      style={
                        styles.vacSub
                      }
                    >
                      Pet: {pet.name}
                    </Text>

                    {v.date ? (
                      <Text
                        style={
                          styles.vacDate
                        }
                      >
                        Aplicada:{" "}
                        {v.date}
                      </Text>
                    ) : null}

                    {v.nextDue ? (
                      <Text
                        style={
                          styles.vacDate
                        }
                      >
                        Próxima:{" "}
                        {v.nextDue}
                      </Text>
                    ) : null}
                  </View>

                  <View
                    style={
                      styles.actions
                    }
                  >
                    <TouchableOpacity
                      onPress={() =>
                        toggleDone(
                          pet.id,
                          v.id
                        )
                      }
                      style={
                        styles.actionBtn
                      }
                    >
                      <Ionicons
                        name={
                          v.done
                            ? "close-circle"
                            : "checkmark-circle"
                        }
                        size={20}
                        color={
                          v.done
                            ? Colors.textLight
                            : Colors.accentGreen
                        }
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        handleDelete(
                          pet.id,
                          v.id
                        )
                      }
                      style={
                        styles.actionBtn
                      }
                    >
                      <Ionicons
                        name="trash"
                        size={18}
                        color={
                          Colors.accentRed
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
          )
        )}

        {pets.flatMap(
          (p) => p.vaccines ?? []
        ).length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="shield-checkmark"
              size={48}
              color={
                Colors.accentGreen +
                "40"
              }
            />

            <Text
              style={styles.emptyText}
            >
              Nenhuma vacina cadastrada
            </Text>

            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() =>
                setModalVisible(true)
              }
            >
              <Text
                style={
                  styles.emptyBtnText
                }
              >
                Adicionar vacina
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text
              style={styles.modalTitle}
            >
              Nova Vacina
            </Text>

            <Text
              style={styles.inputLabel}
            >
              Pet
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              style={{
                marginBottom: 12,
              }}
            >
              <View
                style={styles.petRow}
              >
                {pets.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.petChip,

                      selectedPetId ===
                        p.id &&
                        styles.petChipSelected,
                    ]}
                    onPress={() =>
                      setSelectedPetId(
                        p.id
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.petChipText,

                        selectedPetId ===
                          p.id && {
                          color:
                            Colors.white,
                        },
                      ]}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text
              style={styles.inputLabel}
            >
              Nome da vacina
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: V10, Antirrábica..."
              placeholderTextColor={
                Colors.textLight
              }
              value={vaccineName}
              onChangeText={
                setVaccineName
              }
            />

            <Text
              style={styles.inputLabel}
            >
              Data de aplicação
            </Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={
                Colors.textLight
              }
              value={vaccineDate}
              onChangeText={
                setVaccineDate
              }
            />

            <Text
              style={styles.inputLabel}
            >
              Próxima dose
            </Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={
                Colors.textLight
              }
              value={vaccineNextDue}
              onChangeText={
                setVaccineNextDue
              }
            />

            <View
              style={styles.modalBtns}
            >
              <TouchableOpacity
                style={
                  styles.cancelBtn
                }
                onPress={() =>
                  setModalVisible(false)
                }
              >
                <Text
                  style={
                    styles.cancelText
                  }
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleAdd}
              >
                <Text
                  style={styles.saveText}
                >
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}