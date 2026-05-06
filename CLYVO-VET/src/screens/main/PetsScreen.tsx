import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import { styles } from "../../styles/Petchatscreen.styles";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

const QUICK_ACTIONS = [
  { icon: "thermometer-outline", label: "Febre / Temperatura" },
  { icon: "sad-outline", label: "Sem apetite" },
  { icon: "water-outline", label: "Vômito / Diarreia" },
  { icon: "eye-outline", label: "Olhos / Nariz" },
  { icon: "walk-outline", label: "Mancando" },
  { icon: "alert-circle-outline", label: "Comportamento estranho" },
  { icon: "calendar-outline", label: "Próximas vacinas" },
  { icon: "medical-outline", label: "Medicamentos ativos" },
];

function buildSystemPrompt(pets: any[], selectedPet: string | null) {
  const target = selectedPet ? pets.filter((p) => p.id === selectedPet) : pets;
  const petInfo = target.map((p) => {
    const vaccines = (p.vaccines ?? []).map((v: any) => `${v.name} (${v.done ? "ok" : "pendente, próxima: " + v.nextDue})`).join(", ");
    const meds = (p.medications ?? []).filter((m: any) => m.active).map((m: any) => m.name).join(", ");
    return `Pet: ${p.name}, espécie: ${p.species}, raça: ${p.breed ?? "não informada"}, idade: ${p.age ?? "não informada"}, vacinas: [${vaccines || "nenhuma"}], medicamentos ativos: [${meds || "nenhum"}]`;
  }).join("\n");

  return `Você é um assistente veterinário especializado e empático chamado ClyvoVet AI. 
Responda sempre em português brasileiro de forma clara, acolhedora e prática.
Quando o tutor relatar sintomas, faça perguntas objetivas para entender melhor e oriente sobre urgência (se deve ir ao vet imediatamente, observar ou monitorar em casa).
Nunca substitua o diagnóstico veterinário presencial, mas seja útil e específico.
Dados dos pets do tutor:\n${petInfo || "Nenhum pet cadastrado ainda."}
Respostas devem ser concisas (máx 4 parágrafos), use emojis com moderação.`;
}

function nowTime() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const INTRO: Message = {
  id: "intro",
  role: "ai",
  text: "Olá! Sou o ClyvoVet AI 🐾\n\nPosso te ajudar a entender sintomas, verificar vacinas, medicamentos e orientar sobre quando buscar atendimento veterinário.\n\nSobre qual pet você quer conversar? Ou me conte o que está acontecendo!",
  time: nowTime(),
};

export default function PetChatScreen() {
  const navigation = useNavigation();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([INTRO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useFocusEffect(useCallback(() => {
    storageService.getPets().then(setPets);
  }, []));

  useEffect(() => {
    if (!loading) return;
    const anim = (d: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(d, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ])
      );
    const a1 = anim(dot1, 0);
    const a2 = anim(dot2, 200);
    const a3 = anim(dot3, 400);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [loading]);

  const scrollToEnd = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed, time: nowTime() };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);
    scrollToEnd();

    try {
      const systemPrompt = buildSystemPrompt(pets, selectedPet);
      const apiMessages = history
        .filter((m) => m.id !== "intro")
        .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));

      if (apiMessages.length === 0 || apiMessages[0].role !== "user") {
        apiMessages.unshift({ role: "user", content: trimmed });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const aiText = data?.content?.[0]?.text ?? "Desculpe, não consegui responder agora. Tente novamente.";

      const aiMsg: Message = { id: Date.now().toString() + "_ai", role: "ai", text: aiText, time: nowTime() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: Date.now().toString() + "_err",
        role: "ai",
        text: "Ops! Não foi possível conectar. Verifique sua internet e tente novamente 🔄",
        time: nowTime(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  };

  const selectedPetName = selectedPet ? pets.find((p) => p.id === selectedPet)?.name : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>ClyvoVet AI</Text>
          <Text style={styles.headerSub}>
            {selectedPetName ? `Conversando sobre ${selectedPetName}` : "Assistente veterinário"}
          </Text>
        </View>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="sparkles" size={20} color={Colors.accentLight} />
          </View>
          <View style={styles.aiDot} />
        </View>
      </View>

      {pets.length > 0 && (
        <View style={styles.petSelector}>
          <Text style={styles.petSelectorLabel}>Falar sobre</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.petChipsRow}>
              <TouchableOpacity
                style={[styles.allChip, selectedPet === null && styles.allChipActive]}
                onPress={() => setSelectedPet(null)}
              >
                <Text style={[styles.allChipText, selectedPet === null && styles.allChipTextActive]}>Todos</Text>
              </TouchableOpacity>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.petChip, selectedPet === pet.id && styles.petChipActive]}
                  onPress={() => setSelectedPet(pet.id)}
                >
                  <Ionicons name="paw" size={13} color={selectedPet === pet.id ? Colors.primary : Colors.textSecondary} />
                  <Text style={[styles.petChipText, selectedPet === pet.id && styles.petChipTextActive]}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={0}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.msgRow, msg.role === "user" ? styles.msgRowUser : styles.msgRowAi]}>
              {msg.role === "ai" && (
                <View style={styles.aiHeaderRow}>
                  <View style={styles.aiHeaderIcon}>
                    <Ionicons name="sparkles" size={12} color={Colors.primary} />
                  </View>
                  <Text style={styles.aiHeaderText}>CLYVOVET AI</Text>
                </View>
              )}
              <View style={msg.role === "user" ? styles.msgBubbleUser : styles.msgBubbleAi}>
                <Text style={msg.role === "user" ? styles.msgTextUser : styles.msgTextAi}>{msg.text}</Text>
              </View>
              <Text style={styles.msgTime}>{msg.time}</Text>
            </View>
          ))}

          {loading && (
            <View style={styles.typingBubble}>
              {[dot1, dot2, dot3].map((d, i) => (
                <Animated.View key={i} style={[styles.typingDot, { opacity: d }]} />
              ))}
            </View>
          )}
        </ScrollView>

        {messages.length <= 2 && !loading && (
          <View style={styles.quickContainer}>
            <Text style={styles.quickLabel}>Sugestões rápidas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quickRow}>
                {QUICK_ACTIONS.map((q) => (
                  <TouchableOpacity
                    key={q.label}
                    style={styles.quickChip}
                    onPress={() => sendMessage(q.label)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={q.icon as any} size={14} color={Colors.primary} />
                    <Text style={styles.quickChipText}>{q.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Descreva os sintomas ou faça uma pergunta..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              returnKeyType="default"
              editable={!loading}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={18}
              color={!input.trim() || loading ? Colors.textSecondary : Colors.white}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}