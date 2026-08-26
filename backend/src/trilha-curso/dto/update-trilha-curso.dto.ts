import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTrilhaCursoDto } from './create-trilha-curso.dto';

export class UpdateTrilhaCursoDto extends PartialType(
  OmitType(CreateTrilhaCursoDto, ['idTrilha', 'idCurso'] as const),
) {}
