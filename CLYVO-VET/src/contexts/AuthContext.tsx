import React, {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";
import { User as FirebaseUser } from "firebase/auth";

import { authService } from "../services/AuthService";
import { tutorService } from "../services/TutorService";
import { storageService } from "../services/StorageService";
import { tokenStore } from "../services/tokenStore";
import { ApiError } from "../services/apiClient";
import { notificationService } from "../services/NotificationService";
import { queryClient } from "../config/queryClient";
import { gerarCpfPlaceholder } from "../utils/cpf";
import { ApiTutor } from "../types/api";

// Cadastro/login "normal" (e-mail e senha) fala direto com a API/Oracle
// (tabela TUTOR), seguindo o padrão do banco (nome, email, telefone, cpf,
// senha). O Firebase fica só para permitir entrar/cadastrar com o Google —
// nesse caso sincronizamos um Tutor correspondente na API por baixo dos
// panos, já que todo Pet/Consulta/Medicação exige um IdTutor numérico.
export type AuthUser = {
  id: string; // idTutor da API, usado como Pet.ownerId
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  provider: "google" | "local";
};

type AuthContextValue = {
  user: AuthUser | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    cpf: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateEmailAddress: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshEmailVerified: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
};

const SESSION_KEY = "@clyvo:session";
const TOKEN_KEY = "@clyvo:token";

function mapTutorToUser(
  tutor: ApiTutor,
  provider: AuthUser["provider"],
): AuthUser {
  return {
    id: String(tutor.idTutor),
    name: tutor.nome,
    email: tutor.email,
    // A API não tem verificação de e-mail própria; só o fluxo Firebase
    // (Google) usa essa checagem, então contas locais já entram verificadas.
    emailVerified: true,
    provider,
  };
}

async function persistSession(user: AuthUser | null): Promise<void> {
  await storageService.saveData(SESSION_KEY, user ? JSON.stringify(user) : "");
}

async function readSession(): Promise<AuthUser | null> {
  const raw = await storageService.getData(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Resolve o Tutor correspondente a uma conta Google e obtém um JWT da API.
// Usa credenciais sintéticas (geradas a partir do uid do Firebase) para o
// fluxo de login/cadastro na API Oracle, já que o Google não fornece CPF/senha.
async function resolveGoogleTutor(
  firebaseUser: FirebaseUser,
): Promise<{ user: AuthUser; token: string }> {
  const email = firebaseUser.email ?? `${firebaseUser.uid}@google.local`;
  const senha = gerarCpfPlaceholder(`senha:${firebaseUser.uid}`);

  let tutor: ApiTutor;
  let token: string;

  try {
    // Tenta logar com as credenciais sintéticas (conta já existe)
    const loginData = await tutorService.login(email, senha, true);
    token = loginData.jwt;
    tokenStore.set(token);

    const cachedId = await tutorService.getCachedGoogleTutorId(firebaseUser.uid);
    if (cachedId) {
      tutor = await tutorService.getById(cachedId);
    } else {
      const found = await tutorService.findByEmail(email);
      if (!found) throw new ApiError("Tutor não encontrado", 404);
      tutor = found;
      await tutorService.cacheGoogleTutorId(firebaseUser.uid, tutor.idTutor);
    }
  } catch (err) {
    // Conta ainda não existe na API: cria o tutor (endpoint público) e faz login
    if (err instanceof ApiError && (err.status === 401 || err.status === 400 || err.status === 404 || err.status === 409)) {
      // 409 na tentativa de login (senha sintética errada) também cai aqui;
      // tentamos registrar — se o e-mail já existe com outra senha a API
      // retorna 409 e sinalizamos ao chamador com status 409 limpo.
      try {
        tutor = await tutorService.register({
          nome: firebaseUser.displayName ?? "Usuário Google",
          email,
          telefone: firebaseUser.phoneNumber ?? null,
          cpf: gerarCpfPlaceholder(firebaseUser.uid),
          senha,
        }, true);
      } catch (registerErr) {
        if (registerErr instanceof ApiError && registerErr.status === 409) {
          // E-mail já existe na API com senha diferente da sintética — o usuário
          // criou a conta manualmente antes de usar o Google. Não temos como
          // obter o token sem a senha original; sinalizamos com 409 para que o
          // chamador mostre a mensagem correta.
          throw new ApiError(
            "Este e-mail já está cadastrado com senha. Use e-mail e senha para entrar.",
            409,
          );
        }
        throw registerErr;
      }
      await tutorService.cacheGoogleTutorId(firebaseUser.uid, tutor.idTutor);

      const loginData = await tutorService.login(email, senha, true);
      token = loginData.jwt;
      tokenStore.set(token);
    } else {
      throw err;
    }
  }

  return { user: mapTutorToUser(tutor, "google"), token };
}

// Decodifica o payload do JWT (só base64 — sem verificar assinatura).
// Tenta extrair o idTutor de claims comuns usados em APIs Spring Boot.
function extractTutorIdFromJwt(token: string): number | null {
  try {
    const raw = token.startsWith("Bearer ") ? token.slice(7) : token;
    const payload = raw.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    const id = decoded.idTutor ?? decoded.id ?? decoded.sub;
    const num = Number(id);
    return Number.isFinite(num) && num > 0 ? num : null;
  } catch {
    return null;
  }
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const userRef = useRef<AuthUser | null>(null);
  userRef.current = user;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Restaura o JWT antes de qualquer chamada a endpoint protegido
      const savedToken = await storageService.getData(TOKEN_KEY);
      if (savedToken) tokenStore.set(savedToken);

      const cached = await readSession();

      if (cached?.provider === "local") {
        // O tutor pode ter sumido da API (ex: banco reiniciado) mesmo com a
        // sessão ainda salva localmente — sem essa checagem o app fica
        // "logado" com um ownerId que não existe mais e os pets somem sem
        // nenhum aviso.
        try {
          await tutorService.getById(Number(cached.id));
          if (!cancelled) setUser(cached);
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            // Token expirado: descarta a sessão e pede novo login
            if (!cancelled) {
              tokenStore.set(null);
              setUser(null);
              await persistSession(null);
              await storageService.saveData(TOKEN_KEY, "");
            }
          } else if (err instanceof ApiError && err.status === 404) {
            if (!cancelled) {
              tokenStore.set(null);
              setUser(null);
              await persistSession(null);
              await storageService.saveData(TOKEN_KEY, "");
            }
          } else if (!cancelled) {
            // Falha de rede/API fora do ar: mantém a sessão local em vez de
            // deslogar por causa de indisponibilidade temporária.
            setUser(cached);
          }
        } finally {
          if (!cancelled) setInitializing(false);
        }
        return;
      }

      // Sem sessão local: o estado depende do Firebase (login com Google).
      authService.onAuthStateChanged(async (firebaseUser) => {
        if (cancelled) return;

        // Se o usuário já entrou via e-mail/senha nesta sessão, o callback do
        // Firebase não deve sobrescrever nem limpar a sessão local — os dois
        // fluxos são independentes.
        if (userRef.current?.provider === "local") {
          setInitializing(false);
          return;
        }

        if (!firebaseUser) {
          setUser(null);
          await persistSession(null);
          setInitializing(false);
          return;
        }

        try {
          const { user: resolved, token } = await resolveGoogleTutor(firebaseUser);
          if (!cancelled) {
            tokenStore.set(token);
            await storageService.saveData(TOKEN_KEY, token);
            setUser(resolved);
            await persistSession(resolved);
          }
        } catch (err) {
          if (!(err instanceof ApiError && err.status === 409)) {
            console.warn("Não foi possível sincronizar o tutor do Google:", err);
          }
          if (!cancelled) {
            // userRef pode ter mudado durante o await (login por e-mail
            // concluído no meio da sincronização), por isso lê de novo.
            const providerAgora: AuthUser["provider"] | undefined =
              (userRef.current as AuthUser | null)?.provider;
            if (providerAgora !== "local") {
              setUser(null);
            }
            if (err instanceof ApiError && err.status === 409) {
              // Desconecta o Firebase para não repetir o ciclo 401→409 na
              // próxima abertura do app.
              try { await authService.logout(); } catch {}
              Alert.alert(
                "E-mail já cadastrado",
                "Este e-mail já está registrado com e-mail e senha. Por favor, entre usando e-mail e senha na tela de login.",
              );
            }
          }
        } finally {
          if (!cancelled) setInitializing(false);
        }
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    // 1. Faz login na API e recebe o JWT
    const loginData = await tutorService.login(email, password);
    const token = loginData.jwt;
    tokenStore.set(token);
    await storageService.saveData(TOKEN_KEY, token);

    // 2. Tenta obter o idTutor em ordem crescente de custo:
    //    a) claims do JWT
    //    b) cache local (populado no register/login anteriores)
    const tutorId =
      extractTutorIdFromJwt(token) ??
      (await tutorService.getCachedEmailTutorId(email));

    let tutor: ApiTutor;
    if (tutorId) {
      tutor = await tutorService.getById(tutorId);
    } else {
      const found = await tutorService.findByEmail(email);
      if (!found) throw new ApiError("Tutor não encontrado após login.", 404);
      tutor = found;
    }
    await tutorService.cacheEmailTutorId(email, tutor.idTutor);

    const authUser = mapTutorToUser(tutor, "local");
    setUser(authUser);
    await persistSession(authUser);
  };

  const loginWithGoogle = async (idToken: string) => {
    await authService.loginWithGoogle(idToken);
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    cpf: string,
    password: string,
  ) => {
    // Cadastra o tutor (endpoint público, sem JWT) — já retorna o objeto completo
    const tutor = await tutorService.register({
      nome: name.trim(),
      email: email.trim().toLowerCase(),
      telefone: phone.trim() || null,
      cpf,
      senha: password,
    }, true);
    // Persiste o mapeamento email→idTutor para que o login subsequente não
    // precise chamar GET /api/tutors (endpoint de admin → 401 para usuário comum).
    await tutorService.cacheEmailTutorId(email.trim().toLowerCase(), tutor.idTutor);

    // Faz login para obter o JWT
    const loginData = await tutorService.login(
      email.trim().toLowerCase(),
      password,
    );
    const token = loginData.jwt;
    if (!token) throw new ApiError("Login após cadastro não retornou token. Tente fazer login manualmente.", 401);
    tokenStore.set(token);
    await storageService.saveData(TOKEN_KEY, token);

    const tutorId = extractTutorIdFromJwt(token);
    const validatedTutor = tutorId
      ? await tutorService.getById(tutorId)
      : tutor;

    const authUser = mapTutorToUser(validatedTutor, "local");
    setUser(authUser);
    await persistSession(authUser);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // sessão local não usa Firebase — nada para encerrar lá
    }

    tokenStore.set(null);
    await storageService.saveData(TOKEN_KEY, "");
    setUser(null);
    await persistSession(null);

    // Dados em cache e lembretes agendados pertencem à conta que saiu.
    queryClient.clear();
    await notificationService.cancelAll().catch(() => {});
  };

  const updateName = async (name: string) => {
    const current = userRef.current;
    if (!current) return;

    if (current.provider === "google") {
      await authService.updateName(name);
    }

    await tutorService.update(Number(current.id), { nome: name.trim() });

    const updated = { ...current, name: name.trim() };
    setUser(updated);
    await persistSession(updated);
  };

  const updateEmailAddress = async (email: string) => {
    const current = userRef.current;
    if (!current) return;

    if (current.provider === "google") {
      await authService.updateEmailAddress(email);
    }

    await tutorService.update(Number(current.id), {
      email: email.trim().toLowerCase(),
    });

    const updated = { ...current, email: email.trim().toLowerCase() };
    setUser(updated);
    await persistSession(updated);
  };

  const sendVerificationEmail = async () => {
    await authService.sendVerificationEmail();
  };

  const refreshEmailVerified = async () => {
    const refreshedUser = await authService.reloadUser();
    return refreshedUser.emailVerified;
  };

  const resetPassword = async (email: string) => {
    // A API não tem redefinição de senha própria; isso só funciona para
    // contas que entraram com Google (Firebase).
    await authService.resetPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        login,
        loginWithGoogle,
        register,
        logout,
        updateName,
        updateEmailAddress,
        sendVerificationEmail,
        refreshEmailVerified,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
