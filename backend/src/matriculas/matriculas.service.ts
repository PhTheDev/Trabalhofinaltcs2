import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class MatriculasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMatriculaDto: CreateMatriculaDto) {
    return this.prisma.matricula.create({ data: createMatriculaDto });
  }

  async findAll(query: PaginationQueryDto) {
    const {page, limit} = query
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.matricula.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc'}
      }),
      this.prisma.matricula.count()
    ])

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      }
    }
  }

  async findOne(id: number) {
    const matricula = await this.prisma.matricula.findUnique({ where: { id } })
    if (!matricula) {
      throw new NotFoundException(`Matricula #${id} não encontrado!`)
    }
    return matricula;
  }

  async update(id: number, updateMatriculaDto: UpdateMatriculaDto) {
    await this.findOne(id)
    return this.prisma.matricula
      .update({
        where: { id },
        data: updateMatriculaDto
      });
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.matricula
      .delete({where: { id }});
  }
}
