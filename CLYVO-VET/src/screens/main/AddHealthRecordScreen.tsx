import React, { useCallback, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

export default function AddHealthRecordScreen() {
  const navigation = useNavigation<any>();
  const [pets, setPets] = useState<any[]>([]);
  const [type, setType] = useState<"vaccine" | "medication">("vaccine");

  useFocusEffect(
    useCallback(() => {
      storageService.getPets().then(setPets);
    }, [])
  );

  const options = [
    {
      key: "vaccine" as const,
      label: "Vacina",
      icon: "shield-checkmark",
      color: Colors.accentGreen,
      desc: "Registrar aplicação ou agendar próxima dose",
      route: "Vaccines",
    },
    {
      key: "medication" as const,
      label: "Medicamento",
      icon: "medical",
      color: Colors.accentOrange,
      desc: "Adicionar medicamento em uso ou tratamento",
      route: "Medications",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Saúde</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>O que deseja registrar?</Text>
        <View style={styles.typeRow}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.typeCard, type === opt.key && { borderColor: opt.color, borderWidth: 2 }]}
              onPress={() => {
                setType(opt.key);
                navigation.navigate(opt.route as any);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.typeIcon, { backgroundColor: opt.color + "20" }]}>
                <Ionicons name={opt.icon as any} size={26} color={opt.color} />
              </View>
              <Text style={styles.typeLabel}>{opt.label}</Text>
              <Text style={styles.typeDesc}>{opt.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: 28 }]}>Selecionar pet</Text>
        {pets.length === 0 ? (
          <View style={styles.emptyPets}>
            <Text style={styles.emptyText}>Nenhum pet cadastrado.</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AddPet" as any)}>
              <Text style={styles.linkText}>Cadastrar pet →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.petList}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petRow}
                onPress={() => navigation.navigate("PetDetail" as any, { petId: pet.id })}
                activeOpacity={0.8}
              >
                <View style={styles.petAvatar}>
                  <Ionicons name="paw" size={20} color={Colors.accentLight} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petMeta}>{pet.species} · {pet.breed}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  title: { fontSize: 18, fontWeight: "700", color: Colors.white },
  content: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 13, color: Colors.textLight, marginBottom: 12, letterSpacing: 0.4 },
  typeRow: { flexDirection: "row", gap: 12 },
  typeCard: {
    flex: 1, backgroundColor: Colors.secondary, borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.08)", gap: 8,
  },
  typeIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  typeLabel: { fontSize: 15, fontWeight: "700", color: Colors.white },
  typeDesc: { fontSize: 12, color: Colors.textLight, lineHeight: 16 },
  petList: { gap: 10 },
  petRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.secondary, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  petAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accentLight + "20",
    alignItems: "center", justifyContent: "center",
  },
  petName: { fontSize: 15, fontWeight: "600", color: Colors.white },
  petMeta: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  emptyPets: { alignItems: "center", paddingVertical: 32, gap: 10 },
  emptyText: { color: Colors.textLight, fontSize: 14 },
  linkText: { color: Colors.accentLight, fontSize: 14, fontWeight: "600" },
});