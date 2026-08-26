import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrilhaCursoDto } from './dto/create-trilha-curso.dto';
import { UpdateTrilhaCursoDto } from './dto/update-trilha-curso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/common/types/paginated-response';
import { TrilhaCurso } from 'src/generated/prisma/client';

@Injectable()
export class TrilhaCursoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTrilhaCursoDto: CreateTrilhaCursoDto) {
    return this.prisma.trilhaCurso.create({ data: createTrilhaCursoDto });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<TrilhaCurso>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.trilhaCurso.findMany({
        skip,
        take: limit,
        orderBy: [{ idTrilha: 'asc' }, { idCurso: 'asc' }],
      }),
      this.prisma.trilhaCurso.count(),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  async findOne(idTrilha: number, idCurso: number) {
    const trilhaCurso = await this.prisma.trilhaCurso.findUnique({
      where: { idTrilha_idCurso: { idTrilha, idCurso } },
    });
    if (!trilhaCurso) {
      throw new NotFoundException(
        `Vinculo trilha #${idTrilha} e curso #${idCurso} não encontrado!`,
      );
    }
    return trilhaCurso;
  }

  async update(idTrilha: number, idCurso: number, updateTrilhaCursoDto: UpdateTrilhaCursoDto) {
    await this.findOne(idTrilha, idCurso);
    return this.prisma.trilhaCurso.update({
      where: { idTrilha_idCurso: { idTrilha, idCurso } },
      data: updateTrilhaCursoDto,
    });
  }

  async remove(idTrilha: number, idCurso: number) {
    await this.findOne(idTrilha, idCurso);
    return this.prisma.trilhaCurso.delete({
      where: { idTrilha_idCurso: { idTrilha, idCurso } },
    });
  }
}
