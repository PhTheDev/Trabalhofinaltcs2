import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/common/types/paginated-response';
import { Modulo } from 'src/generated/prisma/client';

@Injectable()
export class ModulosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createModuloDto: CreateModuloDto) {
    return this.prisma.modulo.create({ data: createModuloDto });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Modulo>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.modulo.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.modulo.count(),
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
    const modulo = await this.prisma.modulo.findUnique({ where: { id } });
    if (!modulo) {
      throw new NotFoundException(`Modulo #${id} não encontrado!`);
    }
    return modulo;
  }

  async update(id: number, updateModuloDto: UpdateModuloDto) {
    await this.findOne(id);
    return this.prisma.modulo.update({
      where: { id },
      data: updateModuloDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.modulo.delete({ where: { id } });
  }
}
