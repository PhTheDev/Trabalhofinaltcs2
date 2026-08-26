import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/types/paginated-response';
import { Prisma, Usuario } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto) {
    return this.prisma.usuario.create({ data: dto }).catch((error) => {
      this.rethrowUniqueEmail(error);
      throw error;
    });
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<Usuario>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.usuario.count(),
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
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario #${id} não encontrado!`);
    }
    return user;
  }

  findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async login(email: string, senha: string) {
    const user = await this.findByEmail(email);
    if (!user || user.senha !== senha) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.usuario
      .update({
        where: { id },
        data: dto,
      })
      .catch((error) => {
        this.rethrowUniqueEmail(error);
        throw error;
      });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({ where: { id } });
  }

  private rethrowUniqueEmail(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('E-mail já cadastrado.');
    }
  }
}
