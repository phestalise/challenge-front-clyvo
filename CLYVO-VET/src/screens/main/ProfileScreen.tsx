import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

const FAQ_DATA = [
  {
    q: "Como adicionar um pet?",
    a: 'Vá em "Meus Pets" e toque no botão +.',
  },
  {
    q: "Como registrar uma vacina?",
    a: 'Acesse "Vacinas" no dashboard.',
  },
  {
    q: "O Chat IA salva o histórico?",
    a: "Sim! O histórico é salvo automaticamente.",
  },
  {
    q: "Como agendar consulta?",
    a: 'Use o "Calendário" ou peça ao Chat IA.',
  },
  {
    q: "Como editar perfil?",
    a: 'Toque em "Editar perfil".',
  },
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
    try {
      const [u, p] = await Promise.all([
        storageService.getUser(),
        storageService.getPets(),
      ]);

      setUser(u);
      setPets(Array.isArray(p) ? p : []);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const openEdit = () => {
    setEditName(user?.name ?? "");
    setEditEmail(user?.email ?? "");
    setEditModal(true);
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      Alert.alert("Atenção", "Informe seu nome.");
      return;
    }

    try {
      const updated = {
        ...user,
        name: editName.trim(),
        email: editEmail.trim(),
      };

      await storageService.saveUser(updated);

      setUser(updated);

      setEditModal(false);

      Alert.alert("Sucesso", "Perfil atualizado.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja sair da conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await storageService.setLoggedIn(false);

              navigation.reset({
                index: 0,
                routes: [{ name: "Welcome" }],
              });
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };

  const initials = (name: string) => {
    if (!name) return "?";

    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>

        <TouchableOpacity
          onPress={openEdit}
          style={styles.editBtn}
        >
          <Ionicons
            name="pencil"
            size={18}
            color={Colors.accentLight}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initials(user?.name ?? "")}
            </Text>
          </View>

          <Text style={styles.name}>
            {user?.name ?? "Usuário"}
          </Text>

          <Text style={styles.email}>
            {user?.email ?? ""}
          </Text>

          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={openEdit}
          >
            <Text style={styles.editProfileText}>
              Editar perfil
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>
              {pets.length}
            </Text>

            <Text style={styles.statLbl}>
              Pets
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statVal}>
              {
                pets
                  .flatMap((p) => p.vaccines ?? [])
                  .filter((v: any) => v.done).length
              }
            </Text>

            <Text style={styles.statLbl}>
              Vacinas
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statVal}>
              {
                pets
                  .flatMap((p) => p.medications ?? [])
                  .filter((m: any) => m.active).length
              }
            </Text>

            <Text style={styles.statLbl}>
              Medicamentos
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            FAQ
          </Text>

          {FAQ_DATA.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.faqItem}
              activeOpacity={0.8}
              onPress={() =>
                setOpenFaq(openFaq === i ? null : i)
              }
            >
              <View style={styles.faqRow}>
                <Text style={styles.faqQ}>
                  {item.q}
                </Text>

                <Ionicons
                  size={18}
                  color={Colors.textLight}
                  name={
                    openFaq === i
                      ? "chevron-up"
                      : "chevron-down"
                  }
                />
              </View>

              {openFaq === i && (
                <Text style={styles.faqA}>
                  {item.a}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={Colors.accentRed}
            />

            <Text style={styles.logoutText}>
              Sair da conta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={editModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Editar perfil
            </Text>

            <Text style={styles.inputLabel}>
              Nome
            </Text>

            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Seu nome"
              placeholderTextColor={Colors.textLight}
            />

            <Text style={styles.inputLabel}>
              E-mail
            </Text>

            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="email@email.com"
              placeholderTextColor={Colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModal(false)}
              >
                <Text style={{ color: Colors.textLight }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={saveEdit}
              >
                <Text style={{ color: Colors.white }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.secondary,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
  },

  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accentLight + "20",
  },

  profileCard: {
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingVertical: 28,
    marginBottom: 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accentLight + "30",
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.accentLight,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
  },

  email: {
    fontSize: 14,
    marginTop: 4,
    color: Colors.textLight,
  },

  editProfileBtn: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accentLight + "50",
  },

  editProfileText: {
    color: Colors.accentLight,
    fontSize: 13,
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.secondary,
  },

  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },

  statVal: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
  },

  statLbl: {
    fontSize: 11,
    marginTop: 2,
    color: Colors.textLight,
  },

  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 11,
    marginBottom: 10,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
  },

  faqItem: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.secondary,
  },

  faqRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  faqQ: {
    flex: 1,
    marginRight: 8,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },

  faqA: {
    fontSize: 13,
    marginTop: 10,
    lineHeight: 20,
    color: Colors.textLight,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.accentRed + "15",
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.accentRed,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  modalBox: {
    padding: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.secondary,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.white,
  },

  inputLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 6,
    color: Colors.textLight,
  },

  input: {
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    color: Colors.white,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  modalBtns: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },

  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: Colors.accentLight,
  },
});