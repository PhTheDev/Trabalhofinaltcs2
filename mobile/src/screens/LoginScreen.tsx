import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';
import { colors } from '../theme';

export const LoginScreen: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'login' | 'cadastro'>('login');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [nome, setNome] = useState('');
  const [cadastroEmail, setCadastroEmail] = useState('');
  const [cadastroSenha, setCadastroSenha] = useState('');

  const handleLogin = async () => {
    if (!loginEmail.trim() || loginSenha.length < 3) {
      setAlert('Informe e-mail e senha (mín. 3 caracteres).');
      return;
    }
    setLoading(true);
    setAlert(null);
    const result = await signIn(loginEmail.trim(), loginSenha);
    setLoading(false);
    if (!result.ok) setAlert(result.message ?? 'Falha no login.');
  };

  const handleCadastro = async () => {
    if (nome.trim().length < 3 || !cadastroEmail.trim() || cadastroSenha.length < 6) {
      setAlert('Nome (3+), e-mail e senha (6+) são obrigatórios.');
      return;
    }
    setLoading(true);
    setAlert(null);
    const result = await signUp(nome.trim(), cadastroEmail.trim(), cadastroSenha);
    setLoading(false);
    if (!result.ok) setAlert(result.message ?? 'Falha no cadastro.');
  };

  const handleDemo = (email: string, senha: string) => {
    setLoginEmail(email);
    setLoginSenha(senha);
    setTab('login');
    setAlert(null);
  };

  return (
    <SafeAreaView style={styles.flex}>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>{'</>'} PH</Text>
        <Text style={styles.title}>Plataforma de cursos</Text>
        <Text style={styles.subtitle}>Entre para ver o catálogo e assistir às aulas.</Text>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === 'login' && styles.tabActive]}
            onPress={() => setTab('login')}
          >
            <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>Entrar</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === 'cadastro' && styles.tabActive]}
            onPress={() => setTab('cadastro')}
          >
            <Text style={[styles.tabText, tab === 'cadastro' && styles.tabTextActive]}>Cadastrar</Text>
          </Pressable>
        </View>

        {tab === 'login' ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={loginEmail}
              onChangeText={setLoginEmail}
              accessibilityLabel="E-mail"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={colors.muted}
              secureTextEntry
              value={loginSenha}
              onChangeText={setLoginSenha}
              accessibilityLabel="Senha"
            />
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              accessibilityLabel="Entrar"
            >
              {loading ? (
                <ActivityIndicator color={colors.bg} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </Pressable>
            <Text style={styles.demoLabel}>Contas de demonstração</Text>
            <View style={styles.demoRow}>
              <Pressable
                style={styles.demoBtn}
                onPress={() => handleDemo('admin@plataforma.com', '0202')}
              >
                <Text style={styles.demoText}>Admin</Text>
              </Pressable>
              <Pressable
                style={styles.demoBtn}
                onPress={() => handleDemo('aluno@plataforma.com', '0202')}
              >
                <Text style={styles.demoText}>Aluno</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={colors.muted}
              value={nome}
              onChangeText={setNome}
              accessibilityLabel="Nome completo"
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={cadastroEmail}
              onChangeText={setCadastroEmail}
              accessibilityLabel="E-mail"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha (mín. 6 caracteres)"
              placeholderTextColor={colors.muted}
              secureTextEntry
              value={cadastroSenha}
              onChangeText={setCadastroSenha}
              accessibilityLabel="Senha"
            />
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleCadastro}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.bg} />
              ) : (
                <Text style={styles.buttonText}>Criar conta</Text>
              )}
            </Pressable>
          </>
        )}

        {alert ? <Text style={styles.alert}>{alert}</Text> : null}
        <Text style={styles.apiHint}>API: {API_URL}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingTop: 24 },
  brand: { color: colors.accent, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  title: { color: colors.text, fontSize: 26, fontWeight: '700' },
  subtitle: { color: colors.muted, marginTop: 8, marginBottom: 24 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabActive: { borderColor: colors.accent, backgroundColor: 'rgba(34,211,238,0.12)' },
  tabText: { color: colors.muted, fontWeight: '600' },
  tabTextActive: { color: colors.accent },
  input: {
    backgroundColor: colors.bgCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.bg, fontWeight: '800', fontSize: 16 },
  demoLabel: { color: colors.muted, marginTop: 20, marginBottom: 8 },
  demoRow: { flexDirection: 'row', gap: 8 },
  demoBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  demoText: { color: colors.text, fontWeight: '600' },
  alert: { color: colors.danger, marginTop: 16 },
  apiHint: { color: colors.muted, fontSize: 11, marginTop: 24 },
});
