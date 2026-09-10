import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { showAlert } from "../../utils/showAlert";

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { Colors, alpha } from "../../styles/colors";
import { RootStackParamList } from "../../types";
import { usePet } from "../../hooks/usePet";
import { useAuth } from "../../hooks/useAuth";
import { validarFormularioPet } from "../../utils/validators";
import { gerarIdNumerico } from "../../utils/id";

import { styles } from "../../styles/AddPetScreen.styles";

const SPECIES = ["Cachorro", "Gato", "Pássaro", "Coelho", "Outro"];

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "AddPet">;

export default function AddPetScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const petId = route.params?.petId;
  const isEditing = !!petId;

  const { user } = useAuth();
  const { pet, loading, error, save } = usePet(petId);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!pet) return;

    setName(pet.name ?? "");
    setSpecies(pet.species ?? "");
    setBreed(pet.breed ?? "");
    setBirthDate(pet.birthDate ?? "");
    setWeight(String(pet.weight ?? ""));
    setPhotoUri(pet.photoUri);
  }, [pet]);

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showAlert(
        "Permissão necessária",
        "Precisamos de acesso às suas fotos para escolher uma imagem do pet.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const breedEffective = breed.trim() || species;

    const validationErrors = validarFormularioPet({
      name,
      species,
      breed: breedEffective,
      birthDate,
      weight,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const updatedPet = {
        ...(pet ?? {}),
        id: pet?.id ?? gerarIdNumerico().toString(),
        ownerId: pet?.ownerId ?? user?.id ?? "",
        name: name.trim(),
        species,
        breed: breedEffective,
        birthDate: birthDate.trim(),
        weight: parseFloat(weight) || 0,
        vaccines: pet?.vaccines ?? [],
        medications: pet?.medications ?? [],
        nextCheckup: pet?.nextCheckup ?? "",
        photoUri,
      };

      const ok = await save(updatedPet as any);

      if (!ok) {
        showAlert(
          "Erro ao salvar",
          isEditing
            ? "Não foi possível atualizar o pet. Tente novamente."
            : "Não foi possível cadastrar o pet. Tente novamente.",
        );
        return;
      }

      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  if (isEditing && loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>

          <Text style={styles.title}>Editar Pet</Text>

          <View style={{ width: 36 }} />
        </View>

        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accentLight} />
          <Text style={styles.loadingText}>Carregando pet...</Text>
        </View>
      </View>
    );
  }

  if (isEditing && !loading && !pet) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>

          <Text style={styles.title}>Editar Pet</Text>

          <View style={{ width: 36 }} />
        </View>

        <View style={styles.center}>
          <Text style={styles.loadingText}>
            {error ?? "Pet não encontrado."}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons
        name="paw"
        size={110}
        color={alpha(Colors.textLight, 0.06)}
        style={styles.pawWatermark}
      />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.title}>
          {isEditing ? "Editar Pet" : "Novo Pet"}
        </Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarArea}>
          <TouchableOpacity
            style={styles.avatarWrap}
            activeOpacity={0.8}
            onPress={handlePickPhoto}
          >
            <View style={styles.avatar}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons
                  name={
                    species === "Gato"
                      ? "happy"
                      : species === "Pássaro"
                        ? "sunny"
                        : "paw"
                  }
                  size={40}
                  color={Colors.textLight}
                />
              )}
            </View>

            <View style={styles.avatarCameraBadge}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.avatarHint}>
            {name.trim() ? name : "Novo pet"}
          </Text>

          <Text style={styles.avatarHintSmall}>
            {photoUri
              ? "Toque para trocar a foto"
              : "Toque para adicionar uma foto"}
          </Text>
        </View>

        <Text style={styles.label}>Nome *</Text>

        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Ex: Thor, Luna..."
          placeholderTextColor={Colors.textLight}
          value={name}
          onChangeText={(v) => {
            setName(v);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
        />
        {errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}

        <Text style={styles.label}>Espécie *</Text>

        <View style={styles.chipRow}>
          {SPECIES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, species === s && styles.chipSelected]}
              onPress={() => {
                setSpecies(s);
                setErrors((prev) => ({ ...prev, species: "" }));
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  species === s && styles.chipTextSelected,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.species ? (
          <Text style={styles.errorText}>{errors.species}</Text>
        ) : null}

        <Text style={styles.label}>Raça</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Labrador, Persa..."
          placeholderTextColor={Colors.textLight}
          value={breed}
          onChangeText={setBreed}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Data de nascimento</Text>

            <TextInput
              style={[styles.input, errors.birthDate && styles.inputError]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={Colors.textLight}
              value={birthDate}
              onChangeText={(v) => {
                setBirthDate(v);
                setErrors((prev) => ({ ...prev, birthDate: "" }));
              }}
            />
            {errors.birthDate ? (
              <Text style={styles.errorText}>{errors.birthDate}</Text>
            ) : null}
          </View>

          <View style={{ width: 12 }} />

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Peso (kg)</Text>

            <TextInput
              style={[styles.input, errors.weight && styles.inputError]}
              placeholder="Ex: 12.5"
              placeholderTextColor={Colors.textLight}
              value={weight}
              onChangeText={(v) => {
                setWeight(v);
                setErrors((prev) => ({ ...prev, weight: "" }));
              }}
              keyboardType="decimal-pad"
            />
            {errors.weight ? (
              <Text style={styles.errorText}>{errors.weight}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
          )}

          <Text style={styles.saveBtnText}>
            {saving
              ? "Salvando..."
              : isEditing
                ? "Salvar Alterações"
                : "Salvar Pet"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
