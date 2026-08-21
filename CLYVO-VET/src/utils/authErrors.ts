export function mapFirebaseAuthError(code: unknown): string {
  switch (code) {
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-mail ou senha incorretos.";
    case "auth/email-already-in-use":
      return "Já existe uma conta com esse e-mail.";
    case "auth/weak-password":
      return "A senha precisa ter pelo menos 6 caracteres.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente em instantes.";
    case "auth/requires-recent-login":
      return "Por segurança, saia e entre novamente antes de alterar o e-mail.";
    case "auth/network-request-failed":
      return "Falha de conexão. Verifique sua internet.";
    default:
      return "Não foi possível concluir a operação. Tente novamente.";
  }
}
