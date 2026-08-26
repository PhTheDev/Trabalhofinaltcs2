import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ISession } from '../types';
import { cadastrarAluno, clearSession, getSession, login } from '../services/auth';

type AuthContextValue = {
  session: ISession | null;
  ready: boolean;
  signIn: (email: string, senha: string) => Promise<{ ok: boolean; message?: string }>;
  signUp: (nome: string, email: string, senha: string) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSessionState] = useState<ISession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSession()
      .then(setSessionState)
      .finally(() => setReady(true));
  }, []);

  const signIn: AuthContextValue['signIn'] = async (email, senha) => {
    const result = await login(email, senha);
    if (!result.ok) return { ok: false, message: result.message };
    setSessionState(result.session);
    return { ok: true };
  };

  const signUp: AuthContextValue['signUp'] = async (nome, email, senha) => {
    const result = await cadastrarAluno(nome, email, senha);
    if (!result.ok) return { ok: false, message: result.message };
    setSessionState(result.session);
    return { ok: true };
  };

  const signOut = async () => {
    await clearSession();
    setSessionState(null);
  };

  return (
    <AuthContext.Provider value={{ session, ready, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return value;
};
