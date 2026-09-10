import React, {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { User as FirebaseUser } from "firebase/auth";

import { authService } from "../services/AuthService";
import { tutorService } from "../services/TutorService";
import { storageService } from "../services/StorageService";
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

// Resolve o Tutor correspondente a uma conta Google: usa o cache local se
// já existir, senão procura por e-mail na API e, se ainda não existir,
// cria um Tutor novo com CPF/senha sintéticos (o Google não coleta isso).
async function resolveGoogleTutor(
  firebaseUser: FirebaseUser,
): Promise<AuthUser> {
  const cachedId = await tutorService.getCachedGoogleTutorId(firebaseUser.uid);
  if (cachedId) {
    const tutor = await tutorService.getById(cachedId);
    return mapTutorToUser(tutor, "google");
  }

  const email = firebaseUser.email ?? `${firebaseUser.uid}@google.local`;
  let tutor = await tutorService.findByEmail(email);

  if (!tutor) {
    tutor = await tutorService.register({
      nome: firebaseUser.displayName ?? "Usuário Google",
      email,
      telefone: firebaseUser.phoneNumber ?? null,
      cpf: gerarCpfPlaceholder(firebaseUser.uid),
      senha: gerarCpfPlaceholder(`senha:${firebaseUser.uid}`),
    });
  }

  await tutorService.cacheGoogleTutorId(firebaseUser.uid, tutor.idTutor);

  return mapTutorToUser(tutor, "google");
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
      const cached = await readSession();

      if (cached?.provider === "local") {
        if (!cancelled) {
          setUser(cached);
          setInitializing(false);
        }
        return;
      }

      // Sem sessão local: o estado depende do Firebase (login com Google).
      authService.onAuthStateChanged(async (firebaseUser) => {
        if (cancelled) return;

        if (!firebaseUser) {
          setUser(null);
          await persistSession(null);
          setInitializing(false);
          return;
        }

        try {
          const resolved = await resolveGoogleTutor(firebaseUser);
          setUser(resolved);
          await persistSession(resolved);
        } catch (err) {
          // Sem API (CORS, rede etc.) não dá pra resolver o tutor do Google —
          // cai pro fluxo de login em vez de deixar a promise sem tratamento.
          console.warn("Não foi possível sincronizar o tutor do Google:", err);
          setUser(null);
        } finally {
          setInitializing(false);
        }
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const tutor = await tutorService.login(email, password);
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
    const tutor = await tutorService.register({
      nome: name.trim(),
      email: email.trim().toLowerCase(),
      telefone: phone.trim() || null,
      cpf,
      senha: password,
    });

    const authUser = mapTutorToUser(tutor, "local");
    setUser(authUser);
    await persistSession(authUser);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // sessão local não usa Firebase — nada para encerrar lá
    }

    setUser(null);
    await persistSession(null);
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
