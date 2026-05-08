import React, { useCallback, useRef, useState } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_KEY = "petchat_history";

export default function PetChatScreen() {
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      storageService.getPets().then(setPets);
      storageService.getData(CHAT_KEY).then((saved) => {
        if (saved) {
          try {
            setMessages(JSON.parse(saved));
          } catch {
            setMessages([]);
          }
        }
      });
    }, [])
  );

  const saveHistory = async (msgs: Message[]) => {
    try {
      await storageService.saveData(CHAT_KEY, JSON.stringify(msgs));
    } catch {}
  };

  const clearHistory = async () => {
    setMessages([]);
    await storageService.saveData(CHAT_KEY, JSON.stringify([]));
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const petsInfo =
        pets.length > 0
          ? pets
              .map((p) => `${p.name} (${p.species}, ${p.breed}, ${p.age} anos)`)
              .join(", ")
          : "nenhum pet cadastrado ainda";

      const systemPrompt = `Você é um assistente veterinário virtual amigável especializado em cuidados com pets.
Os pets cadastrados são: ${petsInfo}.
Responda sempre em português brasileiro, seja gentil, claro e prático.
Quando o usuário perguntar sobre agendamento, consulta ou retorno veterinário, sugira usar o calendário do app e inclua exatamente ao final da sua resposta a tag: [AGENDAR]`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const rawText =
        data.content?.[0]?.text ?? "Desculpe, não consegui responder agora.";

      const hasSchedule = rawText.includes("[AGENDAR]");
      const cleanText = rawText.replace("[AGENDAR]", "").trim();

      const next: Message[] = [
        ...updated,
        { role: "assistant", content: cleanText },
      ];

      if (hasSchedule) {
        next.push({ role: "assistant", content: "__SCHEDULE_BTN__" });
      }

      setMessages(next);
      await saveHistory(next);
    } catch {
      const errMsgs: Message[] = [
        ...updated,
        { role: "assistant", content: "Erro ao conectar. Verifique sua conexão e tente novamente." },
      ];
      setMessages(errMsgs);
      await saveHistory(errMsgs);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Chat IA</Text>
          <Text style={styles.subtitle}>Assistente veterinário</Text>
        </View>
        <TouchableOpacity onPress={clearHistory} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.length === 0 && (
          <View style={styles.welcome}>
            <View style={styles.welcomeIcon}>
              <Ionicons name="sparkles" size={32} color={Colors.accentLight} />
            </View>
            <Text style={styles.welcomeTitle}>
              Olá! Sou seu assistente veterinário 🐾
            </Text>
            <Text style={styles.welcomeText}>
              Pergunte sobre saúde, vacinas, alimentação ou comportamento do seu pet.
            </Text>
          </View>
        )}

        {messages.map((msg, i) => {
          if (msg.content === "__SCHEDULE_BTN__") {
            return (
              <TouchableOpacity
                key={i}
                style={styles.scheduleBtn}
                onPress={() => navigation.navigate("HealthCalendar")}
                activeOpacity={0.85}
              >
                <Ionicons name="calendar" size={18} color={Colors.white} />
                <Text style={styles.scheduleBtnText}>
                  Abrir Calendário e Agendar
                </Text>
              </TouchableOpacity>
            );
          }

          const isUser = msg.role === "user";
          return (
            <View
              key={i}
              style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}
            >
              {!isUser && (
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={13} color={Colors.accentLight} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleAI,
                ]}
              >
                <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
                  {msg.content}
                </Text>
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={[styles.row, styles.rowAI]}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={13} color={Colors.accentLight} />
            </View>
            <View style={styles.bubbleAI}>
              <ActivityIndicator size="small" color={Colors.accentLight} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Pergunte sobre seu pet..."
          placeholderTextColor={Colors.textLight}
          value={input}
          onChangeText={setInput}
          multiline
          returnKeyType="send"
          onSubmitEditing={sendMessage}
          blurOnSubmit
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!input.trim() || loading) && styles.sendBtnOff,
          ]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
          activeOpacity={0.85}
        >
          <Ionicons name="send" size={19} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    backgroundColor: Colors.secondary,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  headerCenter: { alignItems: "center" },
  title: { fontSize: 17, fontWeight: "700", color: Colors.white },
  subtitle: { fontSize: 12, color: Colors.textLight, marginTop: 1 },
  messages: { padding: 16, gap: 12, paddingBottom: 24 },
  welcome: { alignItems: "center", paddingVertical: 40, gap: 12 },
  welcomeIcon: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: Colors.accentLight + "20",
    alignItems: "center", justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 16, fontWeight: "700", color: Colors.white,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 13, color: Colors.textLight,
    textAlign: "center", lineHeight: 20, paddingHorizontal: 16,
  },
  row: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  rowUser: { justifyContent: "flex-end" },
  rowAI: { justifyContent: "flex-start" },
  aiAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.accentLight + "20",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  bubble: { maxWidth: "78%", borderRadius: 18, padding: 12 },
  bubbleUser: {
    backgroundColor: Colors.accentLight,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, color: Colors.white, lineHeight: 20 },
  bubbleTextUser: { color: Colors.white },
  scheduleBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    alignSelf: "center", backgroundColor: Colors.accentOrange,
    paddingHorizontal: 20, paddingVertical: 13,
    borderRadius: 14, marginVertical: 4,
  },
  scheduleBtnText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
  inputBar: {
    flexDirection: "row", alignItems: "flex-end", gap: 10,
    padding: 16, paddingBottom: 32,
    backgroundColor: Colors.secondary,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)",
  },
  input: {
    flex: 1, backgroundColor: Colors.primary, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 12,
    color: Colors.white, fontSize: 15, maxHeight: 100,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  sendBtn: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: Colors.accentLight,
    alignItems: "center", justifyContent: "center",
  },
  sendBtnOff: { opacity: 0.35 },
});