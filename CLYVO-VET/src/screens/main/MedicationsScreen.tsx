// MedicationsScreen.tsx

import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";

import { styles } from "../../styles/MedicationsScreenStyles";

import { storageService } from "../../services/StorageService";

export default function MedicationsScreen() {
  const navigation = useNavigation<any>();

  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] =
    useState(false);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [selectedPetId, setSelectedPetId] =
    useState("");

  const [medName, setMedName] =
    useState("");

  const [dosage, setDosage] =
    useState("");

  const [frequency, setFrequency] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const load = async () =>
    setPets(
      await storageService.getPets()
    );

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
    if (
      !selectedPetId ||
      !medName
    ) {
      Alert.alert(
        "Selecione o pet e informe o nome do medicamento."
      );

      return;
    }

    const allPets =
      await storageService.getPets();

    const updated = allPets.map(
      (p: any) => {
        if (
          p.id !== selectedPetId
        ) {
          return p;
        }

        const medications =
          p.medications ?? [];

        medications.push({
          id: Date.now().toString(),
          name: medName,
          dosage,
          frequency,
          endDate,
          active: true,
        });

        return {
          ...p,
          medications,
        };
      }
    );

    await storageService.savePets(
      updated
    );

    setModalVisible(false);

    setMedName("");
    setDosage("");
    setFrequency("");
    setEndDate("");
    setSelectedPetId("");

    load();
  };

  const toggleActive = async (
    petId: string,
    medId: string
  ) => {
    const allPets =
      await storageService.getPets();

    const updated = allPets.map(
      (p: any) => {
        if (p.id !== petId) {
          return p;
        }

        return {
          ...p,
          medications: (
            p.medications ?? []
          ).map((m: any) =>
            m.id === medId
              ? {
                  ...m,
                  active:
                    !m.active,
                }
              : m
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
    medId: string
  ) => {
    Alert.alert(
      "Remover medicamento",
      "Deseja remover?",
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
              allPets.map(
                (p: any) => {
                  if (
                    p.id !== petId
                  ) {
                    return p;
                  }

                  return {
                    ...p,
                    medications:
                      (
                        p.medications ??
                        []
                      ).filter(
                        (m: any) =>
                          m.id !==
                          medId
                      ),
                  };
                }
              );

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
          Medicamentos
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
            refreshing={
              refreshing
            }
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
          (
            pet.medications ?? []
          ).map((m: any) => {
            const color =
              m.active
                ? Colors.accentOrange
                : Colors.textLight;

            return (
              <View
                key={m.id}
                style={styles.card}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor:
                        Colors.accentOrange +
                        "20",
                    },
                  ]}
                >
                  <Ionicons
                    name="medical"
                    size={22}
                    color={
                      Colors.accentOrange
                    }
                  />
                </View>

                <View
                  style={styles.flexOne}
                >
                  <Text
                    style={
                      styles.medName
                    }
                  >
                    {m.name}
                  </Text>

                  <Text
                    style={
                      styles.medSub
                    }
                  >
                    Pet: {pet.name} ·{" "}
                    {m.dosage}
                  </Text>

                  <Text
                    style={
                      styles.medSub
                    }
                  >
                    {m.frequency}
                    {m.endDate
                      ? ` · até ${m.endDate}`
                      : ""}
                  </Text>
                </View>

                <View
                  style={
                    styles.actions
                  }
                >
                  <TouchableOpacity
                    onPress={() =>
                      toggleActive(
                        pet.id,
                        m.id
                      )
                    }
                    style={
                      styles.actionBtn
                    }
                  >
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor:
                            color,
                        },
                      ]}
                    >
                      <Text
                        style={
                          styles.badgeText
                        }
                      >
                        {m.active
                          ? "Ativo"
                          : "Fim"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      handleDelete(
                        pet.id,
                        m.id
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
          })
        )}

        {pets.flatMap(
          (p) =>
            p.medications ?? []
        ).length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="medical"
              size={48}
              color={
                Colors.accentOrange +
                "40"
              }
            />

            <Text
              style={
                styles.emptyText
              }
            >
              Nenhum medicamento
              cadastrado
            </Text>

            <TouchableOpacity
              style={
                styles.emptyBtn
              }
              onPress={() =>
                setModalVisible(true)
              }
            >
              <Text
                style={
                  styles.emptyBtnText
                }
              >
                Adicionar
                medicamento
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
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={styles.modalBox}
          >
            <Text
              style={
                styles.modalTitle
              }
            >
              Novo Medicamento
            </Text>

            <Text
              style={
                styles.inputLabel
              }
            >
              Pet
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              style={
                styles.petScroll
              }
            >
              <View
                style={
                  styles.petScrollRow
                }
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
                          p.id &&
                          styles.petChipTextSelected,
                      ]}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text
              style={
                styles.inputLabel
              }
            >
              Nome do medicamento
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Simparic, Bravecto..."
              placeholderTextColor={
                Colors.textLight
              }
              value={medName}
              onChangeText={
                setMedName
              }
            />

            <Text
              style={
                styles.inputLabel
              }
            >
              Dosagem
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 1 comprimido"
              placeholderTextColor={
                Colors.textLight
              }
              value={dosage}
              onChangeText={
                setDosage
              }
            />

            <Text
              style={
                styles.inputLabel
              }
            >
              Frequência
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 1x ao dia"
              placeholderTextColor={
                Colors.textLight
              }
              value={frequency}
              onChangeText={
                setFrequency
              }
            />

            <Text
              style={
                styles.inputLabel
              }
            >
              Data de término
            </Text>

            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={
                Colors.textLight
              }
              value={endDate}
              onChangeText={
                setEndDate
              }
            />

            <View
              style={
                styles.modalBtns
              }
            >
              <TouchableOpacity
                style={
                  styles.cancelBtn
                }
                onPress={() =>
                  setModalVisible(
                    false
                  )
                }
              >
                <Text
                  style={
                    styles.cancelBtnText
                  }
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.saveBtn
                }
                onPress={handleAdd}
              >
                <Text
                  style={
                    styles.saveBtnText
                  }
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