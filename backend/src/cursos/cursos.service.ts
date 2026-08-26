import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CursosService {
  constructor(private readonly prisma: PrismaService) {}
  
  create(createCursoDto: CreateCursoDto) {
    return this.prisma.curso.create({ data: createCursoDto })
  }

  async findAll(query: PaginationQueryDto) {
    const {page, limit} = query
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.curso.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.curso.count(),
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
    const curso = await this.prisma.curso.findUnique({where: {id}})
    if (!curso) {
      throw new NotFoundException(`Curso #${id} não encontrado!`)
    }
    return curso;
  }

  async update(id: number, updateCursoDto: UpdateCursoDto) {
    await this.findOne(id)
    return this.prisma.curso  
      .update({
        where: {id},
        data: updateCursoDto
      });
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.curso.delete({where: { id }})
  }
}
