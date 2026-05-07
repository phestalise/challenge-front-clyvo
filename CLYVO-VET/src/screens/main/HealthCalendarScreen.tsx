import React, { useCallback, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, Modal, TextInput, Alert, StyleSheet, Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

const { width } = Dimensions.get("window");
const DAY_SIZE = Math.floor((width - 48 - 36) / 7);
const WEEK_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const EVENT_TYPES = [
  { key: "Vacina", color: Colors.accentGreen, icon: "shield-checkmark" as const },
  { key: "Medicamento", color: Colors.accentOrange, icon: "medical" as const },
  { key: "Consulta", color: Colors.accentLight, icon: "calendar" as const },
];

function parseDate(str: string): Date | null {
  if (!str) return null;
  const p = str.split("/");
  if (p.length === 3) return new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0]));
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function HealthCalendarScreen() {
  const navigation = useNavigation();
  const [pets, setPets] = useState<any[]>([]);
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);
  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("Consulta");
  const [eventPetId, setEventPetId] = useState("");
  const [savingEvent, setSavingEvent] = useState(false);

  useFocusEffect(useCallback(() => {
    storageService.getPets().then((p) => {
      setPets(p);
      if (p.length > 0 && !eventPetId) setEventPetId(p[0].id);
    });
  }, []));

  const allEvents = pets.flatMap((pet) => [
    ...(pet.vaccines ?? []).map((v: any) => ({ petName: pet.name, petId: pet.id, type: "Vacina", name: v.name, date: v.nextDue, done: v.done })),
    ...(pet.medications ?? []).map((m: any) => ({ petName: pet.name, petId: pet.id, type: "Medicamento", name: m.name, date: m.startDate, done: !m.active })),
    ...(pet.appointments ?? []).map((a: any) => ({ petName: pet.name, petId: pet.id, type: "Consulta", name: a.reason ?? "Consulta", date: a.date, done: a.done ?? false })),
  ]);

  const eventsForDay = (day: Date) =>
    allEvents.filter((ev) => { const d = parseDate(ev.date); return d && isSameDay(d, day); });

  const hasEvent = (day: Date) => eventsForDay(day).length > 0;

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; month: "prev" | "current" | "next"; date: Date }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    cells.push({ day: d, month: "prev", date: new Date(year, month - 1, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, month: "current", date: new Date(year, month, d) });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, month: "next", date: new Date(year, month + 1, d) });

  const selectedEvents = eventsForDay(selected);

  const handleSaveEvent = async () => {
    if (!eventName.trim()) { Alert.alert("Preencha o nome do evento"); return; }
    if (!eventPetId) { Alert.alert("Selecione um pet"); return; }
    setSavingEvent(true);
    try {
      const allPets = await storageService.getPets();
      const updated = allPets.map((pet: any) => {
        if (pet.id !== eventPetId) return pet;
        const appointment = { id: `ev${Date.now()}`, reason: eventName.trim(), date: formatDate(selected), done: false };
        return { ...pet, appointments: [...(pet.appointments ?? []), appointment] };
      });
      await storageService.savePets(updated);
      setPets(updated);
      setShowModal(false);
      setEventName("");
      setEventType("Consulta");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o evento.");
    } finally {
      setSavingEvent(false);
    }
  };

  const monthLabel = current.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const pendingCount = allEvents.filter((e) => !e.done).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Calendário de Saúde</Text>
          <Text style={styles.headerSub}>{pendingCount} eventos pendentes</Text>
        </View>
        <TouchableOpacity style={styles.addEventBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calCard}>
          <View style={styles.calNav}>
            <TouchableOpacity style={styles.navBtn} onPress={() => setCurrent(new Date(year, month - 1, 1))}>
              <Ionicons name="chevron-back" size={18} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{monthLabel}</Text>
            <TouchableOpacity style={styles.navBtn} onPress={() => setCurrent(new Date(year, month + 1, 1))}>
              <Ionicons name="chevron-forward" size={18} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {WEEK_LABELS.map((l) => (
              <Text key={l} style={styles.weekLabel}>{l}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {cells.map((cell, idx) => {
              const isToday = isSameDay(cell.date, today);
              const isSel = isSameDay(cell.date, selected);
              const hasEv = hasEvent(cell.date);
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.dayCell, isToday && !isSel && styles.dayCellToday, isSel && styles.dayCellSel]}
                  onPress={() => setSelected(cell.date)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayNum,
                    isToday && !isSel && styles.dayNumToday,
                    isSel && styles.dayNumSel,
                    cell.month !== "current" && styles.dayNumOther,
                  ]}>
                    {cell.day}
                  </Text>
                  {hasEv ? <View style={styles.eventDot} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.legendRow}>
          {EVENT_TYPES.map((t) => (
            <View key={t.key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: t.color }]} />
              <Text style={styles.legendText}>{t.key}</Text>
            </View>
          ))}
        </View>

        <View style={styles.eventsSection}>
          <View style={styles.eventsSectionHeader}>
            <Text style={styles.eventsSectionTitle}>
              {selected.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </Text>
            <TouchableOpacity style={styles.addDayBtn} onPress={() => setShowModal(true)}>
              <Ionicons name="add" size={15} color={Colors.primary} />
              <Text style={styles.addDayBtnText}>Novo</Text>
            </TouchableOpacity>
          </View>

          {selectedEvents.length === 0 ? (
            <View style={styles.emptyDay}>
              <Ionicons name="calendar-outline" size={38} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>Nenhum evento neste dia</Text>
              <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setShowModal(true)}>
                <Text style={styles.emptyAddBtnText}>+ Criar evento</Text>
              </TouchableOpacity>
            </View>
          ) : (
            selectedEvents.map((ev, i) => {
              const meta = EVENT_TYPES.find((t) => t.key === ev.type) ?? EVENT_TYPES[2];
              return (
                <View key={i} style={[styles.eventCard, { borderLeftColor: meta.color }]}>
                  <View style={[styles.eventIconBox, { backgroundColor: meta.color + "20" }]}>
                    <Ionicons name={meta.icon} size={19} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventCardTitle}>{ev.name}</Text>
                    <Text style={styles.eventCardMeta}>{ev.petName} · {ev.type}</Text>
                  </View>
                  <View style={[styles.eventStatus, { backgroundColor: ev.done ? Colors.accentGreen + "20" : Colors.accentOrange + "20" }]}>
                    <Text style={[styles.eventStatusText, { color: ev.done ? Colors.accentGreen : Colors.accentOrange }]}>
                      {ev.done ? "feito" : "pendente"}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowModal(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Novo Evento</Text>
            <Text style={styles.modalDate}>
              {selected.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </Text>

            <Text style={styles.modalLabel}>Nome do evento *</Text>
            <View style={styles.modalInputRow}>
              <TextInput
                style={styles.modalInput}
                value={eventName}
                onChangeText={setEventName}
                placeholder="Ex: Consulta de rotina, Vacina V10..."
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <Text style={styles.modalLabel}>Tipo</Text>
            <View style={styles.modalChipRow}>
              {EVENT_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.modalChip, eventType === t.key && { backgroundColor: t.color, borderColor: t.color }]}
                  onPress={() => setEventType(t.key)}
                >
                  <Ionicons name={t.icon} size={13} color={eventType === t.key ? Colors.white : Colors.textSecondary} />
                  <Text style={[styles.modalChipText, eventType === t.key && { color: Colors.white }]}>{t.key}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {pets.length > 0 ? (
              <View>
                <Text style={styles.modalLabel}>Pet</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.modalChipRow}>
                    {pets.map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        style={[styles.modalChip, eventPetId === p.id && styles.modalChipActive]}
                        onPress={() => setEventPetId(p.id)}
                      >
                        <Ionicons name="paw" size={13} color={eventPetId === p.id ? Colors.white : Colors.textSecondary} />
                        <Text style={[styles.modalChipText, eventPetId === p.id && { color: Colors.white }]}>{p.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.modalSaveBtn, savingEvent ? { opacity: 0.6 } : {}]}
              onPress={handleSaveEvent}
              disabled={savingEvent}
            >
              <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
              <Text style={styles.modalSaveBtnText}>{savingEvent ? "Salvando..." : "Salvar evento"}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary, paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 16, flexDirection: "row", alignItems: "center",
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "800", color: Colors.white },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 1 },
  addEventBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  calCard: { backgroundColor: Colors.card, marginHorizontal: 20, marginTop: 20, borderRadius: 20, padding: 18, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  calNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  navBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center" },
  monthLabel: { fontSize: 15, fontWeight: "800", color: Colors.text, textTransform: "capitalize" },
  weekRow: { flexDirection: "row", marginBottom: 6 },
  weekLabel: { width: DAY_SIZE, textAlign: "center", fontSize: 10, fontWeight: "700", color: Colors.textSecondary, textTransform: "uppercase" },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: DAY_SIZE, height: DAY_SIZE, justifyContent: "center", alignItems: "center", borderRadius: DAY_SIZE / 2.5, marginBottom: 2 },
  dayCellToday: { backgroundColor: Colors.primary + "15" },
  dayCellSel: { backgroundColor: Colors.primary },
  dayNum: { fontSize: 13, fontWeight: "500", color: Colors.text },
  dayNumToday: { fontWeight: "800", color: Colors.primary },
  dayNumSel: { fontWeight: "800", color: Colors.white },
  dayNumOther: { color: Colors.textSecondary, opacity: 0.35 },
  eventDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.accentGreen, marginTop: 1 },
  legendRow: { flexDirection: "row", gap: 16, paddingHorizontal: 20, marginTop: 14, marginBottom: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: Colors.textSecondary, fontWeight: "500" },
  eventsSection: { paddingHorizontal: 20, marginTop: 16 },
  eventsSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  eventsSectionTitle: { fontSize: 14, fontWeight: "800", color: Colors.text, flex: 1, textTransform: "capitalize" },
  addDayBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: Colors.primary + "15", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addDayBtnText: { fontSize: 12, fontWeight: "700", color: Colors.primary },
  emptyDay: { alignItems: "center", paddingVertical: 28, gap: 8, backgroundColor: Colors.card, borderRadius: 16 },
  emptyText: { color: Colors.textSecondary, fontSize: 13 },
  emptyAddBtn: { backgroundColor: Colors.primary + "15", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 4 },
  emptyAddBtnText: { color: Colors.primary, fontSize: 13, fontWeight: "700" },
  eventCard: { backgroundColor: Colors.card, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10, borderLeftWidth: 3, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  eventIconBox: { width: 40, height: 40, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  eventCardTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  eventCardMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  eventStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  eventStatusText: { fontSize: 11, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: Colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, gap: 14 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: "center", marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: Colors.text },
  modalDate: { fontSize: 13, color: Colors.textSecondary, marginTop: -8, textTransform: "capitalize" },
  modalLabel: { fontSize: 11, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 0.5, textTransform: "uppercase" },
  modalInputRow: { backgroundColor: Colors.background, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: Colors.border },
  modalInput: { paddingVertical: 12, fontSize: 14, color: Colors.text },
  modalChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  modalChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border },
  modalChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  modalChipText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  modalSaveBtn: { backgroundColor: Colors.accentGreen, borderRadius: 16, paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 },
  modalSaveBtnText: { color: Colors.white, fontSize: 15, fontWeight: "800" },
});