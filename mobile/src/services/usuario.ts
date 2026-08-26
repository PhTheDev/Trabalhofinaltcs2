import { apiList, apiRequest } from '../lib/api';
import { mapMatricula, mapProgresso, toProgressoStatus } from '../lib/mappers';
import type { IMatricula, IProgressoAula } from '../types';

export const matricular = async (idUsuario: number, idCurso: number): Promise<IMatricula> => {
  const matriculas = (await apiList('/matriculas')).map(mapMatricula);
  const existente = matriculas.find(
    (item) => item.idUsuario === idUsuario && item.idCurso === idCurso,
  );
  if (existente) return existente;

  const raw = await apiRequest('/matriculas', {
    method: 'POST',
    body: JSON.stringify({
      idUsuario,
      idCurso,
      dataMatricula: new Date().toISOString(),
    }),
  });
  return mapMatricula(raw);
};

export const atualizarProgresso = async (
  idUsuario: number,
  idAula: number,
  status: IProgressoAula['status'],
): Promise<IProgressoAula> => {
  const payload = {
    status: toProgressoStatus(status),
    dataConclusao: new Date().toISOString(),
  };

  try {
    const raw = await apiRequest(`/progresso-aula/${idUsuario}/${idAula}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return mapProgresso(raw);
  } catch {
    const raw = await apiRequest('/progresso-aula', {
      method: 'POST',
      body: JSON.stringify({
        idUsuario,
        idAula,
        ...payload,
      }),
    });
    return mapProgresso(raw);
  }
};
