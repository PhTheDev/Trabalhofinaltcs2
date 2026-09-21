import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ISession, IUsuario } from '../types';
import { apiRequest } from '../lib/api';
import { mapUsuario } from '../lib/mappers';

const SESSION_KEY = 'ph_session';

type AuthApiResponse = {
  access_token: string;
  usuario: unknown;
};

export const getSession = async (): Promise<ISession | null> => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as ISession;
    if (!session.accessToken) return null;
    return session;
  } catch {
    return null;
  }
};

export const setSession = async (usuario: IUsuario, accessToken: string) => {
  const session: ISession = {
    id: usuario.id,
    nomeCompleto: usuario.nomeCompleto,
    role: usuario.role,
    accessToken,
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

export const login = async (email: string, senha: string) => {
  try {
    const raw = await apiRequest<AuthApiResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    const usuario = mapUsuario(raw.usuario);
    const session = await setSession(usuario, raw.access_token);
    return { ok: true as const, session };
  } catch (e) {
    return {
      ok: false as const,
      message: e instanceof Error ? e.message : 'Erro ao conectar com o servidor.',
    };
  }
};

export const cadastrarAluno = async (
  nomeCompleto: string,
  email: string,
  senha: string,
) => {
  try {
    const raw = await apiRequest<AuthApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nome: nomeCompleto, email, senha }),
    });
    const usuario = mapUsuario(raw.usuario);
    const session = await setSession(usuario, raw.access_token);
    return { ok: true as const, session };
  } catch (e) {
    return {
      ok: false as const,
      message: e instanceof Error ? e.message : 'Erro ao conectar com o servidor.',
    };
  }
};
