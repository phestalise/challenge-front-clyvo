import React, { useCallback, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Modal,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

const FAQ_DATA = [
  { q: "Como adicionar um pet?", a: 'Vá em "Meus Pets" e toque no botão + no canto superior direito.' },
  { q: "Como registrar uma vacina?", a: 'Acesse "Vacinas" no dashboard ou no menu Saúde e toque em +.' },
  { q: "O Chat IA salva o histórico?", a: "Sim! O histórico é salvo automaticamente no seu dispositivo." },
  { q: "Como agendar uma consulta?", a: 'Use o "Calendário" nas ações rápidas ou peça ao Chat IA para agendar.' },
  { q: "Como editar meu perfil?", a: 'Nesta tela, toque em "Editar perfil" para alterar seus dados.' },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const load = async () => {
    const [u, p] = await Promise.all([storageService.getUser(), storageService.getPets()]);
    setUser(u);
    setPets(p);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const openEdit = () => {
    setEditName(user?.name ?? "");
    setEditEmail(user?.email ?? "");
    setEditModal(true);
  };

  const saveEdit = async () => {
    if (!editName.trim()) { Alert.alert("Informe seu nome."); return; }
    const updated = { ...user, name: editName.trim(), email: editEmail.trim() };
    await storageService.saveUser(updated);
    setUser(updated);
    setEditModal(false);
  };

  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja fazer logout?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair", style: "destructive", onPress: async () => {
          await storageService.setLoggedIn(false);
          navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
        },
      },
    ]);
  };

  const initials = (name: string) =>
    name ? name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() : "?";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity onPress={openEdit} style={styles.editBtn}>
          <Ionicons name="pencil" size={18} color={Colors.accentLight} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user?.name ?? "")}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? "Usuário"}</Text>
          <Text style={styles.email}>{user?.email ?? ""}</Text>
          <TouchableOpacity style={styles.editProfileBtn} onPress={openEdit}>
            <Text style={styles.editProfileText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{pets.length}</Text>
            <Text style={styles.statLbl}>Pets</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{pets.flatMap((p) => p.vaccines ?? []).filter((v: any) => v.done).length}</Text>
            <Text style={styles.statLbl}>Vacinas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{pets.flatMap((p) => p.medications ?? []).filter((m: any) => m.active).length}</Text>
            <Text style={styles.statLbl}>Medicamentos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQ</Text>
          {FAQ_DATA.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.faqItem}
              onPress={() => setOpenFaq(openFaq === i ? null : i)}
              activeOpacity={0.8}
            >
              <View style={styles.faqRow}>
                <Text style={styles.faqQ}>{item.q}</Text>
                <Ionicons
                  name={openFaq === i ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={Colors.textLight}
                />
              </View>
              {openFaq === i && <Text style={styles.faqA}>{item.a}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.accentRed} />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar perfil</Text>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Seu nome"
              placeholderTextColor={Colors.textLight}
            />
            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="seu@email.com"
              placeholderTextColor={Colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModal(false)}>
                <Text style={{ color: Colors.textLight, fontWeight: "600" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
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
  title: { fontSize: 22, fontWeight: "700", color: Colors.white },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.accentLight + "20", alignItems: "center", justifyContent: "center" },
  profileCard: { alignItems: "center", paddingVertical: 28, backgroundColor: Colors.secondary, marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.accentLight + "30", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: "700", color: Colors.accentLight },
  name: { fontSize: 20, fontWeight: "700", color: Colors.white },
  email: { fontSize: 14, color: Colors.textLight, marginTop: 4 },
  editProfileBtn: { marginTop: 14, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.accentLight + "50" },
  editProfileText: { color: Colors.accentLight, fontSize: 13, fontWeight: "600" },
  statsRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 16, backgroundColor: Colors.secondary, borderRadius: 16, overflow: "hidden" },
  statBox: { flex: 1, alignItems: "center", paddingVertical: 16 },
  statVal: { fontSize: 22, fontWeight: "700", color: Colors.white },
  statLbl: { fontSize: 11, color: Colors.textLight, marginTop: 2 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, marginBottom: 10, textTransform: "uppercase" },
  faqItem: { backgroundColor: Colors.secondary, borderRadius: 12, padding: 14, marginBottom: 8 },
  faqRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  faqQ: { fontSize: 14, fontWeight: "600", color: Colors.white, flex: 1, marginRight: 8 },
  faqA: { fontSize: 13, color: Colors.textLight, marginTop: 10, lineHeight: 20 },
  logoutBtn: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: Colors.accentRed + "15", borderRadius: 14, padding: 16 },
  logoutText: { color: Colors.accentRed, fontSize: 15, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: Colors.secondary, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: Colors.white, marginBottom: 16 },
  inputLabel: { fontSize: 12, color: Colors.textLight, marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: Colors.primary, borderRadius: 12, padding: 14, color: Colors.white, fontSize: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: Colors.primary, alignItems: "center" },
  saveBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: Colors.accentLight, alignItems: "center" },
});