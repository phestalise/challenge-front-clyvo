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

      const savedMessages =
        await storageService.getData(CHAT_KEY);

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
                  `${p.name} (${p.species})`
              )
              .join(", ")
          : "Nenhum pet cadastrado";

      const fakeAIResponse: Message = {
        role: "assistant",
        content: `🐾 Pets: ${petsInfo}`,
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
          <View style={styles.logoRow}>
            <Ionicons
              name="paw"
              size={15}
              color={Colors.accentLight}
            />

            <Text style={styles.logoText}>
              Clyvo
            </Text>
          </View>

          <Text style={styles.title}>
            Chat 
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

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.welcome}>
            <Ionicons
              name="sparkles"
              size={42}
              color={Colors.accentLight}
            />

            <Text style={styles.welcomeTitle}>
              Assistente Clyvo
            </Text>

            <Text style={styles.welcomeText}>
              Converse com a IA do app.
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

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },

  logoText: {
    color: Colors.accentLight,
    fontSize: 11,
    fontWeight: "700",
  },

  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },

  messages: {
    padding: 16,
    gap: 12,
    paddingBottom: 30,
  },

  welcome: {
    alignItems: "center",
    marginTop: 80,
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
});