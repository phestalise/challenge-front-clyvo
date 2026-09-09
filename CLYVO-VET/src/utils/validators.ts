export const validarEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validarTelefone = (tel: string): boolean =>
  tel.replace(/\D/g, "").length >= 10;

export const validarCampoObrigatorio = (valor: string): boolean =>
  valor.trim().length > 0;

export const validarSenha = (senha: string): boolean => senha.length >= 6;

export interface ErrosFormulario {
  [campo: string]: string;
}

export const validarFormularioUsuario = (form: {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}): ErrosFormulario => {
  const erros: ErrosFormulario = {};
  if (!validarCampoObrigatorio(form.name)) erros.name = "Nome é obrigatório";
  if (!validarEmail(form.email)) erros.email = "E-mail inválido";
  if (!validarTelefone(form.phone)) erros.phone = "Telefone inválido";
  if (!validarCampoObrigatorio(form.address))
    erros.address = "Endereço obrigatório";
  if (!validarSenha(form.password)) erros.password = "Mínimo 6 caracteres";
  if (form.password !== form.confirmPassword)
    erros.confirmPassword = "Senhas não conferem";
  return erros;
};

export const validarDataBr = (data: string): boolean =>
  /^\d{2}\/\d{2}\/\d{4}$/.test(data);

export const validarFormularioPet = (form: {
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  weight: string;
}): ErrosFormulario => {
  const erros: ErrosFormulario = {};
  if (!validarCampoObrigatorio(form.name)) erros.name = "Nome obrigatório";
  if (!validarCampoObrigatorio(form.species))
    erros.species = "Espécie obrigatória";
  if (!validarCampoObrigatorio(form.breed)) erros.breed = "Raça obrigatória";
  if (!validarCampoObrigatorio(form.birthDate)) {
    erros.birthDate = "Data de nascimento obrigatória";
  } else if (!validarDataBr(form.birthDate)) {
    erros.birthDate = "Use o formato DD/MM/AAAA";
  }
  if (!validarCampoObrigatorio(form.weight)) erros.weight = "Peso obrigatório";
  return erros;
};
