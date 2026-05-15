import React, {
  useCallback,
  useState,
} from "react";

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
    a: 'Vá em "Pets" e toque no botão +.',
  },
  {
    q: "Como registrar vacina?",
    a: 'Acesse a área de "Saúde".',
  },
  {
    q: "O histórico do chat salva?",
    a: "Sim, automaticamente.",
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const [user, setUser] = useState<any>(null);

  const [editModal, setEditModal] =
    useState(false);

  const [editName, setEditName] =
    useState("");

  const [editEmail, setEditEmail] =
    useState("");

  const [openFaq, setOpenFaq] =
    useState<number | null>(null);

  const load = async () => {
    try {
      const u =
        await storageService.getUser();

      setUser(u);
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
    try {
      const updated = {
        ...user,
        name: editName,
        email: editEmail,
      };

      await storageService.saveUser(
        updated
      );

      setUser(updated);

      setEditModal(false);

      Alert.alert(
        "Sucesso",
        "Perfil atualizado."
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await storageService.setLoggedIn(
        false
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (error) {
      console.log(error);
    }
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
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initials(
                user?.name ?? ""
              )}
            </Text>
          </View>

          <Text style={styles.name}>
            {user?.name ?? "Usuário"}
          </Text>

          <Text style={styles.email}>
            {user?.email ?? ""}
          </Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={openEdit}
            activeOpacity={0.8}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={Colors.white}
            />

            <Text
              style={styles.editBtnText}
            >
              Editar perfil
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Perguntas rápidas
          </Text>

          {FAQ_DATA.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.faqItem}
              activeOpacity={0.8}
              onPress={() =>
                setOpenFaq(
                  openFaq === i
                    ? null
                    : i
                )
              }
            >
              <View style={styles.faqRow}>
                <Text style={styles.faqQ}>
                  {item.q}
                </Text>

                <Ionicons
                  name={
                    openFaq === i
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={18}
                  color={
                    Colors.textLight
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

        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#FF6B6B"
          />

          <Text style={styles.logoutText}>
            Sair da conta
          </Text>
        </TouchableOpacity>
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

            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nome"
              placeholderTextColor={
                Colors.textLight
              }
            />

            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="E-mail"
              placeholderTextColor={
                Colors.textLight
              }
              autoCapitalize="none"
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() =>
                  setEditModal(false)
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
                onPress={saveEdit}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  content: {
    padding: 16,
    paddingBottom: 140,
  },

  profileCard: {
    backgroundColor:
      Colors.secondary,

    borderRadius: 22,

    padding: 24,

    alignItems: "center",

    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,

    borderRadius: 45,

    backgroundColor:
      Colors.accentLight + "25",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 14,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.accentLight,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.white,
  },

  email: {
    fontSize: 14,
    marginTop: 4,
    color: Colors.textLight,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    marginTop: 18,

    paddingHorizontal: 18,
    paddingVertical: 12,

    borderRadius: 14,

    backgroundColor:
      Colors.accentLight,
  },

  editBtnText: {
    color: Colors.white,
    fontWeight: "700",
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",

    color:
      "rgba(255,255,255,0.45)",

    marginBottom: 12,

    textTransform: "uppercase",
  },

  faqItem: {
    backgroundColor:
      Colors.secondary,

    borderRadius: 16,

    padding: 16,

    marginBottom: 10,
  },

  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  faqQ: {
    flex: 1,

    fontSize: 14,
    fontWeight: "600",

    color: Colors.white,

    marginRight: 10,
  },

  faqA: {
    marginTop: 12,

    fontSize: 13,

    lineHeight: 20,

    color: Colors.textLight,
  },

  logoutBtn: {
    height: 58,

    borderRadius: 16,

    backgroundColor:
      "rgba(255,107,107,0.12)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    marginBottom: 40,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF6B6B",
  },

  modalOverlay: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor:
      "rgba(0,0,0,0.5)",
  },

  modalBox: {
    backgroundColor:
      Colors.secondary,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    padding: 24,
    paddingBottom: 40,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",

    color: Colors.white,

    marginBottom: 18,
  },

  input: {
    height: 54,

    borderRadius: 14,

    paddingHorizontal: 16,

    marginBottom: 14,

    color: Colors.white,

    backgroundColor:
      Colors.primary,
  },

  modalBtns: {
    flexDirection: "row",
    gap: 12,

    marginTop: 8,
  },

  cancelBtn: {
    flex: 1,

    height: 52,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      Colors.primary,
  },

  saveBtn: {
    flex: 1,

    height: 52,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      Colors.accentLight,
  },

  cancelText: {
    color: Colors.textLight,
    fontWeight: "600",
  },

  saveText: {
    color: Colors.white,
    fontWeight: "700",
  },
});