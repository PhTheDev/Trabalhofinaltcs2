import type { IUsuario } from '../types';
import { apiRequest } from '../lib/api';
import { mapUsuario } from '../lib/mappers';

const SESSION_KEY = 'ph_session';

export interface ISession {
  id: number;
  nomeCompleto: string;
  role: 'aluno' | 'admin';
  accessToken: string;
}

type AuthApiResponse = {
  access_token: string;
  usuario: unknown;
};

export function getSession(): ISession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as ISession;
    if (!session.accessToken) return null;
    return session;
  } catch {
    return null;
  }
}

export function setSession(usuario: IUsuario, accessToken: string) {
  const session: ISession = {
    id: usuario.id,
    nomeCompleto: usuario.nomeCompleto,
    role: usuario.role,
    accessToken,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function login(
  email: string,
  senha: string,
): Promise<{ ok: boolean; usuario?: IUsuario; message?: string }> {
  try {
    const raw = await apiRequest<AuthApiResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    const usuario = mapUsuario(raw.usuario);
    setSession(usuario, raw.access_token);
    return { ok: true, usuario };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Erro ao conectar com o servidor.',
    };
  }
}

export async function cadastrarAluno(
  nomeCompleto: string,
  email: string,
  senha: string,
): Promise<{ ok: boolean; usuario?: IUsuario; message?: string }> {
  try {
    const raw = await apiRequest<AuthApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        nome: nomeCompleto,
        email,
        senha,
      }),
    });
    const usuario = mapUsuario(raw.usuario);
    setSession(usuario, raw.access_token);
    return { ok: true, usuario };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Erro ao conectar com o servidor.',
    };
  }
}
