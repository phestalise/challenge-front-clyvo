import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";

class AuthService {
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  async login(email: string, password: string): Promise<FirebaseUser> {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );

    return credential.user;
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<FirebaseUser> {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );

    await updateProfile(credential.user, { displayName: name.trim() });

    return credential.user;
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async updateName(name: string): Promise<void> {
    if (!auth.currentUser) throw new Error("Nenhum usuário autenticado.");

    await updateProfile(auth.currentUser, { displayName: name.trim() });
  }

  async updateEmailAddress(email: string): Promise<void> {
    if (!auth.currentUser) throw new Error("Nenhum usuário autenticado.");

    await updateEmail(auth.currentUser, email.trim().toLowerCase());
  }
}

export const authService = new AuthService();
