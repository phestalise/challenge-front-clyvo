import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { buildInfo } from "../../config/buildInfo";
import { useTheme } from "../../theme";

import { useAboutScreenStyles } from "../../styles/AboutScreen.styles";

const TEAM = [
  "Emanuel Italo (RM561337)",
  "Gabriel Bebe (RM562012)",
  "Paulo Estalise (RM563811)",
  "Matheus De Almeida (RM563557)",
  "Enzo Monteiro (RM563734)",
];

const formatBuildDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "—";

export default function AboutScreen() {
  const styles = useAboutScreenStyles();
  const { colors: Colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sobre o app</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Ionicons name="paw" size={34} color={Colors.primary} />
          </View>

          <Text style={styles.appName}>{buildInfo.appName}</Text>

          <Text style={styles.tagline}>
            Acompanhe a saúde do seu pet: vacinas, medicamentos e lembretes.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Versão instalada</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Versão</Text>
            <Text style={styles.rowValue}>{buildInfo.version}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Gerado em</Text>
            <Text style={styles.rowValue}>
              {formatBuildDate(buildInfo.buildDate)}
            </Text>
          </View>

          <View style={styles.commitBox}>
            <Text style={styles.rowLabel}>Commit de referência</Text>

            <Text style={styles.commitShort} selectable>
              {buildInfo.commitShort}
            </Text>

            <Text style={styles.commitFull} selectable>
              {buildInfo.commitHash}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Equipe</Text>

          {TEAM.map((member) => (
            <Text key={member} style={styles.member}>
              {member}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tecnologias</Text>

          <Text style={styles.text}>
            Expo, React Native e TypeScript · React Navigation · TanStack Query
            · Firebase Authentication · Notificações locais (expo-notifications)
            · API .NET com banco Oracle.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
