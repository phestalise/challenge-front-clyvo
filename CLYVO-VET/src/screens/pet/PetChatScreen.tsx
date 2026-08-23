// PetChatScreen.tsx

import React, {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
import { usePets } from "../../hooks/usePets";

import { styles } from "../../styles/PetChatScreen.styles";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_KEY = "@clyvo:chat_history";

export default function PetChatScreen() {
  const navigation = useNavigation<any>();

  const { pets } = usePets();

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const scrollRef =
    useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const savedMessages =
        await storageService.getData(
          CHAT_KEY
        );

      if (savedMessages) {
        setMessages(
          JSON.parse(savedMessages)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveHistory = async (
    msgs: Message[]
  ) => {
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
    if (!input.trim() || loading)
      return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
    };

    const updated = [
      ...messages,
      userMsg,
    ];

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

      const fakeAIResponse: Message =
        {
          role: "assistant",
          content: `🐾 Pets: ${petsInfo}`,
        };

      const finalMessages = [
        ...updated,
        fakeAIResponse,
      ];

      setMessages(finalMessages);

      await saveHistory(
        finalMessages
      );
    } catch (error) {
      console.log(error);

      const errorMessages = [
        ...updated,
        {
          role:
            "assistant" as const,
          content:
            "Erro ao processar mensagem.",
        },
      ];

      setMessages(errorMessages);

      await saveHistory(
        errorMessages
      );
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
      style={styles.safe}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={Colors.white}
          />
        </TouchableOpacity>

        <View
          style={styles.headerInfo}
        >
          <Text
            style={styles.headerTitle}
          >
            Chat
          </Text>

          <Text
            style={styles.headerSub}
          >
            Assistente Clyvo
          </Text>
        </View>

        <TouchableOpacity
          style={styles.avatar}
          onPress={clearHistory}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={
          styles.messagesList
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {messages.length === 0 && (
          <View style={styles.welcome}>
            <Ionicons
              name="sparkles"
              size={42}
              color={
                Colors.accentLight
              }
            />

            <Text
              style={
                styles.welcomeTitle
              }
            >
              Assistente Clyvo
            </Text>

            <Text
              style={
                styles.welcomeText
              }
            >
              Converse com o
              assistente do app.
            </Text>
          </View>
        )}

        {messages.map(
          (msg, index) => {
            const isUser =
              msg.role === "user";

            return (
              <View
                key={index}
                style={[
                  styles.msgRow,
                  isUser
                    ? styles.msgRowUser
                    : styles.msgRowAi,
                ]}
              >
                <View
                  style={
                    isUser
                      ? styles.msgBubbleUser
                      : styles.msgBubbleAi
                  }
                >
                  <Text
                    style={
                      isUser
                        ? styles.msgTextUser
                        : styles.msgTextAi
                    }
                  >
                    {msg.content}
                  </Text>
                </View>
              </View>
            );
          }
        )}

        {loading && (
          <View
            style={
              styles.typingBubble
            }
          >
            <ActivityIndicator
              size="small"
              color={
                Colors.accentLight
              }
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <View
          style={styles.inputWrap}
        >
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={
              Colors.textSecondary
            }
            value={input}
            onChangeText={setInput}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[
            styles.sendBtn,
            !input.trim() &&
              styles.sendBtnDisabled,
          ]}
          onPress={sendMessage}
          disabled={!input.trim()}
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