import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar,
  Animated, StyleSheet, Dimensions, Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

const { width } = Dimensions.get("window");

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
  actions?: Action[];
}

interface Action {
  label: string;
  onPress: () => void;
}

function nowTime() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function todayFormatted() {
  return formatDate(new Date());
}

function nextWeekFormatted() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return formatDate(d);
}

const QUICK_ACTIONS = [
  { icon: "thermometer-outline" as const, label: "Meu pet está com febre" },
  { icon: "sad-outline" as const, label: "Está sem apetite" },
  { icon: "water-outline" as const, label: "Vômito ou diarreia" },
  { icon: "eye-outline" as const, label: "Problema nos olhos" },
  { icon: "walk-outline" as const, label: "Está mancando" },
  { icon: "calendar-outline" as const, label: "Ver vacinas pendentes" },
  { icon: "medical-outline" as const, label: "Ver medicamentos" },
  { icon: "add-circle-outline" as const, label: "Agendar consulta" },
];

export default function PetChatScreen() {
  const navigation = useNavigation();
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useFocusEffect(useCallback(() => {
    storageService.getPets().then((p) => {
      setPets(p);
      if (p.length > 0 && !selectedPet) {
        setSelectedPet(p[0]);
        initChat(p[0], p);
      } else if (p.length === 0) {
        initChat(null, []);
      }
    });
  }, []));

  useEffect(() => {
    if (!typing) return;
    const anim = (d: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(d, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(d, { toValue: 0.3, duration: 350, useNativeDriver: true }),
      ]));
    const a1 = anim(dot1, 0); const a2 = anim(dot2, 200); const a3 = anim(dot3, 400);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [typing]);

  const scrollToEnd = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);

  function initChat(pet: any | null, allPets: any[]) {
    const intro: Message = {
      id: "intro",
      role: "bot",
      time: nowTime(),
      text: allPets.length === 0
        ? "Olá! Sou o assistente ClyvoVet 🐾\n\nVocê ainda não tem pets cadastrados. Cadastre seu primeiro pet para que eu possa te ajudar melhor!\n\nMas pode me perguntar o que quiser sobre saúde animal."
        : `Olá! Sou o assistente ClyvoVet 🐾\n\nEstou aqui para ajudar com a saúde de ${pet ? pet.name : "seus pets"}.\n\nPode me contar sintomas, perguntar sobre vacinas, medicamentos ou agendar uma consulta!`,
    };
    setMessages([intro]);
  }

  function addBotMessage(text: string, actions?: Action[]) {
    const msg: Message = { id: Date.now().toString() + "_bot", role: "bot", text, time: nowTime(), actions };
    setMessages((prev) => [...prev, msg]);
    scrollToEnd();
  }

  function respondToMessage(text: string, pet: any | null, allPets: any[]) {
    const lower = text.toLowerCase();

    if (lower.includes("febre") || lower.includes("temperatura")) {
      return `Febre em pets é sinal de alerta 🌡️\n\nSintomas associados à febre:\n• Letargia e desânimo\n• Falta de apetite\n• Nariz seco e quente\n• Tremores\n\nA temperatura normal de cães é 38–39°C e de gatos 38–39,5°C.\n\nSe a febre persistir por mais de 24h ou ultrapassar 40°C, procure o veterinário com urgência.\n\nQuer que eu agende uma consulta para ${pet ? pet.name : "seu pet"}?`;
    }

    if (lower.includes("apetite") || lower.includes("comendo") || lower.includes("não come")) {
      return `Falta de apetite pode ter várias causas 🍽️\n\n• Estresse ou mudança de rotina\n• Problema dentário\n• Infecção ou vírus\n• Dor ou desconforto\n\nSe o pet ficar mais de 24h sem comer, é recomendável ir ao veterinário.\n\nComo está o comportamento geral de ${pet ? pet.name : "seu pet"} além da alimentação?`;
    }

    if (lower.includes("vômito") || lower.includes("diarreia") || lower.includes("vomitando")) {
      return `Vômito e diarreia podem ser causados por:\n\n• Mudança brusca de alimentação\n• Ingestão de algo inadequado\n• Infecção intestinal\n• Parasitas\n\n⚠️ Atenção imediata se:\n• Houver sangue nas fezes ou vômito\n• Durar mais de 12h\n• O pet estiver prostrado\n\nOferecça água limpa e evite comida por algumas horas. Quer agendar uma consulta?`;
    }

    if (lower.includes("olho") || lower.includes("olhos") || lower.includes("nariz")) {
      return `Problemas oculares merecem atenção 👁️\n\n• Secreção amarela/verde: possível infecção\n• Olho vermelho: irritação ou conjuntivite\n• Lacrimejamento excessivo: alergia ou corpo estranho\n\nNão use colírios humanos sem orientação veterinária.\n\nQuer agendar uma consulta oftalmológica para ${pet ? pet.name : "seu pet"}?`;
    }

    if (lower.includes("manc") || lower.includes("pata") || lower.includes("andando")) {
      return `Claudicação (mancar) pode indicar:\n\n• Espinho ou corpo estranho na pata\n• Distensão muscular\n• Luxação de patela (comum em cães pequenos)\n• Displasia coxofemoral\n\nVerifique a pata afetada com cuidado. Se o pet não apoiar o membro ou houver inchaço, procure o vet.\n\nQuer agendar uma consulta?`;
    }

    if (lower.includes("vacina") || lower.includes("vacinam")) {
      if (!pet) return "Cadastre um pet para verificar as vacinas pendentes!";
      const pending = (pet.vaccines ?? []).filter((v: any) => !v.done);
      if (pending.length === 0) return `${pet.name} está com todas as vacinas em dia! ✅\n\nContinue assim, a prevenção é o melhor remédio.`;
      const list = pending.map((v: any) => `• ${v.name}${v.nextDue ? " — prevista para " + v.nextDue : ""}`).join("\n");
      return `${pet.name} tem ${pending.length} vacina(s) pendente(s):\n\n${list}\n\nQuer que eu agende uma consulta para aplicar?`;
    }

    if (lower.includes("medicamento") || lower.includes("remédio")) {
      if (!pet) return "Cadastre um pet para verificar os medicamentos!";
      const active = (pet.medications ?? []).filter((m: any) => m.active);
      if (active.length === 0) return `${pet.name} não tem nenhum medicamento ativo no momento.`;
      const list = active.map((m: any) => `• ${m.name}${m.dosage ? " — " + m.dosage : ""}${m.frequency ? " / " + m.frequency : ""}`).join("\n");
      return `${pet.name} usa atualmente:\n\n${list}\n\nAlguma dúvida sobre algum desses medicamentos?`;
    }

    if (lower.includes("agend") || lower.includes("consulta") || lower.includes("veterinário") || lower.includes("vet")) {
      return null;
    }

    if (lower.includes("nome") || lower.includes("quem é") || lower.includes("meu pet")) {
      if (!pet) return "Você ainda não tem pets cadastrados. Vá em 'Novo Pet' no dashboard para cadastrar!";
      const vacs = (pet.vaccines ?? []).length;
      const meds = (pet.medications ?? []).filter((m: any) => m.active).length;
      return `${pet.name} é um(a) ${pet.species}${pet.breed ? " da raça " + pet.breed : ""}${pet.age ? ", com " + pet.age + " ano(s)" : ""}${pet.weight ? " e pesa " + pet.weight + " kg" : ""}.\n\n• Vacinas registradas: ${vacs}\n• Medicamentos ativos: ${meds}\n\nPosso te ajudar com mais alguma coisa sobre ${pet.name}?`;
    }

    if (lower.includes("olá") || lower.includes("oi") || lower.includes("boa tarde") || lower.includes("bom dia")) {
      return `Olá! 😊 Estou aqui para ajudar com a saúde de ${pet ? pet.name : "seu pet"}.\n\nPode me contar o que está acontecendo ou escolher uma das opções abaixo!`;
    }

    return `Entendido! Vou anotar essa informação sobre ${pet ? pet.name : "seu pet"} 📋\n\nPara um diagnóstico preciso, é importante consultar um veterinário. Posso te ajudar a agendar uma consulta ou verificar vacinas e medicamentos!\n\nTem mais alguma coisa que queira me contar?`;
  }

  async function scheduleConsultation(pet: any | null, reason: string) {
    if (!pet) { Alert.alert("Selecione um pet primeiro"); return; }
    try {
      const allPets = await storageService.getPets();
      const updated = allPets.map((p: any) => {
        if (p.id !== pet.id) return p;
        const appt = { id: `ev${Date.now()}`, reason, date: nextWeekFormatted(), done: false };
        return { ...p, appointments: [...(p.appointments ?? []), appt] };
      });
      await storageService.savePets(updated);
      setPets(updated);
      setSelectedPet(updated.find((p: any) => p.id === pet.id) ?? pet);
      addBotMessage(`✅ Consulta agendada para ${pet.name}!\n\nData sugerida: ${nextWeekFormatted()}\nMotivo: ${reason}\n\nVocê pode ver e editar no Calendário de Saúde.`);
    } catch {
      addBotMessage("Não foi possível agendar. Tente pelo Calendário de Saúde.");
    }
  }

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed, time: nowTime() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    scrollToEnd();

    await new Promise((r) => setTimeout(r, 900));
    setTyping(false);

    const lower = trimmed.toLowerCase();
    const needsSchedule = lower.includes("agend") || lower.includes("consulta") || lower.includes("veterinário") || lower.includes("vet");

    if (needsSchedule) {
      const actions: Action[] = [
        {
          label: `Agendar para ${selectedPet ? selectedPet.name : "meu pet"}`,
          onPress: () => scheduleConsultation(selectedPet, trimmed),
        },
        {
          label: "Abrir Calendário",
          onPress: () => (navigation as any).navigate("HealthCalendar"),
        },
      ];
      addBotMessage(`Claro! Posso ajudar a agendar uma consulta para ${selectedPet ? selectedPet.name : "seu pet"} 📅\n\nVou sugerir ${nextWeekFormatted()} como data. Confirma?`, actions);
      return;
    }

    const response = respondToMessage(trimmed, selectedPet, pets);

    if (!response) {
      const actions: Action[] = [
        {
          label: `Agendar para ${selectedPet ? selectedPet.name : "meu pet"}`,
          onPress: () => scheduleConsultation(selectedPet, "Consulta de rotina"),
        },
        {
          label: "Abrir Calendário",
          onPress: () => (navigation as any).navigate("HealthCalendar"),
        },
      ];
      addBotMessage(`Posso ajudar a agendar uma consulta! 📅\n\nData sugerida: ${nextWeekFormatted()}`, actions);
      return;
    }

    const hasScheduleFollow =
      response.includes("Quer agendar") || response.includes("Quer que eu agende");

    if (hasScheduleFollow) {
      const actions: Action[] = [
        {
          label: "Sim, agendar consulta",
          onPress: () => scheduleConsultation(selectedPet, "Consulta veterinária"),
        },
        {
          label: "Ver Calendário",
          onPress: () => (navigation as any).navigate("HealthCalendar"),
        },
      ];
      addBotMessage(response, actions);
    } else {
      addBotMessage(response);
    }
  };

  const handleSelectPet = (pet: any) => {
    setSelectedPet(pet);
    setMessages([]);
    setTimeout(() => initChat(pet, pets), 100);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>ClyvoVet Assistente</Text>
          <Text style={styles.headerSub}>{selectedPet ? `Sobre: ${selectedPet.name}` : "Assistente veterinário"}</Text>
        </View>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="paw" size={20} color={Colors.accentLight} />
          </View>
          <View style={styles.onlineDot} />
        </View>
      </View>

      {pets.length > 0 ? (
        <View style={styles.petBar}>
          <Text style={styles.petBarLabel}>Falar sobre</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.petBarRow}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.petChip, selectedPet?.id === pet.id && styles.petChipActive]}
                  onPress={() => handleSelectPet(pet)}
                >
                  <Ionicons name="paw" size={12} color={selectedPet?.id === pet.id ? Colors.white : Colors.textSecondary} />
                  <Text style={[styles.petChipText, selectedPet?.id === pet.id && styles.petChipTextActive]}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : null}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.msgRow, msg.role === "user" ? styles.msgRowUser : styles.msgRowBot]}>
              {msg.role === "bot" ? (
                <View style={styles.botHeader}>
                  <View style={styles.botHeaderIcon}>
                    <Ionicons name="paw" size={11} color={Colors.primary} />
                  </View>
                  <Text style={styles.botHeaderText}>CLYVOVET</Text>
                </View>
              ) : null}
              <View style={msg.role === "user" ? styles.bubbleUser : styles.bubbleBot}>
                <Text style={msg.role === "user" ? styles.textUser : styles.textBot}>{msg.text}</Text>
              </View>
              {msg.actions && msg.actions.length > 0 ? (
                <View style={styles.actionsRow}>
                  {msg.actions.map((a, i) => (
                    <TouchableOpacity key={i} style={styles.actionBtn} onPress={a.onPress}>
                      <Text style={styles.actionBtnText}>{a.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
              <Text style={styles.msgTime}>{msg.time}</Text>
            </View>
          ))}

          {typing ? (
            <View style={styles.typingRow}>
              <View style={styles.typingBubble}>
                {[dot1, dot2, dot3].map((d, i) => (
                  <Animated.View key={i} style={[styles.typingDot, { opacity: d }]} />
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        {messages.length <= 1 && !typing ? (
          <View style={styles.quickContainer}>
            <Text style={styles.quickLabel}>O que está acontecendo?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quickRow}>
                {QUICK_ACTIONS.map((q) => (
                  <TouchableOpacity key={q.label} style={styles.quickChip} onPress={() => handleSend(q.label)} activeOpacity={0.7}>
                    <Ionicons name={q.icon} size={13} color={Colors.primary} />
                    <Text style={styles.quickChipText}>{q.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Descreva os sintomas ou faça uma pergunta..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              editable={!typing}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || typing) && styles.sendBtnOff]}
            onPress={() => handleSend(input)}
            disabled={!input.trim() || typing}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={17} color={!input.trim() || typing ? Colors.textSecondary : Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "800", color: Colors.white },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 },
  avatarWrap: { position: "relative" },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.accentGreen, borderWidth: 2, borderColor: Colors.primary, position: "absolute", bottom: 0, right: 0 },
  petBar: { backgroundColor: Colors.card, paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: Colors.background },
  petBarLabel: { fontSize: 10, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, textTransform: "uppercase" },
  petBarRow: { flexDirection: "row", gap: 8 },
  petChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border },
  petChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  petChipText: { fontSize: 12, fontWeight: "600", color: Colors.textSecondary },
  petChipTextActive: { color: Colors.white, fontWeight: "700" },
  msgList: { paddingHorizontal: 16, paddingVertical: 16, gap: 2 },
  msgRow: { marginBottom: 12 },
  msgRowUser: { alignItems: "flex-end" },
  msgRowBot: { alignItems: "flex-start" },
  botHeader: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 5 },
  botHeaderIcon: { width: 20, height: 20, borderRadius: 6, backgroundColor: Colors.primary + "18", justifyContent: "center", alignItems: "center" },
  botHeaderText: { fontSize: 10, fontWeight: "700", color: Colors.primary, letterSpacing: 0.8 },
  bubbleUser: { backgroundColor: Colors.primary, borderRadius: 18, borderBottomRightRadius: 4, paddingHorizontal: 15, paddingVertical: 10, maxWidth: width * 0.75 },
  bubbleBot: { backgroundColor: Colors.card, borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 15, paddingVertical: 10, maxWidth: width * 0.8, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  textUser: { color: Colors.white, fontSize: 14, lineHeight: 20 },
  textBot: { color: Colors.text, fontSize: 14, lineHeight: 22 },
  actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8, maxWidth: width * 0.8 },
  actionBtn: { backgroundColor: Colors.primary + "15", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: Colors.primary + "30" },
  actionBtnText: { color: Colors.primary, fontSize: 12, fontWeight: "700" },
  msgTime: { fontSize: 10, color: Colors.textSecondary, marginTop: 3, paddingHorizontal: 4 },
  typingRow: { alignItems: "flex-start", marginBottom: 12 },
  typingBubble: { backgroundColor: Colors.card, borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", gap: 5, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.textSecondary },
  quickContainer: { paddingHorizontal: 16, paddingBottom: 8, paddingTop: 4 },
  quickLabel: { fontSize: 11, fontWeight: "700", color: Colors.textSecondary, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" },
  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.card, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border },
  quickChipText: { fontSize: 12, fontWeight: "600", color: Colors.text },
  inputBar: { flexDirection: "row", alignItems: "flex-end", gap: 10, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.background },
  inputWrap: { flex: 1, backgroundColor: Colors.background, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 8, maxHeight: 100 },
  input: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center", shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  sendBtnOff: { backgroundColor: Colors.background, shadowOpacity: 0, elevation: 0 },
});