# CLYVO VET

Aplicativo mobile (Expo + React Native + TypeScript) para tutores acompanharem
a saúde de seus pets: cadastro de pets, vacinas, medicamentos, calendário de
saúde e um assistente de chat.

## Stack

- [Expo](https://expo.dev) / React Native 0.81 / React 19
- TypeScript (`strict: true`)
- [`@react-navigation`](https://reactnavigation.org) (native-stack + bottom-tabs)
- API real (ASP.NET Core + Oracle) em
  `https://clyvovet-api-nnke.onrender.com` para pets, consultas e
  medicamentos, e também para o cadastro/login "normal" (tabela `TUTOR`)
- Firebase Authentication usado **apenas** para entrar/cadastrar com o
  Google — o cadastro e login com e-mail/senha falam direto com a API,
  seguindo o padrão do banco (nome, e-mail, telefone, CPF, senha)

## Configuração do ambiente

As credenciais do Firebase e a URL da API ficam direto no código-fonte
(`src/services/firebase.ts` e `src/config/api.ts`) — não é preciso criar
`.env`. Basta instalar as dependências e rodar.

## Scripts

```bash
npm start        # expo start
npm run android  # expo start --android
npm run ios      # expo start --ios
npm run web       # expo start --web
npx tsc --noEmit  # checagem de tipos
```

## Estrutura do Projeto

```
src/
├── components/        # Componentes de UI reutilizáveis (cards, inputs)
├── contexts/           # AuthContext (estado de sessão do Firebase)
├── hooks/
│   ├── useAuth.ts       # acesso ao AuthContext
│   ├── usePets.ts       # lista de pets (loading/error/reload)
│   ├── usePet.ts        # um pet por id — leitura, salvar (create/update), remover
│   ├── useVaccines.ts   # pets + CRUD de vacinas (loading/error/saving)
│   └── useMedications.ts# pets + CRUD de medicamentos (loading/error/saving)
├── interfaces/         # Contratos (IPetService, IStorage)
├── navigation/
│   ├── RootNavigator.tsx # troca entre Auth / Verificação de e-mail / App
│   └── MainTabs.tsx      # tabs principais (Dashboard, Pets, Saúde, Calendário, Perfil)
├── screens/
│   ├── auth/            # Welcome, Login, Register, VerifyEmail
│   ├── pet/              # PetsScreen, AddPetScreen (create + edit), PetDetailScreen, PetChatScreen
│   ├── health/            # HealthTabScreen, Vaccines, Medications, HealthCalendar,
│   │                       AddHealthRecord, Pending
│   ├── dashboard/         # DashboardScreen
│   └── profile/           # ProfileScreen
├── services/
│   ├── firebase.ts        # inicialização do Firebase App/Auth (só login Google)
│   ├── AuthService.ts      # login com Google via Firebase
│   ├── TutorService.ts      # cadastro/login/CRUD de tutor na API real
│   ├── apiClient.ts         # wrapper de fetch para a API (erros, JSON)
│   ├── StorageService.ts    # persistência local (AsyncStorage) — chave/valor
│   ├── PetMetadataStore.ts  # metadado só-front (tipo vacina/remédio, done/active,
│   │                         próximo retorno) que a API ainda não tem coluna pra guardar
│   └── PetService.ts        # pets/vacinas/medicamentos via API real (Pets/Medicacoes)
├── styles/              # StyleSheets por tela/componente (PascalCase, 1:1 com a tela)
├── types/               # Pet, Vaccine, Medication, RootStackParamList, MainTabParamList
└── utils/
    ├── validators.ts     # validações de formulário (e-mail, senha, telefone, pet)
    ├── formatters.ts      # formatação de datas, idade, status
    ├── showAlert.ts        # Alert cross-platform (nativo + web)
    └── authErrors.ts        # mapeamento de erros do Firebase Auth para mensagens em pt-BR
```

As telas são organizadas por **domínio** (`auth`, `pet`, `health`, `dashboard`,
`profile`), não por "tipo" (não existe mais uma pasta `main/` genérica). Isso
evita duplicidade de nomes/telas e deixa explícito a que parte do app cada tela
pertence.

## Funcionalidades

### Autenticação
- **Cadastro/login normal** (e-mail e senha): fala direto com a API real,
  seguindo o padrão da tabela `TUTOR` do Oracle (`POST /api/tutors`,
  `POST /api/tutors/login`). Não depende do Firebase.
- **Login/cadastro com Google**: usa Firebase só para autenticar com a conta
  Google; por baixo dos panos, sincroniza (ou cria) um Tutor correspondente
  na API, já que todo Pet/Consulta/Medicação exige um `idTutor` numérico. O
  CPF e a senha desses tutores são gerados automaticamente (sintéticos, mas
  com dígito verificador válido), pois o Google não coleta esses dados.
- Rotas protegidas: sem sessão válida o usuário só acessa o fluxo de
  autenticação.

### Pets (CRUD completo)
- **Create**: `AddPetScreen` (modo criação) cadastra um novo pet.
- **Read**: `PetsScreen` lista os pets do tutor; `PetDetailScreen` mostra
  detalhes, vacinas e medicamentos de um pet.
- **Update**: `AddPetScreen` também funciona em **modo edição** — acessível
  pelo botão "Editar" em `PetDetailScreen` — carregando os dados existentes do
  pet, prefiltrando o formulário e salvando as alterações via
  `petService.save()`.
- **Delete**: botão de remover em `PetDetailScreen`.

### Saúde
- `HealthTabScreen`: visão geral de saúde de todos os pets.
- `VaccinesScreen` / `MedicationsScreen`: cadastro, marcação de concluído/ativo
  e remoção de vacinas e medicamentos.
- `HealthCalendarScreen`: calendário mensal com vacinas/medicamentos e lista de
  pendências.
- `AddHealthRecordScreen`: atalho para registrar vacina ou medicamento.
- `PendingScreen`: vacinas pendentes.

### Chat
- `PetChatScreen`: histórico de conversa persistido localmente.

## Hooks de acesso a dados

Toda a leitura/escrita de pets, vacinas e medicamentos passa por hooks
dedicados (`usePets`, `usePet`, `useVaccines`, `useMedications`) em vez de as
telas chamarem `storageService`/`petService` diretamente. Cada hook expõe:

- `pets` / `pet` — os dados;
- `loading` — carregamento em andamento (exibido com `ActivityIndicator` nas
  telas);
- `error` — mensagem de erro específica, exibida na própria tela;
- `saving` (quando aplicável) — estado de uma operação de escrita em
  andamento;
- funções de ação (`addVaccine`, `toggleDone`, `removeVaccine`, `save`,
  `remove`, `reload`, etc.) que retornam `boolean` indicando sucesso, para a
  tela decidir como reagir (ex: `showAlert` com mensagem específica em caso de
  falha).

Essa camada isola a UI da fonte de dados: o `PetService` já fala com a API
real (`/api/pets`, `/api/medicacoes`) por baixo dos hooks, sem precisar mudar
nenhuma tela.

## Validação de formulários

Os formulários (`AddPetScreen`, `RegisterScreen`, `LoginScreen`) usam as
funções de `src/utils/validators.ts` (`validarCampoObrigatorio`, `validarEmail`,
`validarTelefone`, `validarSenha`, `validarFormularioPet`,
`validarFormularioUsuario`) e exibem mensagens de erro específicas por campo,
em vez de apenas bloquear o envio silenciosamente.

## Integração com a API real

`PetService` conversa com `https://clyvovet-api-nnke.onrender.com`
(`/api/pets`, `/api/consultas`, `/api/medicacoes`, `/api/tutors`). Alguns
pontos importantes dessa integração:

- A tabela `MEDICACAO` não distingue vacina de remédio nem guarda status
  (`done`/`active`) — isso continua existindo só no front, salvo localmente
  em `PetMetadataStore` e mesclado com os dados da API na leitura.
- IDs de pet/consulta/medicação são gerados no front (`Date.now()`, como já
  era feito para vacinas/medicamentos) porque a API exige um ID numérico
  maior que zero enviado pelo cliente, sem auto-incremento.
- `Pet.ownerId` agora é o `idTutor` (numérico, como string) em vez do uid do
  Firebase.

### Fora do escopo atual
- Endpoint de redefinição de senha para contas de cadastro normal (hoje só
  funciona para contas Google, via Firebase).
- Migração de contas antigas criadas só no Firebase (e-mail/senha) para a
  tabela `TUTOR` da API — o login normal agora é 100% API.
