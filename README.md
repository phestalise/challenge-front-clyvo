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
- TanStack Query (cache, loading e atualização automática dos dados da API)
- expo-notifications (lembretes locais de vacina, medicamento e retorno)
- Tema claro/escuro (escolhido no Perfil e salvo no aparelho)

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
cd CLYVO-VET
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
├── config/       # api, queryClient (TanStack Query), buildInfo (commit)
├── contexts/     # AuthContext
├── hooks/        # usePets, usePet, useVaccines, useMedications (TanStack
│                 # Query), useHealthReminders, useNotificationNavigation
├── navigation/   # RootNavigator, MainTabs
├── screens/      # auth/ pet/ health/ dashboard/ profile/ (inclui About)
├── services/     # apiClient, TutorService, PetService, AuthService (Firebase),
│                 # NotificationService (notificações locais)
├── styles/       # 1 arquivo de estilo por tela/componente (usam o tema)
├── theme/        # paletas clara/escura, ThemeProvider, makeStyles
├── types/        # tipos do domínio e da API
└── utils/        # validators, formatters, assistant, etc.
```

## Funcionalidades

- **Autenticação**: cadastro/login por e-mail e senha (direto na API) ou com
  Google (via Firebase).
- **Pets**: CRUD completo (criar, listar, ver detalhes, editar, remover).
- **Saúde**: vacinas e medicamentos por pet, calendário de saúde e
  pendências.
- **Chat**: assistente que responde com os dados reais do tutor (vacinas,
  medicamentos, retornos e pendências); o histórico é salvo localmente.
- **Notificações locais**: ao cadastrar uma vacina, um medicamento ou um
  retorno, o app agenda lembretes para o dia anterior e para o dia do
  vencimento (9h). Se o vencimento é hoje/amanhã, o aviso chega em segundos.
  Tocar na notificação abre a tela correspondente (Vacinas, Medicamentos ou
  Saúde). Os lembretes são sincronizados com os dados da API e cancelados ao
  concluir/remover o registro ou ao sair da conta.
- **Tema claro e escuro**: o app abre no tema claro; o usuário pode trocar para
  o escuro em Perfil > Aparência e a escolha fica salva no aparelho.
- **Sobre o app**: Perfil > Sobre o app mostra versão e o **hash do commit** do
  código usado para gerar o APK publicado.

## Publicação (Sprint 4)

O app é distribuído por **Firebase App Distribution** (APK Android gerado com
EAS Build). O hash do commit exibido em "Sobre o app" é injetado no build por
`app.config.js`, então ele sempre corresponde ao código do repositório.

```bash
# 1. commitar tudo (o hash exibido é o do HEAD)
git add . && git commit -m "..."

# 2. gerar o APK (a partir da pasta CLYVO-VET)
npm install -g eas-cli
eas login
eas build --platform android --profile preview

# 3. baixar o .apk e enviar ao Firebase App Distribution
firebase appdistribution:distribute ./clyvo-vet.apk \
  --app <ID_DO_APP_ANDROID_NO_FIREBASE> \
  --testers "email.do.professor@fiap.com.br"
```

Pacote Android: `com.clyvo.vet` (deve ser o mesmo cadastrado no app Android do
projeto Firebase). Link de distribuição / convite do tester: preencher abaixo.

- Link do app no Firebase App Distribution: _(preencher)_
- Commit da versão publicada: _(preencher com o hash exibido em "Sobre o app")_

## Observações sobre a integração com a API

- A API roda em plano gratuito (Render) e dorme quando ociosa, então o app
  poupa requisições: o cache do TanStack Query dura 5 minutos, não há
  refetch por foco de tela, e cada escrita (criar/editar/remover vacina ou
  medicamento) é **uma única chamada** — o cache é atualizado com o resultado.
  Para forçar a atualização, puxe a tela para baixo.

- A API não tem colunas `IDENTITY`: os IDs de tutor/pet/medicação são gerados
  no front (número aleatório positivo) antes do cadastro.
- A tabela `MEDICACAO` não distingue vacina de remédio nem guarda status
  (concluído/ativo) — esse metadado é mantido só no front e mesclado com os
  dados da API na leitura.
