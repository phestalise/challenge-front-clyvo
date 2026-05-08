import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

export default function PendingScreen() {
  const navigation = useNavigation<any>();
  const [pets, setPets] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => setPets(await storageService.getPets());
  useFocusEffect(useCallback(() => { load(); }, []));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const pending = pets.flatMap((pet) =>
    (pet.vaccines ?? [])
      .filter((v: any) => !v.done)
      .map((v: any) => ({ ...v, petName: pet.name, type: "Vacina" }))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Pendências</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accentLight} />}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {pending.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle" size={56} color={Colors.accentGreen + "60"} />
            <Text style={styles.emptyTitle}>Tudo em dia! 🎉</Text>
            <Text style={styles.emptyText}>Nenhuma vacina pendente</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate("Vaccines")}>
              <Text style={styles.emptyBtnText}>Ver vacinas</Text>
            </TouchableOpacity>
          </View>
        ) : (
          pending.map((item, i) => (
            <View key={i} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: Colors.accentRed + "20" }]}>
                <Ionicons name="time" size={22} color={Colors.accentRed} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>Pet: {item.petName} · {item.type}</Text>
                {item.nextDue ? <Text style={styles.itemDate}>Prevista: {item.nextDue}</Text> : null}
              </View>
              <TouchableOpacity
                style={styles.resolveBtn}
                onPress={() => navigation.navigate("Vaccines")}
              >
                <Text style={styles.resolveBtnText}>Resolver</Text>
              </TouchableOpacity>
            </View>
          ))
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
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "700", color: Colors.white },
  card: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Colors.secondary, borderRadius: 14, padding: 14 },
  iconBox: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  itemName: { fontSize: 15, fontWeight: "600", color: Colors.white },
  itemSub: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  itemDate: { fontSize: 12, color: Colors.accentRed + "cc", marginTop: 2 },
  resolveBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: Colors.accentRed + "20" },
  resolveBtnText: { color: Colors.accentRed, fontSize: 12, fontWeight: "700" },
  empty: { alignItems: "center", paddingTop: 100, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: Colors.white },
  emptyText: { color: Colors.textLight, fontSize: 14 },
  emptyBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.accentGreen, borderRadius: 12 },
  emptyBtnText: { color: Colors.white, fontWeight: "700" },
});