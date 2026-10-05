import React, { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { showAlert } from "../../utils/showAlert";

import { Ionicons } from "@expo/vector-icons";

import { ThemeMode, useTheme } from "../../theme";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errorMessage";

import { useProfileScreenStyles } from "../../styles/ProfileScreen.styles";

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
  {
    q: "Como funcionam os lembretes?",
    a: "Ao cadastrar uma vacina, um medicamento ou um retorno, o app avisa você um dia antes e no dia do vencimento. Toque na notificação para abrir a tela correspondente.",
  },
];

const THEME_OPTIONS: {
  mode: ThemeMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { mode: "light", label: "Claro", icon: "sunny-outline" },
  { mode: "dark", label: "Escuro", icon: "moon-outline" },
];

export default function ProfileScreen() {
  const styles = useProfileScreenStyles();
  const { colors: Colors, mode, setMode } = useTheme();
  const navigation = useNavigation<any>();
  const { user, logout, updateName, updateEmailAddress } = useAuth();

  const [editModal, setEditModal] = useState(false);

  const [editName, setEditName] = useState("");

  const [editEmail, setEditEmail] = useState("");

  const [saving, setSaving] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openEdit = () => {
    setEditName(user?.name ?? "");

    setEditEmail(user?.email ?? "");

    setEditModal(true);
  };

  const saveEdit = async () => {
    setSaving(true);

    try {
      if (editName.trim() && editName.trim() !== user?.name) {
        await updateName(editName.trim());
      }

      if (editEmail.trim() && editEmail.trim().toLowerCase() !== user?.email) {
        await updateEmailAddress(editEmail);
      }

      setEditModal(false);

      showAlert("Sucesso", "Perfil atualizado.");
    } catch (error) {
      showAlert("Erro", getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user?.name ?? "")}</Text>
          </View>

          <Text style={styles.name}>{user?.name ?? "Usuário"}</Text>

          <Text style={styles.email}>{user?.email ?? ""}</Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={openEdit}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color={Colors.accent} />

            <Text style={styles.editBtnText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>

          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((option) => {
              const active = mode === option.mode;

              return (
                <TouchableOpacity
                  key={option.mode}
                  style={[
                    styles.themeOption,
                    active && styles.themeOptionActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setMode(option.mode)}
                >
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={active ? Colors.accentOnDark : Colors.textLight}
                  />

                  <Text
                    style={[
                      styles.themeOptionText,
                      active && styles.themeOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perguntas rápidas</Text>

          {FAQ_DATA.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.faqItem}
              activeOpacity={0.8}
              onPress={() => setOpenFaq(openFaq === i ? null : i)}
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

        <TouchableOpacity
          style={[styles.aboutRow, styles.section]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("About")}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={Colors.accentOnDark}
          />

          <Text style={styles.aboutText}>Sobre o app</Text>

          <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={Colors.dangerOnDark}
          />

          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar perfil</Text>

            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nome"
              placeholderTextColor={Colors.textLight}
            />

            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="E-mail"
              placeholderTextColor={Colors.textLight}
              autoCapitalize="none"
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModal(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={saveEdit}
                disabled={saving}
              >
                <Text style={styles.saveText}>
                  {saving ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
