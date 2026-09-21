import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const hostFromExpo = Constants.expoConfig?.hostUri?.split(':')[0];

const fallbackHost =
  Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  `http://${hostFromExpo || fallbackHost}:8000/api/v1`;

const SESSION_KEY = 'ph_session';

type Paginated<T> = {
  data?: T[];
  meta?: { totalPages?: number };
};

const getAccessToken = async (): Promise<string | null> => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as { accessToken?: string };
    return session.accessToken ?? null;
  } catch {
    return null;
  }
};

const clearSessionOnUnauthorized = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};

const errorMessage = (body: unknown, status: number) => {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (Array.isArray(message)) return String(message[0]);
    if (typeof message === 'string') return message;
  }
  return `Erro ${status}`;
};

export const apiRequest = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    await clearSessionOnUnauthorized();
    const body = await res.json().catch(() => null);
    throw new Error(errorMessage(body, res.status));
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(errorMessage(body, res.status));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
};

export const apiList = async <T>(path: string, signal?: AbortSignal): Promise<T[]> => {
  const first = await apiRequest<Paginated<T>>(`${path}?page=1&limit=100`, { signal });
  const items = first.data ?? [];
  const totalPages = first.meta?.totalPages ?? 1;
  if (totalPages <= 1) return items;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      apiRequest<Paginated<T>>(`${path}?page=${index + 2}&limit=100`, { signal }),
    ),
  );

  return items.concat(...rest.map((page) => page.data ?? []));
};
