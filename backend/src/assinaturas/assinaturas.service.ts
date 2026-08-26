import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class AssinaturasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAssinaturaDto: CreateAssinaturaDto) {
    return this.prisma.assinatura.create({ data: createAssinaturaDto })
  }

  async findAll(query: PaginationQueryDto) {
    const {page, limit} = query
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.assinatura.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' }
      }),
      this.prisma.assinatura.count()
    ])

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0
      }
    }
  }

  async findOne(id: number) {
    const assinatura = await this.prisma.assinatura.findUnique({ where: { id }})
    if (!assinatura) {
      throw new NotFoundException(`Assinatura #${ id } não encontrada!`)
    }
    return assinatura;
  }

  async update(id: number, updateAssinaturaDto: UpdateAssinaturaDto) {
    await this.findOne(id)
    return this.prisma.assinatura
      .update({
        where: { id },
        data: updateAssinaturaDto
      });
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.assinatura
      .delete({ where: { id }});
  }
}
