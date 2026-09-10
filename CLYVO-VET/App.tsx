import React from "react";
import { LogBox, Platform, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";

import { AuthProvider } from "./src/contexts/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { navigationRef } from "./src/navigation/navigationRef";
import { Colors } from "./src/styles/colors";

// Necessário para o fluxo de login com Google (expo-auth-session) fechar
// corretamente a aba/janela de autenticação ao redirecionar de volta ao app.
WebBrowser.maybeCompleteAuthSession();

const isWeb = Platform.OS === "web";

export default function App() {
  LogBox.ignoreAllLogs();

  const app = (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );

  if (!isWeb) return app;

  // O layout inteiro foi desenhado para largura de celular. Sem esse limite,
  // no navegador cada tela estica pela janela inteira — inclusive faixas de
  // cor sólida (como o cabeçalho do detalhe do pet), que viram uma barra
  // enorme e desproporcional. Aqui só restringimos a largura visível a algo
  // parecido com um celular; a lógica do app continua igual.
  return (
    <View style={styles.webBackdrop}>
      <View style={styles.webFrame}>{app}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  webBackdrop: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },

  webFrame: {
    flex: 1,
    width: "100%",
    maxWidth: 460,
    overflow: "hidden",
  },
});
