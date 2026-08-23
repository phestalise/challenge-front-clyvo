import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";

import { usePets } from "../../hooks/usePets";

import { styles } from "../../styles/AddHealthRecordScreen.styles";

export default function AddHealthRecordScreen() {
  const navigation = useNavigation<any>();

  const { pets, loading, error } = usePets();

  const [type, setType] = useState<
    "vaccine" | "medication"
  >("vaccine");

  const options = [
    {
      key: "vaccine" as const,

      label: "Vacina",

      icon: "shield-checkmark",

      color:
        Colors.accentGreen,

      desc:
        "Registrar aplicação ou agendar próxima dose",

      route: "Vaccines",
    },

    {
      key: "medication" as const,

      label: "Medicamento",

      icon: "medical",

      color:
        Colors.accentOrange,

      desc:
        "Adicionar medicamento em uso ou tratamento",

      route: "Medications",
    },
  ];

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
          Saúde
        </Text>

        <View
          style={styles.headerSpacer}
        />
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text style={styles.label}>
          O que deseja registrar?
        </Text>

        <View style={styles.typeRow}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.typeCard,

                type === opt.key && {
                  borderColor:
                    opt.color,

                  borderWidth: 2,
                },
              ]}
              onPress={() => {
                setType(opt.key);

                navigation.navigate(
                  opt.route as any
                );
              }}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.typeIcon,

                  {
                    backgroundColor:
                      opt.color + "20",
                  },
                ]}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={26}
                  color={opt.color}
                />
              </View>

              <Text
                style={
                  styles.typeLabel
                }
              >
                {opt.label}
              </Text>

              <Text
                style={
                  styles.typeDesc
                }
              >
                {opt.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.label,
            styles.petLabel,
          ]}
        >
          Selecionar pet
        </Text>

        {loading && pets.length === 0 ? (
          <ActivityIndicator
            size="small"
            color={Colors.accentLight}
          />
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : pets.length === 0 ? (
          <View
            style={
              styles.emptyPets
            }
          >
            <Text
              style={
                styles.emptyText
              }
            >
              Nenhum pet
              cadastrado.
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "AddPet" as any
                )
              }
            >
              <Text
                style={
                  styles.linkText
                }
              >
                Cadastrar pet →
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.petList}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petRow}
                onPress={() =>
                  navigation.navigate(
                    "PetDetail" as any,
                    {
                      petId: pet.id,
                    }
                  )
                }
                activeOpacity={0.8}
              >
                <View
                  style={
                    styles.petAvatar
                  }
                >
                  <Ionicons
                    name="paw"
                    size={20}
                    color={
                      Colors.accentLight
                    }
                  />
                </View>

                <View
                  style={
                    styles.petInfo
                  }
                >
                  <Text
                    style={
                      styles.petName
                    }
                  >
                    {pet.name}
                  </Text>

                  <Text
                    style={
                      styles.petMeta
                    }
                  >
                    {pet.species} ·{" "}
                    {pet.breed}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    Colors.textLight
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}