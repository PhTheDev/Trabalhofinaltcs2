import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Categoria } from 'src/generated/prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/common/types/paginated-response';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({data: createCategoriaDto});
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<Categoria>> {
    const {page, limit} = query
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.categoria.findMany({
        skip,
        take: limit,
        orderBy: {id: 'asc'},
      }),
      this.prisma.categoria.count(),
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
    const categorie = await this.prisma.categoria.findUnique({where: { id }});
    if (!categorie) {
      throw new NotFoundException(`Categoria #${id} não encontrada!`)
    }
    return categorie
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    await this.findOne(id);
    return this.prisma.categoria
      .update({
        where: {id},
        data: updateCategoriaDto,
      });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.categoria.delete({where: { id }});
  }
}
