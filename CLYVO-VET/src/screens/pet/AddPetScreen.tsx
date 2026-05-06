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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Pet, Vaccine, Medication } from "../../types";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import { validarFormularioPet } from "../../utils/validators";

type Nav = NativeStackNavigationProp<RootStackParamList>;
const SPECIES = ["Cachorro", "Gato", "Pássaro", "Coelho", "Outro"];

const StepIndicator = ({ step }: { step: number }) => (
  <View style={styles.stepsContainer}>
    <View style={styles.progressBarBg}>
      <View
        style={[
          styles.progressBarFill,
          { width: `${((step - 1) / 2) * 100}%` },
        ]}
      />
    </View>
    <View style={styles.dotsRow}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={styles.dotOuter}>
          <View style={[styles.dot, step >= s && styles.dotActive]}>
            {step > s ? (
              <Ionicons name="checkmark" size={14} color={Colors.primary} />
            ) : (
              <Text style={[styles.dotText, step >= s && styles.dotTextActive]}>
                {s}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  </View>
);

interface FieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
  placeholder?: string;
  keyboard?: "default" | "email-address" | "numeric";
  numeric?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

const Field = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  keyboard = "default",
  numeric = false,
  icon,
}: FieldProps) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputRow, error && styles.inputRowErr]}>
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color={error ? Colors.accentRed : Colors.textSecondary}
          style={{ marginRight: 8 }}
        />
      )}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        keyboardType={numeric ? "decimal-pad" : keyboard}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default function AddPetScreen() {
  const navigation = useNavigation<Nav>();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [nextCheckup, setNextCheckup] = useState("");
  const [vaccines, setVaccines] = useState<Partial<Vaccine>[]>([
    { name: "", date: "", nextDue: "", done: false },
  ]);
  const [medications, setMedications] = useState<Partial<Medication>[]>([]);

  const validateStep1 = () => {
    const e = validarFormularioPet({ name, species, breed, age, weight });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const updateVax = (i: number, k: keyof Vaccine, v: any) =>
    setVaccines((prev) =>
      prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))
    );

  const updateMed = (i: number, k: keyof Medication, v: any) =>
    setMedications((prev) =>
      prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))
    );

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
          text: "Ver pets",
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (step > 1 ? setStep((s) => s - 1) : navigation.goBack())}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {step === 1 ? "Dados do Pet" : step === 2 ? "Vacinas" : "Medicamentos"}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.stepLabel}>Passo {step}/3</Text>
        </View>
      </View>

      <StepIndicator step={step} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🐶 Informações básicas</Text>

            <Field
              label="Nome do pet *"
              value={name}
              onChange={(v) => {
                setName(v);
                setErrors((p) => ({ ...p, name: "" }));
              }}
              error={errors.name}
              placeholder="Ex: Rex, Luna..."
              icon="paw"
            />

            <Text style={styles.label}>Espécie *</Text>
            <View style={styles.chipRow}>
              {SPECIES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, species === s && styles.chipSelected]}
                  onPress={() => {
                    setSpecies(s);
                    setErrors((p) => ({ ...p, species: "" }));
                  }}
                >
                  <Text
                    style={[styles.chipText, species === s && styles.chipTextSelected]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}

            <Field
              label="Raça *"
              value={breed}
              onChange={(v) => {
                setBreed(v);
                setErrors((p) => ({ ...p, breed: "" }));
              }}
              error={errors.breed}
              placeholder="Ex: Golden Retriever"
              icon="git-branch"
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field
                  label="Idade (anos) *"
                  value={age}
                  onChange={setAge}
                  error={errors.age}
                  placeholder="3"
                  numeric
                  icon="calendar"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label="Peso (kg) *"
                  value={weight}
                  onChange={setWeight}
                  error={errors.weight}
                  placeholder="8.5"
                  numeric
                  icon="speedometer"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field
                  label="Cor / pelagem"
                  value={color}
                  onChange={setColor}
                  placeholder="Caramelo"
                  icon="color-palette"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label="Próximo retorno"
                  value={nextCheckup}
                  onChange={setNextCheckup}
                  placeholder="dd/mm/aaaa"
                  icon="medkit"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => validateStep1() && setStep(2)}
            >
              <Text style={styles.primaryBtnText}>Próximo — Vacinas</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>💉 Vacinas</Text>
            {vaccines.map((v, i) => (
              <View key={i} style={styles.subCard}>
                <View style={styles.subCardHeader}>
                  <Text style={styles.subCardTitle}>Vacina {i + 1}</Text>
                  {vaccines.length > 1 && (
                    <TouchableOpacity
                      onPress={() =>
                        setVaccines((prev) => prev.filter((_, x) => x !== i))
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={Colors.accentRed}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <Field
                  label="Nome"
                  value={v.name || ""}
                  onChange={(val) => updateVax(i, "name", val)}
                  placeholder="Ex: V10"
                  icon="flask"
                />
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Field
                      label="Data aplicação"
                      value={v.date || ""}
                      onChange={(val) => updateVax(i, "date", val)}
                      placeholder="dd/mm/aa"
                      icon="today"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field
                      label="Próxima dose"
                      value={v.nextDue || ""}
                      onChange={(val) => updateVax(i, "nextDue", val)}
                      placeholder="dd/mm/aa"
                      icon="alarm"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.statusToggle}
                  onPress={() => updateVax(i, "done", !v.done)}
                >
                  <Ionicons
                    name={v.done ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={v.done ? Colors.accentGreen : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      v.done && { color: Colors.accentGreen },
                    ]}
                  >
                    {v.done ? "Aplicada" : "Pendente"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                setVaccines((prev) => [
                  ...prev,
                  { name: "", date: "", nextDue: "", done: false },
                ])
              }
            >
              <Ionicons name="add-circle-outline" size={20} color={Colors.accent} />
              <Text style={styles.addBtnText}>Adicionar vacina</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.outlineBtn} onPress={() => setStep(1)}>
                <Text style={styles.outlineBtnText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(3)}>
                <Text style={styles.primaryBtnText}>Próximo</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>💊 Medicamentos</Text>
            {medications.map((m, i) => (
              <View key={i} style={styles.subCard}>
                <View style={styles.subCardHeader}>
                  <Text style={styles.subCardTitle}>Medicamento {i + 1}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setMedications((prev) => prev.filter((_, x) => x !== i))
                    }
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.accentRed} />
                  </TouchableOpacity>
                </View>

                <Field
                  label="Nome"
                  value={m.name || ""}
                  onChange={(v) => updateMed(i, "name", v)}
                  placeholder="Ex: Dipirona"
                  icon="medkit"
                />
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Field
                      label="Dosagem"
                      value={m.dosage || ""}
                      onChange={(v) => updateMed(i, "dosage", v)}
                      placeholder="10mg"
                      icon="fitness"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field
                      label="Frequência"
                      value={m.frequency || ""}
                      onChange={(v) => updateMed(i, "frequency", v)}
                      placeholder="12/12h"
                      icon="repeat"
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Field
                      label="Início"
                      value={m.startDate || ""}
                      onChange={(v) => updateMed(i, "startDate", v)}
                      placeholder="dd/mm/aa"
                      icon="play"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field
                      label="Término"
                      value={m.endDate || ""}
                      onChange={(v) => updateMed(i, "endDate", v)}
                      placeholder="dd/mm/aa"
                      icon="stop"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.statusToggle}
                  onPress={() => updateMed(i, "active", !m.active)}
                >
                  <Ionicons
                    name={m.active ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={m.active ? Colors.accent : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      m.active && { color: Colors.accent },
                    ]}
                  >
                    {m.active ? "Em uso" : "Concluído"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                setMedications((prev) => [
                  ...prev,
                  {
                    name: "",
                    dosage: "",
                    frequency: "",
                    startDate: "",
                    endDate: "",
                    active: true,
                  },
                ])
              }
            >
              <Ionicons name="add-circle-outline" size={20} color={Colors.accent} />
              <Text style={styles.addBtnText}>Adicionar medicamento</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.outlineBtn} onPress={() => setStep(2)}>
                <Text style={styles.outlineBtnText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, loading && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={loading}
              >
                <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
                <Text style={styles.saveBtnText}>
                  {loading ? "Salvando..." : "Salvar Pet"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "800", color: Colors.text },
  headerRight: {},
  stepLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepsContainer: { paddingHorizontal: 20, paddingBottom: 10, backgroundColor: Colors.background },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  dotsRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 },
  dotOuter: { alignItems: "center" },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  dotActive: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accent,
  },
  dotText: { fontSize: 13, fontWeight: "700", color: Colors.textSecondary },
  dotTextActive: { color: Colors.primary },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: Colors.text, marginBottom: 4 },
  fieldWrap: { gap: 6 },
  label: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 0.3 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputRowErr: { borderColor: Colors.accentRed },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  errorText: { fontSize: 11, color: Colors.accentRed, marginTop: 2 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600" },
  chipTextSelected: { color: Colors.white },
  row: { flexDirection: "row", gap: 10 },
  subCard: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subCardTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  statusToggle: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusText: { fontSize: 13, color: Colors.textSecondary },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.accent + "40",
    borderRadius: 12,
    borderStyle: "dashed",
    marginTop: 4,
  },
  addBtnText: { color: Colors.accent, fontSize: 13, fontWeight: "600" },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  primaryBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accentLight,
    paddingVertical: 15,
    borderRadius: 14,
  },
  primaryBtnText: { color: Colors.primary, fontSize: 14, fontWeight: "800" },
  outlineBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outlineBtnText: { color: Colors.textSecondary, fontSize: 14, fontWeight: "600" },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accentGreen,
    paddingVertical: 15,
    borderRadius: 14,
  },
  saveBtnText: { color: Colors.white, fontSize: 14, fontWeight: "800" },
});