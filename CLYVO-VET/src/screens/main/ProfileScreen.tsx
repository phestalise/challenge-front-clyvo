import React, { useCallback, useState } from "react";
import {
  View,
  Text,
 StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, User } from "../../types";
import { Colors } from "../../styles/colors";
import { storageService } from "../../services/StorageService";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const [user, setUser] = useState<User | null>(null);
  const [petsCount, setPetsCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [u, p] = await Promise.all([
        storageService.getUser(),
        storageService.getPets(),
      ]);

      setUser(u);
      setPetsCount(p.length);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await storageService.clearAll();

      navigation.navigate("Welcome" as never);
    } catch (error) {
      console.log("ERRO:", error);
      Alert.alert("Erro", "Não foi possível sair");
    }
  };

  const menu = [
    {
      icon: "person-outline",
      label: "Dados pessoais",
      sub: "Nome, e-mail e telefone",
      color: Colors.accent,
    },
    {
      icon: "notifications-outline",
      label: "Notificações",
      sub: "Lembretes e alertas",
      color: Colors.accentOrange,
    },
    {
      icon: "shield-outline",
      label: "Privacidade",
      sub: "Dados e segurança",
      color: Colors.accentGreen,
    },
    {
      icon: "help-circle-outline",
      label: "Ajuda & Suporte",
      sub: "FAQ e contato",
      color: "#9B59B6",
    },
    {
      icon: "information-circle-outline",
      label: "Sobre o CLYVO VET",
      sub: "Versão 1.0.0 — FIAP 2026",
      color: Colors.textSecondary,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </Text>
          </View>

          <View style={{ flex: 1, gap: 3 }}>
            <Text style={styles.profileName}>
              {user?.name ?? "Usuário"}
            </Text>

            <Text style={styles.profileMeta}>
              {user?.email ?? ""}
            </Text>

            <Text style={styles.profileMeta}>
              {user?.phone ?? ""}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{petsCount}</Text>
            <Text style={styles.statLabel}>Pets</Text>
          </View>

          <View style={styles.statDiv} />

          <View style={styles.stat}>
            <Text style={styles.statVal}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </Text>

            <Text style={styles.statLabel}>Membro desde</Text>
          </View>

          <View style={styles.statDiv} />

          <View style={styles.stat}>
            <Ionicons
              name="sparkles"
              size={18}
              color={Colors.accentLight}
            />

            <Text style={styles.statLabel}>IA Ativa</Text>
          </View>
        </View>

        {user?.address && (
          <View style={styles.addressCard}>
            <Ionicons
              name="location"
              size={16}
              color={Colors.accent}
            />

            <Text style={styles.addressText}>
              {user.address}
            </Text>
          </View>
        )}

        <View style={styles.menu}>
          {menu.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuItem,
                i === menu.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIcon,
                  {
                    backgroundColor: item.color + "18",
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.color}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>
                  {item.label}
                </Text>

                <Text style={styles.menuSub}>
                  {item.sub}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={15}
                color={Colors.textLight}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.banner}>
          <Ionicons
            name="paw"
            size={22}
            color={Colors.accentLight}
          />

          <View>
            <Text style={styles.bannerTitle}>
              CLYVO VET · Challenge FIAP 2026
            </Text>

            <Text style={styles.bannerSub}>
              Jornada Contínua do Responsável pelo Pet
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logout}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={19}
            color={Colors.accentRed}
          />

          <Text style={styles.logoutText}>
            Sair da conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.white,
  },

  scroll: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },

  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  avatar: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.white,
  },

  profileName: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
  },

  profileMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  statsRow: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  stat: {
    alignItems: "center",
    gap: 4,
  },

  statVal: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.text,
  },

  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  statDiv: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },

  addressCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  addressText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
  },

  menu: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  menuLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },

  menuSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  bannerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.white,
  },

  bannerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
  },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accentRed + "15",
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.accentRed + "30",
  },

  logoutText: {
    color: Colors.accentRed,
    fontSize: 15,
    fontWeight: "700",
  },
});