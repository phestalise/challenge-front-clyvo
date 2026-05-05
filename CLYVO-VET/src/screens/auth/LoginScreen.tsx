import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../types";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";
import InputField from "../../components/InputField";
import { styles } from "../../styles/Loginscreen.styles";

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, "Login"> };

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(cardAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "E-mail obrigatório";
    if (!password.trim()) e.password = "Senha obrigatória";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const user = await storageService.getUser();
      if (user && user.email === email.toLowerCase().trim()) {
        await storageService.setLoggedIn(true);
        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
      } else {
        Alert.alert("Erro", "Conta não encontrada. Crie uma conta primeiro.");
      }
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.orb} />
          <View style={styles.orbBottom} />

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <Ionicons name="paw" size={14} color={Colors.accentLight} />
              <Text style={styles.logo}>CLYVO VET</Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>ENTRAR</Text>
              </View>
            </View>
            <Text style={styles.title}>Bem-vindo{"\n"}de volta 👋</Text>
            <Text style={styles.sub}>Acesse sua conta para continuar{"\n"}cuidando do seu pet</Text>
          </Animated.View>

          <Animated.View style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: cardAnim }] }]}>
            <InputField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seu@email.com"
              icon={<Ionicons name="mail-outline" size={18} color={Colors.textSecondary} />}
            />
            <View style={styles.dividerField} />
            <InputField
              label="Senha"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              placeholder="••••••••"
              icon={<Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} />}
            />
            <View style={styles.forgotRow}>
              <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.6}>
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btnPrimary, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <Text style={styles.btnPrimaryText}>Entrando...</Text>
              ) : (
                <>
                  <Text style={styles.btnPrimaryText}>Entrar na conta</Text>
                  <View style={styles.btnArrow}>
                    <Ionicons name="arrow-forward" size={15} color={Colors.accentLight} />
                  </View>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.7}
            >
              <Text style={styles.btnSecondaryText}>Criar nova conta</Text>
            </TouchableOpacity>

            <View style={styles.trustRow}>
              <View style={styles.trustItem}>
                <Ionicons name="shield-checkmark-outline" size={12} color="rgba(255,255,255,0.3)" />
                <Text style={styles.trustText}>Seguro</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="lock-closed-outline" size={12} color="rgba(255,255,255,0.3)" />
                <Text style={styles.trustText}>Criptografado</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="heart-outline" size={12} color="rgba(255,255,255,0.3)" />
                <Text style={styles.trustText}>Privado</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}