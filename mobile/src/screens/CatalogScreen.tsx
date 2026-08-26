import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { apiList } from '../lib/api';
import {
  mapAula,
  mapCategoria,
  mapCurso,
  mapMatricula,
  mapModulo,
  mapProgresso,
  mapUsuario,
} from '../lib/mappers';
import { byId, formatPreco } from '../lib/utils';
import { matricular } from '../services/usuario';
import { colors } from '../theme';
import type { IAula, ICategoria, ICurso, IMatricula, IModulo, IProgressoAula, IUsuario } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalog'>;
type Filtro = 'todos' | 'meus' | 'disponiveis';

export const CatalogScreen: React.FC<Props> = ({ navigation }) => {
  const { session, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [modulos, setModulos] = useState<IModulo[]>([]);
  const [aulas, setAulas] = useState<IAula[]>([]);
  const [matriculas, setMatriculas] = useState<IMatricula[]>([]);
  const [progresso, setProgresso] = useState<IProgressoAula[]>([]);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [c, u, cat, m, a, mat, p] = await Promise.all([
        apiList('/cursos').then((rows) => rows.map(mapCurso)),
        apiList('/users').then((rows) => rows.map(mapUsuario)),
        apiList('/categorias').then((rows) => rows.map(mapCategoria)),
        apiList('/modulos').then((rows) => rows.map(mapModulo)),
        apiList('/aulas').then((rows) => rows.map(mapAula)),
        apiList('/matriculas').then((rows) => rows.map(mapMatricula)),
        apiList('/progresso-aula').then((rows) => rows.map(mapProgresso)),
      ]);
      setCursos(c);
      setUsuarios(u);
      setCategorias(cat);
      setModulos(m);
      setAulas(a);
      setMatriculas(mat);
      setProgresso(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível carregar os cursos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const userId = session?.id ?? 0;

  const isMatriculado = (cursoId: number) =>
    matriculas.some((item) => item.idUsuario === userId && item.idCurso === cursoId);

  const getProgressoCurso = (cursoId: number) => {
    const ids = aulas
      .filter((aula) =>
        modulos.some((modulo) => modulo.idCurso === cursoId && modulo.id === aula.idModulo),
      )
      .map((aula) => aula.id);
    if (ids.length === 0) return 0;
    const done = progresso.filter(
      (item) => item.idUsuario === userId && ids.includes(item.idAula) && item.status === 'Concluído',
    ).length;
    return Math.round((done / ids.length) * 100);
  };

  const cursosVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return cursos.filter((curso) => {
      const matriculado = isMatriculado(curso.id);
      if (filtro === 'meus' && !matriculado) return false;
      if (filtro === 'disponiveis' && matriculado) return false;
      if (!termo) return true;
      return [curso.titulo, curso.descricao, curso.nivel].join(' ').toLowerCase().includes(termo);
    });
  }, [cursos, matriculas, busca, filtro, userId]);

  const handleEnroll = async (curso: ICurso) => {
    if (!userId) return;
    setEnrollingId(curso.id);
    try {
      await matricular(userId, curso.id);
      await load();
      navigation.navigate('Player', { cursoId: curso.id });
    } catch (e) {
      Alert.alert('Matrícula', e instanceof Error ? e.message : 'Não foi possível se inscrever.');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading && cursos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.muted}>Carregando cursos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.accent} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Olá, {session?.nomeCompleto.split(' ')[0]}</Text>
          <Text style={styles.muted}>{session?.role === 'admin' ? 'Painel admin no celular' : 'Seus cursos'}</Text>
        </View>
        <Pressable onPress={signOut} accessibilityLabel="Sair">
          <Text style={styles.logout}>Sair</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar por título, nível ou descrição"
        placeholderTextColor={colors.muted}
        value={busca}
        onChangeText={setBusca}
        accessibilityLabel="Buscar cursos"
      />

      <View style={styles.filters}>
        {(['todos', 'meus', 'disponiveis'] as const).map((id) => (
          <Pressable
            key={id}
            style={[styles.filter, filtro === id && styles.filterActive]}
            onPress={() => setFiltro(id)}
          >
            <Text style={[styles.filterText, filtro === id && styles.filterTextActive]}>
              {id === 'todos' ? 'Todos' : id === 'meus' ? 'Meus' : 'Disponíveis'}
            </Text>
          </Pressable>
        ))}
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.button} onPress={load}>
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : cursosVisiveis.length === 0 ? (
        <Text style={styles.muted}>Nenhum curso neste filtro.</Text>
      ) : (
        cursosVisiveis.map((curso) => {
          const matriculado = isMatriculado(curso.id);
          const progressoPct = matriculado ? getProgressoCurso(curso.id) : 0;
          const instrutor = byId(usuarios, curso.idInstrutor);
          const categoria = byId(categorias, curso.idCategoria);
          const preco = Number(curso.preco) || 0;

          return (
            <View key={curso.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.nivel}>{curso.nivel}</Text>
                <Text style={styles.price}>
                  {matriculado ? 'Adquirido' : preco === 0 ? 'Gratuito' : formatPreco(preco)}
                </Text>
              </View>
              <Text style={styles.cardTitle}>{curso.titulo}</Text>
              <Text style={styles.cardDesc} numberOfLines={3}>{curso.descricao}</Text>
              <Text style={styles.meta}>
                {instrutor?.nomeCompleto || 'Instrutor'} · {categoria?.nome || 'Geral'} · {curso.totalHoras}h
              </Text>
              {matriculado ? (
                <>
                  <Text style={styles.progressLabel}>Progresso {progressoPct}%</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progressoPct}%` }]} />
                  </View>
                  <Pressable
                    style={styles.button}
                    onPress={() => navigation.navigate('Player', { cursoId: curso.id })}
                  >
                    <Text style={styles.buttonText}>{progressoPct > 0 ? 'Continuar' : 'Começar'}</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  style={[styles.button, styles.buttonAlt]}
                  onPress={() => handleEnroll(curso)}
                  disabled={enrollingId === curso.id}
                >
                  {enrollingId === curso.id ? (
                    <ActivityIndicator color={colors.bg} />
                  ) : (
                    <Text style={styles.buttonText}>
                      {preco === 0 ? 'Acessar gratuitamente' : `Inscrever por ${formatPreco(preco)}`}
                    </Text>
                  )}
                </Pressable>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  hello: { color: colors.text, fontSize: 22, fontWeight: '700' },
  muted: { color: colors.muted, marginTop: 4 },
  logout: { color: colors.accent, fontWeight: '700' },
  search: {
    backgroundColor: colors.bgCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filter: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  filterActive: { borderColor: colors.accent, backgroundColor: 'rgba(34,211,238,0.12)' },
  filterText: { color: colors.muted, fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: colors.accent },
  card: {
    backgroundColor: colors.bgCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  nivel: { color: colors.accent, fontWeight: '700', fontSize: 12 },
  price: { color: colors.text, fontWeight: '700' },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  cardDesc: { color: colors.muted, marginTop: 6 },
  meta: { color: colors.muted, marginTop: 8, fontSize: 12 },
  progressLabel: { color: colors.accent, marginTop: 12, fontWeight: '600' },
  progressTrack: { height: 6, backgroundColor: colors.border, borderRadius: 99, marginTop: 6, marginBottom: 12 },
  progressFill: { height: 6, backgroundColor: colors.accent, borderRadius: 99 },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonAlt: { backgroundColor: colors.success },
  buttonText: { color: colors.bg, fontWeight: '800' },
  error: { color: colors.danger, textAlign: 'center', marginBottom: 12 },
});
