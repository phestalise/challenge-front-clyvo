# CLYVO VET

Aplicativo mobile (Expo + React Native + TypeScript) para tutores acompanharem
a saúde de seus pets: cadastro de pets, vacinas, medicamentos, calendário de
saúde e um assistente de chat.

## Vídeo

https://youtu.be/wLfy-WGBx6s

## Integrantes

- Emanuel Italo (RM561337)
- Gabriel Bebe (RM562012)
- Paulo Estalise (RM563811)
- Matheus De Almeida (RM563557)
- Enzo Monteiro (RM563734)

## Stack

**Front-end**
- Expo / React Native / TypeScript
- React Navigation (native-stack + bottom-tabs)
- Firebase Authentication (somente para login/cadastro com Google)

**Back-end**
- API em **.NET (C#) com ASP.NET Core**, conectada a um banco **Oracle**
- Hospedada em `https://clyvovet-api-nnke.onrender.com`
- Endpoints principais: `/api/tutors`, `/api/pets`, `/api/consultas`,
  `/api/medicacoes`

Cadastro/login por e-mail e senha, pets, vacinas e medicamentos falam direto
com essa API. O Firebase entra em cena só no login/cadastro com Google,
sincronizando um tutor correspondente na API por trás dos panos.

## Rodando o projeto

Credenciais do Firebase e URL da API já estão no código-fonte
(`src/services/firebase.ts` e `src/config/api.ts`) — não precisa de `.env`.

```bash
git clone https://github.com/phestalise/challenge-front-clyvo-old.git
cd challenge-front-clyvo-old
npm install
npm start        # expo start
```

Outros scripts disponíveis:

```bash
npm run web       # expo start --web
npm run android
npm run ios
npx tsc --noEmit  # checagem de tipos
```

## Estrutura

```
src/
├── components/   # UI reutilizável (cards, inputs, tab bar)
├── contexts/     # AuthContext
├── hooks/        # usePets, usePet, useVaccines, useMedications, useAuth
├── navigation/   # RootNavigator, MainTabs
├── screens/      # auth/ pet/ health/ dashboard/ profile/
├── services/     # apiClient, TutorService, PetService, AuthService (Firebase)
├── styles/       # 1 arquivo de estilo por tela/componente
├── types/        # tipos do domínio e da API
└── utils/        # validators, formatters, etc.
```

## Funcionalidades

- **Autenticação**: cadastro/login por e-mail e senha (direto na API) ou com
  Google (via Firebase).
- **Pets**: CRUD completo (criar, listar, ver detalhes, editar, remover).
- **Saúde**: vacinas e medicamentos por pet, calendário de saúde e
  pendências.
- **Chat**: histórico de conversa com o assistente, salvo localmente.

## Observações sobre a integração com a API

- A API não tem colunas `IDENTITY`: os IDs de tutor/pet/medicação são gerados
  no front (número aleatório positivo) antes do cadastro.
- A tabela `MEDICACAO` não distingue vacina de remédio nem guarda status
  (concluído/ativo) — esse metadado é mantido só no front e mesclado com os
  dados da API na leitura.
