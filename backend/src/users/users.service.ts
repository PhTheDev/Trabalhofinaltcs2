import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/types/paginated-response';
import { Prisma, Role, Usuario } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type SafeUsuario = Omit<Usuario, 'senha'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<SafeUsuario> {
    const senhaHash = await bcrypt.hash(dto.senha, 10);
    try {
      const user = await this.prisma.usuario.create({
        data: {
          email: dto.email,
          nome: dto.nome,
          senha: senhaHash,
          role: dto.role ?? Role.ALUNO,
        },
      });
      return this.omitSenha(user);
    } catch (error) {
      this.rethrowUniqueEmail(error);
      throw error;
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<SafeUsuario>> {
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
      data: data.map((user) => this.omitSenha(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  async findOne(id: number): Promise<SafeUsuario> {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario #${id} não encontrado!`);
    }
    return this.omitSenha(user);
  }

  findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto): Promise<SafeUsuario> {
    await this.findOne(id);
    const data: Prisma.UsuarioUpdateInput = {
      email: dto.email,
      nome: dto.nome,
    };
    if (dto.senha) {
      data.senha = await bcrypt.hash(dto.senha, 10);
    }
    if (dto.role) {
      data.role = dto.role;
    }
    try {
      const user = await this.prisma.usuario.update({
        where: { id },
        data,
      });
      return this.omitSenha(user);
    } catch (error) {
      this.rethrowUniqueEmail(error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.usuario.delete({ where: { id } });
  }

  private omitSenha(user: Usuario): SafeUsuario {
    const { senha: _senha, ...safe } = user;
    return safe;
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
