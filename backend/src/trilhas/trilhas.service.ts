import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/common/types/paginated-response';
import { Trilha } from 'src/generated/prisma/client';

@Injectable()
export class TrilhasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTrilhaDto: CreateTrilhaDto) {
    return this.prisma.trilha.create({ data: createTrilhaDto });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Trilha>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.trilha.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.trilha.count(),
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
    const trilha = await this.prisma.trilha.findUnique({ where: { id } });
    if (!trilha) {
      throw new NotFoundException(`Trilha #${id} não encontrada!`);
    }
    return trilha;
  }

  async update(id: number, updateTrilhaDto: UpdateTrilhaDto) {
    await this.findOne(id);
    return this.prisma.trilha.update({
      where: { id },
      data: updateTrilhaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.trilha.delete({ where: { id } });
  }
}
