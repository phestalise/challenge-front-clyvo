// Armazena o JWT em memória para que o apiClient possa acessá-lo
// de forma síncrona sem precisar de AsyncStorage a cada request.
let _token: string | null = null;

export const tokenStore = {
  get: () => _token,
  set: (token: string | null) => {
    _token = token;
  },
};
