import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/common/types/paginated-response';
import { Plano } from 'src/generated/prisma/client';

@Injectable()
export class PlanosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlanoDto: CreatePlanoDto) {
    return this.prisma.plano.create({ data: createPlanoDto })
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Plano>> {
    const {page, limit} = query
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.plano.findMany({
        skip,
        take: limit,
        orderBy: {id: 'asc'}
      }),
      this.prisma.plano.count(),
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
    const plano = await this.prisma.plano.findUnique({where: { id }})
    if (!plano) {
      throw new NotFoundException(`Plano #${id} não encontrado!`)
    }
    return plano
  }

  async update(id: number, updatePlanoDto: UpdatePlanoDto) {
    await this.findOne(id)
    return this.prisma.plano
      .update({
        where: { id },
        data: updatePlanoDto,
      });
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.plano.delete({where: { id }});
  }
}
