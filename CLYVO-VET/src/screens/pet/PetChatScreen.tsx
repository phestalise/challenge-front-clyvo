// PetChatScreen.tsx

import React, { useRef, useState } from "react";

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

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { alpha } from "../../styles/colors";
import { useTheme } from "../../theme";
import { RootStackParamList } from "../../types";
import { usePets } from "../../hooks/usePets";
import { useChatHistory } from "../../hooks/useChatHistory";
import { buildAssistantReply } from "../../utils/assistant";

import { usePetChatScreenStyles } from "../../styles/PetChatScreen.styles";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PetChatScreen() {
  const styles = usePetChatScreenStyles();
  const { colors: Colors } = useTheme();
  const navigation = useNavigation<Nav>();

  const { pets } = usePets();
  const { messages, addMessage, clearHistory } = useChatHistory();

  const [input, setInput] = useState("");

  const [sending, setSending] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const question = input.trim();

    await addMessage({
      role: "user",
      content: question,
    });

    setInput("");

    setSending(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    try {
      await addMessage({
        role: "assistant",
        content: buildAssistantReply(question, pets),
      });
    } catch (error) {
      console.log(error);

      await addMessage({
        role: "assistant",
        content: "Erro ao processar mensagem.",
      });
    } finally {
      setSending(false);

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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Chat</Text>

          <Text style={styles.headerSub}>Assistente Clyvo</Text>
        </View>

        <TouchableOpacity style={styles.avatar} onPress={clearHistory}>
          <Ionicons name="trash-outline" size={18} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.welcome}>
            <Ionicons name="sparkles" size={42} color={Colors.accentLight} />

            <Text style={styles.welcomeTitle}>Assistente Clyvo</Text>

            <Text style={styles.welcomeText}>
              Pergunte sobre vacinas, medicamentos, retornos e pendências dos
              seus pets.
            </Text>
          </View>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === "user";

          return (
            <View
              key={index}
              style={[
                styles.msgRow,
                isUser ? styles.msgRowUser : styles.msgRowAi,
              ]}
            >
              <View style={isUser ? styles.msgBubbleUser : styles.msgBubbleAi}>
                <Text style={isUser ? styles.msgTextUser : styles.msgTextAi}>
                  {msg.content}
                </Text>
              </View>
            </View>
          );
        })}

        {sending && (
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color={Colors.accentLight} />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={Colors.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={18} color={Colors.onAccent} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
