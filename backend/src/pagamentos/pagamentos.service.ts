import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/common/types/paginated-response';
import { Pagamento } from 'src/generated/prisma/client';

@Injectable()
export class PagamentosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPagamentoDto: CreatePagamentoDto) {
    return this.prisma.pagamento.create({ data: createPagamentoDto });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResponse<Pagamento>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.pagamento.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.pagamento.count(),
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
    const pagamento = await this.prisma.pagamento.findUnique({ where: { id } });
    if (!pagamento) {
      throw new NotFoundException(`Pagamento #${id} não encontrado!`);
    }
    return pagamento;
  }

  async update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    await this.findOne(id);
    return this.prisma.pagamento.update({
      where: { id },
      data: updatePagamentoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pagamento.delete({ where: { id } });
  }
}
