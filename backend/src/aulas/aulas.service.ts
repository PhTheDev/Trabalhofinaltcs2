import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/common/types/paginated-response';
import { Aula } from 'src/generated/prisma/client';

@Injectable()
export class AulasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAulaDto: CreateAulaDto) {
    return this.prisma.aula.create({ data: createAulaDto });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Aula>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.aula.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.aula.count(),
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

  async findOne(id: number) {
    const aula = await this.prisma.aula.findUnique({ where: { id } });
    if (!aula) {
      throw new NotFoundException(`Aula #${id} não encontrada!`);
    }
    return aula;
  }

  async update(id: number, updateAulaDto: UpdateAulaDto) {
    await this.findOne(id);
    return this.prisma.aula.update({
      where: { id },
      data: updateAulaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.aula.delete({ where: { id } });
  }
}
