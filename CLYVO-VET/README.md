# CLYVO VET

Aplicativo mobile de gestão de saúde para pets, desenvolvido em React Native com Expo. Permite gerenciar consultas, medicações, vacinas e lembretes de saúde dos seus animais de estimação.

## Funcionalidades

- **Autenticação** — cadastro e login com e-mail/senha ou Google (Firebase)
- **Gestão de Pets** — cadastro, edição e remoção de pets com foto
- **Consultas** — registro de histórico de consultas veterinárias
- **Medicações** — controle de medicamentos e doses
- **Lembretes** — notificações locais automáticas para saúde dos pets
- **Calendário de Saúde** — visualização de eventos por data
- **Perfil** — edição de dados do tutor
- **Sobre o App** — versão, build, commit hash e tecnologias utilizadas

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo SDK 53 |
| Linguagem | TypeScript |
| Navegação | React Navigation v7 |
| Estado/Cache | TanStack Query v5 |
| Autenticação | Firebase Auth + API REST |
| Notificações | expo-notifications |
| Armazenamento local | AsyncStorage |
| Backend | API .NET/C# (Render) |
| Build | EAS Build |
| Distribuição | Firebase App Distribution |

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)

### Instalação

```bash
cd CLYVO-VET
npm install
```

### Iniciar no web

```bash
npx expo start --web
```

### Iniciar no Android/iOS

```bash
npx expo start
```
Escaneie o QR code com o app **Expo Go** no celular.

## Estrutura do projeto

```
src/
├── screens/          # Telas da aplicação
│   ├── auth/         # Login, cadastro, boas-vindas
│   ├── dashboard/    # Tela inicial
│   ├── pet/          # Listagem e detalhes de pets
│   ├── health/       # Consultas, medicações, calendário
│   └── profile/      # Perfil e sobre o app
├── contexts/         # AuthContext (sessão do usuário)
├── services/         # Integração com API e Firebase
├── hooks/            # Hooks reutilizáveis
├── navigation/       # Configuração de rotas
├── components/       # Componentes compartilhados
├── styles/           # Estilos e tema
├── types/            # Tipos TypeScript da API
└── utils/            # Funções utilitárias
```

## Variáveis de ambiente

O projeto não usa `.env` — as credenciais públicas do Firebase estão em `src/services/firebase.ts` (configuração de app cliente, protegida pelas regras do Firebase).

## Build e distribuição

O APK é gerado via **EAS Build** e distribuído pelo **Firebase App Distribution**.

```bash
# Gerar APK (perfil preview)
eas build --profile preview --platform android

# Distribuir para testers
firebase appdistribution:distribute <apk> \
  --app 1:366192133380:android:0184ab1a72e440b9a6fc51 \
  --project clyvo-vet-a0a28 \
  --testers "email@example.com"
```

## Sprint 4 — Entregas

- [x] Tela "Sobre o App" com commit hash e data do build
- [x] Notificações locais para lembretes de saúde dos pets
- [x] Login com Google via Firebase Auth
- [x] Build publicado no Firebase App Distribution
- [x] APK distribuído para avaliação

## Time

Desenvolvido por **Paulo Estalise** — FIAP  
Projeto: Challenge Front-End — Sprint 4
