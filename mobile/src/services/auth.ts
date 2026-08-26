import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ISession, IUsuario } from '../types';
import { apiRequest } from '../lib/api';
import { mapUsuario } from '../lib/mappers';

const SESSION_KEY = 'ph_session';

export const getSession = async (): Promise<ISession | null> => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as ISession) : null;
  } catch {
    return null;
  }
};

export const setSession = async (usuario: IUsuario) => {
  const session: ISession = {
    id: usuario.id,
    nomeCompleto: usuario.nomeCompleto,
    role: usuario.role,
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

export const login = async (email: string, senha: string) => {
  try {
    const raw = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    const usuario = mapUsuario(raw);
    const session = await setSession(usuario);
    return { ok: true as const, session };
  } catch (e) {
    return {
      ok: false as const,
      message: e instanceof Error ? e.message : 'Erro ao conectar com o servidor.',
    };
  }
};

export const cadastrarAluno = async (nomeCompleto: string, email: string, senha: string) => {
  try {
    const raw = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({ nome: nomeCompleto, email, senha }),
    });
    const usuario = mapUsuario(raw);
    const session = await setSession(usuario);
    return { ok: true as const, session };
  } catch (e) {
    return {
      ok: false as const,
      message: e instanceof Error ? e.message : 'Erro ao conectar com o servidor.',
    };
  }
};
