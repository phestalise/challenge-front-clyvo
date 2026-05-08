import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  vaccines: any[];
  medications: any[];
};

const CHAT_KEY = "@clyvo:chat_history";

export default function PetChatScreen() {
  const navigation = useNavigation<any>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [pets, setPets] = useState<Pet[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const savedPets = await storageService.getPets();
      setPets(savedPets || []);

      const savedMessages = await storageService.getData(CHAT_KEY);

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveHistory = async (msgs: Message[]) => {
    try {
      await storageService.saveData(
        CHAT_KEY,
        JSON.stringify(msgs)
      );
    } catch {}
  };

  const clearHistory = async () => {
    setMessages([]);
    await storageService.saveData(
      CHAT_KEY,
      JSON.stringify([])
    );
  };

  const addPet = async () => {
    if (
      !petName.trim() ||
      !petSpecies.trim() ||
      !petBreed.trim() ||
      !petAge.trim()
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos."
      );
      return;
    }

    const newPet: Pet = {
      id: Date.now().toString(),
      name: petName.trim(),
      species: petSpecies.trim(),
      breed: petBreed.trim(),
      age: Number(petAge),
      vaccines: [],
      medications: [],
    };

    try {
      const updatedPets = [...pets, newPet];

      await storageService.savePets(updatedPets);

      setPets(updatedPets);

      setModalVisible(false);

      setPetName("");
      setPetSpecies("");
      setPetBreed("");
      setPetAge("");

      Alert.alert(
        "Sucesso",
        "Pet cadastrado com sucesso!"
      );

      const systemMessage: Message = {
        role: "assistant",
        content: `🐾 ${newPet.name} foi cadastrado com sucesso!`,
      };

      const updatedMessages = [
        ...messages,
        systemMessage,
      ];

      setMessages(updatedMessages);

      await saveHistory(updatedMessages);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível cadastrar o pet."
      );
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
    };

    const updated = [...messages, userMsg];

    setMessages(updated);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    try {
      const petsInfo =
        pets.length > 0
          ? pets
              .map(
                (p) =>
                  `${p.name} (${p.species}, ${p.breed}, ${p.age} anos)`
              )
              .join(", ")
          : "Nenhum pet cadastrado";

      const fakeAIResponse: Message = {
        role: "assistant",
        content: `🐶 Pets cadastrados: ${petsInfo}\n\nComo posso ajudar você hoje?`,
      };

      const finalMessages = [
        ...updated,
        fakeAIResponse,
      ];

      setMessages(finalMessages);

      await saveHistory(finalMessages);
    } catch (error) {
      console.log(error);

      const errorMessages = [
        ...updated,
        {
          role: "assistant" as const,
          content:
            "Erro ao processar mensagem.",
        },
      ];

      setMessages(errorMessages);

      await saveHistory(errorMessages);
    } finally {
      setLoading(false);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={Colors.white}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            Chat IA
          </Text>

          <Text style={styles.subtitle}>
            Assistente Pet
          </Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={clearHistory}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={Colors.textLight}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.addPetBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="paw"
            size={18}
            color={Colors.white}
          />

          <Text style={styles.addPetText}>
            Cadastrar Pet
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.welcome}>
            <Ionicons
              name="sparkles"
              size={40}
              color={Colors.accentLight}
            />

            <Text style={styles.welcomeTitle}>
              Olá 👋
            </Text>

            <Text style={styles.welcomeText}>
              Cadastre pets e converse com a IA.
            </Text>
          </View>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === "user";

          return (
            <View
              key={index}
              style={[
                styles.row,
                isUser
                  ? styles.rowUser
                  : styles.rowAI,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isUser
                    ? styles.bubbleUser
                    : styles.bubbleAI,
                ]}
              >
                <Text style={styles.bubbleText}>
                  {msg.content}
                </Text>
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator
              size="small"
              color={Colors.accentLight}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={
            Colors.textLight
          }
          value={input}
          onChangeText={setInput}
          multiline
        />

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={sendMessage}
        >
          <Ionicons
            name="send"
            size={18}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Novo Pet
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nome"
              placeholderTextColor={
                Colors.textLight
              }
              value={petName}
              onChangeText={setPetName}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Espécie"
              placeholderTextColor={
                Colors.textLight
              }
              value={petSpecies}
              onChangeText={setPetSpecies}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Raça"
              placeholderTextColor={
                Colors.textLight
              }
              value={petBreed}
              onChangeText={setPetBreed}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Idade"
              placeholderTextColor={
                Colors.textLight
              }
              keyboardType="numeric"
              value={petAge}
              onChangeText={setPetAge}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={addPet}
            >
              <Text style={styles.saveBtnText}>
                Salvar Pet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() =>
                setModalVisible(false)
              }
            >
              <Text style={styles.cancelBtnText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: Colors.secondary,
  },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor:
      "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    alignItems: "center",
  },

  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    color: Colors.textLight,
    fontSize: 12,
    marginTop: 2,
  },

  topActions: {
    padding: 16,
  },

  addPetBtn: {
    backgroundColor: Colors.accentLight,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  addPetText: {
    color: Colors.white,
    fontWeight: "700",
  },

  messages: {
    padding: 16,
    gap: 12,
    paddingBottom: 30,
  },

  welcome: {
    alignItems: "center",
    marginTop: 50,
    gap: 12,
  },

  welcomeTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "700",
  },

  welcomeText: {
    color: Colors.textLight,
    fontSize: 14,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
  },

  rowUser: {
    justifyContent: "flex-end",
  },

  rowAI: {
    justifyContent: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 16,
  },

  bubbleUser: {
    backgroundColor: Colors.accentLight,
  },

  bubbleAI: {
    backgroundColor: Colors.secondary,
  },

  bubbleText: {
    color: Colors.white,
    fontSize: 14,
    lineHeight: 20,
  },

  loadingBox: {
    marginTop: 10,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    padding: 16,
    paddingBottom: 30,
    backgroundColor: Colors.secondary,
  },

  input: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.white,
    maxHeight: 100,
  },

  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },

  modalInput: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.white,
    marginBottom: 12,
  },

  saveBtn: {
    backgroundColor: Colors.accentLight,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  saveBtnText: {
    color: Colors.white,
    fontWeight: "700",
  },

  cancelBtn: {
    marginTop: 12,
    alignItems: "center",
  },

  cancelBtnText: {
    color: Colors.textLight,
  },
});