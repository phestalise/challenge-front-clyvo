import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Pet } from "../../types";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import PetCard from "../../components/PetCard";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PetsScreen() {
  const navigation = useNavigation<Nav>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { storageService.getPets().then(setPets); }, []));
  const onRefresh = async () => { setRefreshing(true); await storageService.getPets().then(setPets); setRefreshing(false); };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Pets</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AddPet")}>
          <Ionicons name="add" size={20} color={Colors.primary} />
          <Text style={styles.addBtnText}>Novo pet</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accentLight} />} showsVerticalScrollIndicator={false}>
        {pets.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><Ionicons name="paw" size={52} color={Colors.accentLight} /></View>
            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptyDesc}>Adicione seu pet para acompanhar a saúde dele</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate("AddPet")}>
              <Text style={styles.emptyBtnText}>Cadastrar meu pet</Text>
            </TouchableOpacity>
          </View>
        ) : pets.map((pet) => <PetCard key={pet.id} pet={pet} onPress={(id) => navigation.navigate("PetDetail", { petId: id })} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", color: Colors.white },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.accentLight, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  addBtnText: { color: Colors.primary, fontSize: 13, fontWeight: "700" },
  scroll: { padding: 20, paddingBottom: 30 },
  empty: { alignItems: "center", paddingTop: 60, gap: 14 },
  emptyIcon: { width: 96, height: 96, borderRadius: 28, backgroundColor: Colors.accentLight + "15", justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: Colors.text },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: "center" },
  emptyBtn: { backgroundColor: Colors.accentLight, paddingHorizontal: 24, paddingVertical: 13, borderRadius: 12 },
  emptyBtnText: { color: Colors.primary, fontSize: 15, fontWeight: "700" },
});