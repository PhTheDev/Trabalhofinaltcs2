import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import type { RootStackParamList } from '../navigation';
import { useAuth } from '../context/AuthContext';
import { apiList } from '../lib/api';
import { mapAula, mapCurso, mapMatricula, mapModulo, mapProgresso } from '../lib/mappers';
import { byId, isYoutubeUrl, toYoutubeEmbed } from '../lib/utils';
import { atualizarProgresso } from '../services/usuario';
import { colors } from '../theme';
import type { IAula, ICurso, IModulo, IProgressoAula } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

export const PlayerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { cursoId } = route.params;
  const { session } = useAuth();
  const userId = session?.id ?? 0;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [curso, setCurso] = useState<ICurso | undefined>();
  const [modulos, setModulos] = useState<IModulo[]>([]);
  const [aulas, setAulas] = useState<IAula[]>([]);
  const [progresso, setProgresso] = useState<IProgressoAula[]>([]);
  const [aulaAtivaId, setAulaAtivaId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [cursos, mods, aulasApi, mats, prog] = await Promise.all([
        apiList('/cursos').then((rows) => rows.map(mapCurso)),
        apiList('/modulos').then((rows) => rows.map(mapModulo)),
        apiList('/aulas').then((rows) => rows.map(mapAula)),
        apiList('/matriculas').then((rows) => rows.map(mapMatricula)),
        apiList('/progresso-aula').then((rows) => rows.map(mapProgresso)),
      ]);

      const found = byId(cursos, cursoId);
      const enrolled = mats.some((item) => item.idUsuario === userId && item.idCurso === cursoId);
      if (!found) {
        setError('Curso não encontrado.');
        return;
      }
      if (!enrolled) {
        setError('Você ainda não está inscrito neste curso.');
        return;
      }

      const cursoMods = mods
        .filter((item) => item.idCurso === cursoId)
        .sort((a, b) => a.ordem - b.ordem);
      setCurso(found);
      setModulos(cursoMods);
      setAulas(aulasApi);
      setProgresso(prog);

      setAulaAtivaId((current) => {
        if (current) return current;
        const firstMod = cursoMods[0];
        if (!firstMod) return null;
        const firstAula = aulasApi
          .filter((item) => item.idModulo === firstMod.id)
          .sort((a, b) => a.ordem - b.ordem)[0];
        return firstAula?.id ?? null;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível carregar a aula.');
    } finally {
      setLoading(false);
    }
  }, [cursoId, userId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const aulaAtiva = aulaAtivaId ? byId(aulas, aulaAtivaId) : undefined;
  const concluida = progresso.some(
    (item) =>
      item.idUsuario === userId &&
      item.idAula === aulaAtivaId &&
      item.status === 'Concluído',
  );

  const videoUri = useMemo(() => {
    if (!aulaAtiva) return '';
    return isYoutubeUrl(aulaAtiva.urlConteudo)
      ? toYoutubeEmbed(aulaAtiva.urlConteudo)
      : aulaAtiva.urlConteudo;
  }, [aulaAtiva]);

  const handleConcluir = async () => {
    if (!aulaAtivaId || !userId || saving || concluida) return;
    setSaving(true);
    setSaveError(null);
    try {
      await atualizarProgresso(userId, aulaAtivaId, 'Concluído');
      await load();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Não foi possível salvar o progresso.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.muted}>Carregando aula...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar ao catálogo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <View style={styles.player}>
        {aulaAtiva && videoUri ? (
          Platform.OS === 'web' ? (
            <iframe
              src={videoUri}
              title={aulaAtiva.titulo}
              style={{ border: 0, width: '100%', height: '100%' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <WebView
              source={{ uri: videoUri }}
              style={styles.webview}
              allowsFullscreenVideo
              javaScriptEnabled
            />
          )
        ) : (
          <View style={styles.center}>
            <Text style={styles.muted}>Selecione uma aula</Text>
          </View>
        )}
      </View>

      <View style={styles.toolbar}>
        <Text style={styles.aulaTitle} numberOfLines={2}>
          {aulaAtiva?.titulo ?? curso?.titulo}
        </Text>
        {aulaAtiva ? (
          <Pressable
            style={[styles.doneBtn, concluida && styles.doneBtnOn]}
            onPress={handleConcluir}
            disabled={concluida || saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.doneText}>{concluida ? 'Concluída' : 'Concluir'}</Text>
            )}
          </Pressable>
        ) : null}
      </View>
      {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}

      <ScrollView contentContainerStyle={styles.list}>
        {modulos.map((modulo) => {
          const aulasMod = aulas
            .filter((aula) => aula.idModulo === modulo.id)
            .sort((a, b) => a.ordem - b.ordem);
          return (
            <View key={modulo.id} style={styles.modulo}>
              <Text style={styles.moduloTitle}>{modulo.titulo}</Text>
              {aulasMod.map((aula) => {
                const done = progresso.some(
                  (item) =>
                    item.idUsuario === userId &&
                    item.idAula === aula.id &&
                    item.status === 'Concluído',
                );
                const active = aula.id === aulaAtivaId;
                return (
                  <Pressable
                    key={aula.id}
                    style={[styles.aulaItem, active && styles.aulaItemActive]}
                    onPress={() => setAulaAtivaId(aula.id)}
                    accessibilityLabel={aula.titulo}
                  >
                    <Text style={styles.aulaStatus}>{done ? '✓' : '▶'}</Text>
                    <View style={styles.aulaInfo}>
                      <Text style={styles.aulaName}>{aula.titulo}</Text>
                      <Text style={styles.muted}>{aula.duracaoMinutos} min</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  muted: { color: colors.muted, marginTop: 8 },
  error: { color: colors.danger, textAlign: 'center', marginBottom: 16 },
  player: { height: 220, backgroundColor: '#000' },
  webview: { flex: 1, backgroundColor: '#000' },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aulaTitle: { flex: 1, color: colors.text, fontWeight: '700', fontSize: 16 },
  doneBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  doneBtnOn: { backgroundColor: colors.success },
  doneText: { color: colors.bg, fontWeight: '800' },
  saveError: { color: colors.danger, paddingHorizontal: 16, marginTop: 8 },
  list: { padding: 16, paddingBottom: 40 },
  modulo: { marginBottom: 16 },
  moduloTitle: { color: colors.muted, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', fontSize: 12 },
  aulaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: colors.bgCard,
  },
  aulaItemActive: { borderWidth: 1, borderColor: colors.accent, backgroundColor: 'rgba(34,211,238,0.12)' },
  aulaStatus: { color: colors.accent, fontWeight: '800', width: 18 },
  aulaInfo: { flex: 1 },
  aulaName: { color: colors.text, fontWeight: '600' },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: { color: colors.bg, fontWeight: '800' },
});
