import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CertificadosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCertificadoDto: CreateCertificadoDto) {
    return this.prisma.certificado.create({ data: createCertificadoDto })
  }

  async findAll(query: PaginationQueryDto) {
    const {page, limit} = query
    const skip = (page - 1) * limit

    const [data, total] = await this.prisma.$transaction([
      this.prisma.certificado.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc'}
      }),
      this.prisma.certificado.count()
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
    const certificado = await this.prisma.certificado.findUnique({ where: { id } })
    if (!certificado) {
      throw new NotFoundException(`Certificado #${id} não encontrado!`);
    }
    return certificado;
  }

  async update(id: number, updateCertificadoDto: UpdateCertificadoDto) {
    await this.findOne(id)
    return this.prisma.certificado
      .update({
        where: { id },
        data: updateCertificadoDto
      });
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.certificado
      .delete({ where: { id }, });
  }
}
