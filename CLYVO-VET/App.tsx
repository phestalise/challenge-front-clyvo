import React from "react";
import { LogBox, Platform, View, StyleSheet } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";

import { AuthProvider } from "./src/contexts/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { navigationRef } from "./src/navigation/navigationRef";
import { blurActiveElement } from "./src/utils/blurActiveElement";
import { queryClient } from "./src/config/queryClient";
import { notificationService } from "./src/services/NotificationService";
import { Colors, ThemeProvider, useTheme } from "./src/theme";

// Necessário para o fluxo de login com Google (expo-auth-session) fechar
// corretamente a aba/janela de autenticação ao redirecionar de volta ao app.
WebBrowser.maybeCompleteAuthSession();

// Define como as notificações aparecem com o app aberto e cria o canal Android.
notificationService.setup().catch(() => {});

const isWeb = Platform.OS === "web";

function ThemedNavigation() {
  const { scheme, colors } = useTheme();
  const base = scheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...base,
        colors: {
          ...base.colors,
          background: colors.primary,
          card: colors.primary,
          text: colors.text,
          border: colors.border,
          primary: colors.accentLight,
        },
      }}
      ref={navigationRef}
      // No web, o native-stack marca a tela que sai de foco com
      // aria-hidden, mas o botão que disparou a navegação continua com
      // o foco do navegador até esse blur — daí o aviso "Blocked
      // aria-hidden on an element because its descendant retained
      // focus" a cada troca de tela.
      onStateChange={blurActiveElement}
    >
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  LogBox.ignoreAllLogs();

  const app = (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemedNavigation />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
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
