import { createNavigationContainerRef } from "@react-navigation/native";

import { RootStackParamList } from "../types";

// Permite navegar (e ler a rota ativa) a partir de componentes que ficam
// fora da árvore dos Navigators — como a barra de navegação fixa, que
// agora é renderizada ao lado do Stack.Navigator, não dentro dele.
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
