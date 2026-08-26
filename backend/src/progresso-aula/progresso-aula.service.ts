import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/common/types/paginated-response';
import { ProgressoAula } from 'src/generated/prisma/client';

@Injectable()
export class ProgressoAulaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.prisma.progressoAula.create({ data: createProgressoAulaDto });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<ProgressoAula>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.progressoAula.findMany({
        skip,
        take: limit,
        orderBy: [{ idUsuario: 'asc' }, { idAula: 'asc' }],
      }),
      this.prisma.progressoAula.count(),
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

  async findOne(idUsuario: number, idAula: number) {
    const progresso = await this.prisma.progressoAula.findUnique({
      where: { idUsuario_idAula: { idUsuario, idAula } },
    });
    if (!progresso) {
      throw new NotFoundException(
        `Progresso do usuario #${idUsuario} na aula #${idAula} não encontrado!`,
      );
    }
    return progresso;
  }

  async update(idUsuario: number, idAula: number, updateProgressoAulaDto: UpdateProgressoAulaDto) {
    await this.findOne(idUsuario, idAula);
    return this.prisma.progressoAula.update({
      where: { idUsuario_idAula: { idUsuario, idAula } },
      data: updateProgressoAulaDto,
    });
  }

  async remove(idUsuario: number, idAula: number) {
    await this.findOne(idUsuario, idAula);
    return this.prisma.progressoAula.delete({
      where: { idUsuario_idAula: { idUsuario, idAula } },
    });
  }
}
