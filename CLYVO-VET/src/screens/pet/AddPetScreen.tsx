import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Pet, Vaccine, Medication } from "../../types";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SPECIES = ["Cachorro", "Gato", "Pássaro", "Coelho", "Outro"];

const STEPS = [
  { label: "Dados", icon: "paw-outline" as const },
  { label: "Vacinas", icon: "shield-checkmark-outline" as const },
  { label: "Remédios", icon: "medical-outline" as const },
];

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  numeric,
  icon,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  error?: string;
  placeholder?: string;
  numeric?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, !!error && styles.inputRowErr]}>
        {icon ? (
          <Ionicons
            name={icon}
            size={16}
            color={error ? Colors.accentRed : Colors.textSecondary}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          keyboardType={numeric ? "decimal-pad" : "default"}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function AddPetScreen() {
  const navigation = useNavigation<Nav>();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [nextCheckup, setNextCheckup] = useState("");

  const [vaccines, setVaccines] = useState<Partial<Vaccine>[]>([]);
  const [medications, setMedications] = useState<Partial<Medication>[]>([]);

  const validateStep0 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nome obrigatório";
    if (!species) e.species = "Selecione a espécie";
    if (!breed.trim()) e.breed = "Raça obrigatória";
    if (!age.trim()) e.age = "Idade obrigatória";
    if (!weight.trim()) e.weight = "Peso obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const updateVax = (i: number, k: keyof Vaccine, v: any) =>
    setVaccines((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));

  const updateMed = (i: number, k: keyof Medication, v: any) =>
    setMedications((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = await storageService.getUser();
      const existing = await storageService.getPets();
      const pet: Pet = {
        id: Date.now().toString(),
        name: name.trim(),
        species,
        breed: breed.trim(),
        age: age.trim(),
        weight: weight.trim(),
        color: color.trim() || "Não informado",
        ownerId: user?.email ?? "",
        nextCheckup: nextCheckup.trim(),
        vaccines: vaccines
          .filter((v) => v.name?.trim())
          .map((v, i) => ({
            id: `v${Date.now()}${i}`,
            name: v.name!,
            date: v.date ?? "",
            nextDue: v.nextDue ?? "",
            done: v.done ?? false,
          })),
        medications: medications
          .filter((m) => m.name?.trim())
          .map((m, i) => ({
            id: `m${Date.now()}${i}`,
            name: m.name!,
            dosage: m.dosage ?? "",
            frequency: m.frequency ?? "",
            startDate: m.startDate ?? "",
            endDate: m.endDate ?? "",
            active: m.active ?? true,
          })),
        createdAt: new Date().toISOString(),
      };
      await storageService.savePets([...existing, pet]);
      Alert.alert("🐾 Pet cadastrado!", `${pet.name} foi adicionado com sucesso.`, [
        {
          text: "Ok",
          onPress: () => navigation.reset({ index: 0, routes: [{ name: "Main" }] }),
        },
      ]);
    } catch {
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => (step > 0 ? setStep((s) => s - 1) : navigation.goBack())}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {step === 0 ? "Dados do Pet" : step === 1 ? "Vacinas" : "Medicamentos"}
          </Text>
          <Text style={styles.stepBadge}>{step + 1}/3</Text>
        </View>

        <View style={styles.stepBar}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, i <= step && styles.stepDotActive, i < step && styles.stepDotDone]}>
                  {i < step ? (
                    <Ionicons name="checkmark" size={13} color={Colors.white} />
                  ) : (
                    <Ionicons name={s.icon} size={13} color={i <= step ? Colors.white : Colors.textSecondary} />
                  )}
                </View>
                <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s.label}</Text>
              </View>
              {i < STEPS.length - 1 ? (
                <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
              ) : null}
            </React.Fragment>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Informações básicas</Text>

              <Field
                label="Nome do pet *"
                value={name}
                onChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: "" })); }}
                error={errors.name}
                placeholder="Ex: Rex, Luna..."
                icon="paw-outline"
              />

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Espécie *</Text>
                <View style={styles.chipRow}>
                  {SPECIES.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.chip, species === s && styles.chipSelected]}
                      onPress={() => { setSpecies(s); setErrors((p) => ({ ...p, species: "" })); }}
                    >
                      <Text style={[styles.chipText, species === s && styles.chipTextSelected]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.species ? <Text style={styles.errorText}>{errors.species}</Text> : null}
              </View>

              <Field
                label="Raça *"
                value={breed}
                onChange={(v) => { setBreed(v); setErrors((p) => ({ ...p, breed: "" })); }}
                error={errors.breed}
                placeholder="Ex: Golden Retriever"
                icon="git-branch-outline"
              />

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field label="Idade (anos) *" value={age} onChange={setAge} error={errors.age} placeholder="3" numeric icon="calendar-outline" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Peso (kg) *" value={weight} onChange={setWeight} error={errors.weight} placeholder="8.5" numeric icon="speedometer-outline" />
                </View>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field label="Cor / pelagem" value={color} onChange={setColor} placeholder="Caramelo" icon="color-palette-outline" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Próx. retorno" value={nextCheckup} onChange={setNextCheckup} placeholder="dd/mm/aaaa" icon="medkit-outline" />
                </View>
              </View>

              <TouchableOpacity style={styles.btnPrimary} onPress={() => validateStep0() && setStep(1)}>
                <Text style={styles.btnPrimaryText}>Próximo — Vacinas</Text>
                <Ionicons name="arrow-forward" size={17} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ) : null}

          {step === 1 ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Vacinas</Text>
              <Text style={styles.optionalHint}>Opcional — adicione se quiser registrar agora</Text>

              {vaccines.map((v, i) => (
                <View key={i} style={styles.subCard}>
                  <View style={styles.subCardHeader}>
                    <Text style={styles.subCardTitle}>Vacina {i + 1}</Text>
                    <TouchableOpacity onPress={() => setVaccines((prev) => prev.filter((_, x) => x !== i))}>
                      <Ionicons name="trash-outline" size={17} color={Colors.accentRed} />
                    </TouchableOpacity>
                  </View>
                  <Field label="Nome" value={v.name || ""} onChange={(val) => updateVax(i, "name", val)} placeholder="Ex: V10" icon="flask-outline" />
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Field label="Aplicação" value={v.date || ""} onChange={(val) => updateVax(i, "date", val)} placeholder="dd/mm/aaaa" icon="today-outline" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Field label="Próxima dose" value={v.nextDue || ""} onChange={(val) => updateVax(i, "nextDue", val)} placeholder="dd/mm/aaaa" icon="alarm-outline" />
                    </View>
                  </View>
                  <TouchableOpacity style={styles.toggleRow} onPress={() => updateVax(i, "done", !v.done)}>
                    <Ionicons name={v.done ? "checkmark-circle" : "ellipse-outline"} size={20} color={v.done ? Colors.accentGreen : Colors.textSecondary} />
                    <Text style={[styles.toggleText, v.done ? { color: Colors.accentGreen } : {}]}>
                      {v.done ? "Já aplicada" : "Pendente"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setVaccines((prev) => [...prev, { name: "", date: "", nextDue: "", done: false }])}
              >
                <Ionicons name="add-circle-outline" size={19} color={Colors.accent} />
                <Text style={styles.addBtnText}>Adicionar vacina</Text>
              </TouchableOpacity>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btnOutline} onPress={() => setStep(0)}>
                  <Text style={styles.btnOutlineText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => setStep(2)}>
                  <Text style={styles.btnPrimaryText}>Próximo</Text>
                  <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Medicamentos</Text>
              <Text style={styles.optionalHint}>Opcional — adicione se o pet usa algum medicamento</Text>

              {medications.map((m, i) => (
                <View key={i} style={styles.subCard}>
                  <View style={styles.subCardHeader}>
                    <Text style={styles.subCardTitle}>Medicamento {i + 1}</Text>
                    <TouchableOpacity onPress={() => setMedications((prev) => prev.filter((_, x) => x !== i))}>
                      <Ionicons name="trash-outline" size={17} color={Colors.accentRed} />
                    </TouchableOpacity>
                  </View>
                  <Field label="Nome" value={m.name || ""} onChange={(v) => updateMed(i, "name", v)} placeholder="Ex: Dipirona" icon="medkit-outline" />
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Field label="Dosagem" value={m.dosage || ""} onChange={(v) => updateMed(i, "dosage", v)} placeholder="10mg" icon="fitness-outline" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Field label="Frequência" value={m.frequency || ""} onChange={(v) => updateMed(i, "frequency", v)} placeholder="12/12h" icon="repeat-outline" />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Field label="Início" value={m.startDate || ""} onChange={(v) => updateMed(i, "startDate", v)} placeholder="dd/mm/aaaa" icon="play-outline" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Field label="Término" value={m.endDate || ""} onChange={(v) => updateMed(i, "endDate", v)} placeholder="dd/mm/aaaa" icon="stop-outline" />
                    </View>
                  </View>
                  <TouchableOpacity style={styles.toggleRow} onPress={() => updateMed(i, "active", !m.active)}>
                    <Ionicons name={m.active ? "checkmark-circle" : "ellipse-outline"} size={20} color={m.active ? Colors.accent : Colors.textSecondary} />
                    <Text style={[styles.toggleText, m.active ? { color: Colors.accent } : {}]}>
                      {m.active ? "Em uso" : "Concluído"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setMedications((prev) => [...prev, { name: "", dosage: "", frequency: "", startDate: "", endDate: "", active: true }])}
              >
                <Ionicons name="add-circle-outline" size={19} color={Colors.accent} />
                <Text style={styles.addBtnText}>Adicionar medicamento</Text>
              </TouchableOpacity>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btnOutline} onPress={() => setStep(1)}>
                  <Text style={styles.btnOutlineText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnSave, loading ? { opacity: 0.6 } : {}]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  <Ionicons name="checkmark-circle" size={17} color={Colors.white} />
                  <Text style={styles.btnSaveText}>{loading ? "Salvando..." : "Salvar Pet"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: Colors.card, justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: Colors.text },
  stepBadge: {
    fontSize: 12, fontWeight: "700", color: Colors.textSecondary,
    backgroundColor: Colors.card, paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border, overflow: "hidden",
  },
  stepBar: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 24, paddingBottom: 16, paddingTop: 4,
    backgroundColor: Colors.background,
  },
  stepItem: { alignItems: "center", gap: 4 },
  stepDot: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border,
    justifyContent: "center", alignItems: "center",
  },
  stepDotActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  stepDotDone: { backgroundColor: Colors.accentGreen, borderColor: Colors.accentGreen },
  stepLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: "600" },
  stepLabelActive: { color: Colors.accent, fontWeight: "700" },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: 6, marginBottom: 16 },
  stepLineDone: { backgroundColor: Colors.accentGreen },
  scroll: { padding: 20, paddingBottom: 48 },
  card: {
    backgroundColor: Colors.card, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: Colors.border, gap: 14,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: Colors.text },
  optionalHint: { fontSize: 12, color: Colors.textSecondary, marginTop: -8 },
  fieldWrap: { gap: 5 },
  label: { fontSize: 11, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.background, borderRadius: 12,
    paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.border,
    minHeight: 46,
  },
  inputRowErr: { borderColor: Colors.accentRed },
  input: { flex: 1, paddingVertical: 11, fontSize: 14, color: Colors.text },
  errorText: { fontSize: 11, color: Colors.accentRed },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border,
  },
  chipSelected: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600" },
  chipTextSelected: { color: Colors.white },
  row: { flexDirection: "row", gap: 10 },
  subCard: {
    backgroundColor: Colors.background, borderRadius: 14, padding: 14,
    gap: 10, borderWidth: 1, borderColor: Colors.border,
  },
  subCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  subCardTitle: { fontSize: 13, fontWeight: "700", color: Colors.text },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  toggleText: { fontSize: 13, color: Colors.textSecondary },
  addBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 13, borderWidth: 1.5,
    borderColor: Colors.accent + "50", borderRadius: 12, borderStyle: "dashed",
  },
  addBtnText: { color: Colors.accent, fontSize: 13, fontWeight: "700" },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  btnPrimary: {
    flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: Colors.accentLight, paddingVertical: 15, borderRadius: 14,
  },
  btnPrimaryText: { color: Colors.primary, fontSize: 14, fontWeight: "800" },
  btnOutline: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 15, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border,
  },
  btnOutlineText: { color: Colors.textSecondary, fontSize: 14, fontWeight: "600" },
  btnSave: {
    flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: Colors.accentGreen, paddingVertical: 15, borderRadius: 14,
  },
  btnSaveText: { color: Colors.white, fontSize: 14, fontWeight: "800" },
});