import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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

import { styles } from "../../styles/ProfileScreenStyles";

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
                  style={
                    styles.saveText
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