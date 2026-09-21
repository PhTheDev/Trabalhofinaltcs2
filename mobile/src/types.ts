export type IUsuario = {
  id: number;
  nomeCompleto: string;
  email: string;
  senhaHash: string;
  dataCadastro: string;
  role: 'aluno' | 'admin';
};

export type ICategoria = {
  id: number;
  nome: string;
  descricao: string;
};

export type ICurso = {
  id: number;
  titulo: string;
  descricao: string;
  idInstrutor: number;
  idCategoria: number;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  dataPublicacao: string;
  totalHoras: number;
  preco: number;
};

export type IModulo = {
  id: number;
  idCurso: number;
  titulo: string;
  ordem: number;
};

export type IAula = {
  id: number;
  idModulo: number;
  titulo: string;
  tipoConteudo: 'Vídeo' | 'Texto' | 'Quiz';
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
};

export type IMatricula = {
  id: number;
  idUsuario: number;
  idCurso: number;
  dataMatricula: string;
};

export type IProgressoAula = {
  idUsuario: number;
  idAula: number;
  dataConclusao: string;
  status: 'Concluído' | 'Em andamento';
};

export type ISession = {
  id: number;
  nomeCompleto: string;
  role: 'aluno' | 'admin';
  accessToken: string;
};
