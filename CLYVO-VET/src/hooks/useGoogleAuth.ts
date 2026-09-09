import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "../services/firebase";
import { useAuth } from "./useAuth";

export function useGoogleAuth() {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const promptGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken ?? (await result.user.getIdToken());
      await loginWithGoogle(idToken);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { promptGoogleSignIn, isReady: true, loading };
}
