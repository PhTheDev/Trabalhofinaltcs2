import type {
  IAula,
  ICategoria,
  ICurso,
  IMatricula,
  IModulo,
  IProgressoAula,
  IUsuario,
} from '../types';

const NIVEL_FROM_API = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
} as const;

const STATUS_TO_API = {
  Concluído: 'CONCLUIDA',
  'Em andamento': 'PENDENTE',
} as const;

const STATUS_FROM_API = {
  CONCLUIDA: 'Concluído',
  PENDENTE: 'Em andamento',
} as const;

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toIso = (value: unknown) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return new Date(value as string).toISOString();
};

const asRecord = (value: unknown) => value as Record<string, unknown>;

const mapRole = (role: unknown): 'aluno' | 'admin' => {
  const value = String(role ?? '').toUpperCase();
  return value === 'ADMIN' ? 'admin' : 'aluno';
};

export const mapUsuario = (user: unknown): IUsuario => {
  const row = asRecord(user);
  return {
    id: toNumber(row.id),
    nomeCompleto: String(row.nome ?? ''),
    email: String(row.email ?? ''),
    senhaHash: '',
    dataCadastro: toIso(row.createdAt),
    role: mapRole(row.role),
  };
};

export const mapCategoria = (categoria: unknown): ICategoria => {
  const row = asRecord(categoria);
  return {
    id: toNumber(row.id),
    nome: String(row.nome ?? ''),
    descricao: String(row.descricao ?? ''),
  };
};

export const mapCurso = (curso: unknown): ICurso => {
  const row = asRecord(curso);
  const nivel = String(row.nivel) as keyof typeof NIVEL_FROM_API;
  return {
    id: toNumber(row.id),
    titulo: String(row.titulo ?? ''),
    descricao: String(row.descricao ?? ''),
    idInstrutor: toNumber(row.idInstrutor),
    idCategoria: toNumber(row.idCategoria),
    nivel: NIVEL_FROM_API[nivel] ?? 'Iniciante',
    dataPublicacao: toIso(row.dataPublicacao),
    totalHoras: toNumber(row.totalHoras),
    preco: toNumber(row.preco),
  };
};

export const mapModulo = (modulo: unknown): IModulo => {
  const row = asRecord(modulo);
  return {
    id: toNumber(row.id),
    idCurso: toNumber(row.idCurso),
    titulo: String(row.titulo ?? ''),
    ordem: toNumber(row.ordem),
  };
};

export const mapAula = (aula: unknown): IAula => {
  const row = asRecord(aula);
  return {
    id: toNumber(row.id),
    idModulo: toNumber(row.idModulo),
    titulo: String(row.titulo ?? ''),
    tipoConteudo: (String(row.tipoConteudo) as IAula['tipoConteudo']) || 'Vídeo',
    urlConteudo: String(row.urlConteudo ?? ''),
    duracaoMinutos: toNumber(row.duracaoMinutos),
    ordem: toNumber(row.ordem),
  };
};

export const mapMatricula = (matricula: unknown): IMatricula => {
  const row = asRecord(matricula);
  return {
    id: toNumber(row.id),
    idUsuario: toNumber(row.idUsuario),
    idCurso: toNumber(row.idCurso),
    dataMatricula: toIso(row.dataMatricula),
  };
};

export const mapProgresso = (progresso: unknown): IProgressoAula => {
  const row = asRecord(progresso);
  const status = String(row.status) as keyof typeof STATUS_FROM_API;
  return {
    idUsuario: toNumber(row.idUsuario),
    idAula: toNumber(row.idAula),
    dataConclusao: toIso(row.dataConclusao),
    status: STATUS_FROM_API[status] ?? 'Em andamento',
  };
};

export const toProgressoStatus = (status: IProgressoAula['status']) =>
  STATUS_TO_API[status];
