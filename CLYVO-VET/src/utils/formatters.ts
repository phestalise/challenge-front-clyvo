export const formatarData = (data: string): string => {
  if (!data) return "—";
  const partes = data.split("-");
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
  return data;
};

export const formatarHorario = (horario: string): string => {
  if (!horario) return "—";
  return horario.length === 5 ? horario : horario.slice(0, 5);
};

export const obterCorStatus = (status: string): string => {
  switch (status) {
    case "done":
    case "ativo":
    case "ok":
      return "#2ECC71";
    case "pendente":
    case "agendada":
      return "#F39C12";
    case "cancelada":
    case "inativo":
      return "#E74C3C";
    default:
      return "#1A6EBD";
  }
};

export const obterTextoStatus = (status: string): string => {
  switch (status) {
    case "done":
      return "Aplicada";
    case "pendente":
      return "Pendente";
    case "ativo":
      return "Em uso";
    case "inativo":
      return "Concluído";
    case "agendada":
      return "Agendada";
    case "cancelada":
      return "Cancelada";
    default:
      return status;
  }
};

// Recebe a data de nascimento no formato DD/MM/AAAA (mesmo padrão usado nos
// campos de data de vacina/medicamento) e calcula a idade — o banco guarda
// DATA_NASC, não idade pronta, então isso substitui o campo "age" antigo.
export const calcularIdadeTexto = (dataNascimento: string): string => {
  if (!dataNascimento) return "—";

  const partes = dataNascimento.split("/");
  if (partes.length !== 3) return dataNascimento;

  const [dia, mes, ano] = partes.map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  if (isNaN(nascimento.getTime())) return dataNascimento;

  const hoje = new Date();
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  let meses = hoje.getMonth() - nascimento.getMonth();

  if (hoje.getDate() < nascimento.getDate()) meses -= 1;
  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }

  if (anos < 1) {
    return meses <= 0
      ? "Recém-nascido"
      : `${meses} ${meses === 1 ? "mês" : "meses"}`;
  }
  return `${anos} ${anos === 1 ? "ano" : "anos"}`;
};

export const primeiroNome = (nome: string): string =>
  nome?.split(" ")[0] ?? "Tutor";
