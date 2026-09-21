import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '../generated/prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  const prisma = {
    $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
    usuario: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('creates a user with hashed password and omits senha', async () => {
    const dto = { email: 'a@b.com', nome: 'Ada', senha: 'Str0ng!Pass' };
    prisma.usuario.create.mockImplementation(async ({ data }) => ({
      id: 1,
      email: data.email,
      nome: data.nome,
      senha: data.senha,
      role: data.role ?? Role.ALUNO,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.create(dto);

    expect(result).not.toHaveProperty('senha');
    expect(result.email).toBe(dto.email);
    expect(prisma.usuario.create).toHaveBeenCalled();
    const createdData = prisma.usuario.create.mock.calls[0][0].data;
    expect(createdData.senha).not.toBe(dto.senha);
    await expect(bcrypt.compare(dto.senha, createdData.senha)).resolves.toBe(
      true,
    );
  });

  it('throws ConflictException on duplicate email', async () => {
    const error = new Prisma.PrismaClientKnownRequestError('Unique', {
      code: 'P2002',
      clientVersion: 'test',
    });
    prisma.usuario.create.mockRejectedValue(error);

    await expect(
      service.create({ email: 'a@b.com', nome: 'teste', senha: 'Str0ng!Pass' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFoundException when user is missing', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns paginated users without senha', async () => {
    const users = [
      {
        id: 1,
        email: 'a@b.com',
        nome: 'Ada',
        senha: 'hash',
        role: Role.ALUNO,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    prisma.usuario.findMany.mockResolvedValue(users);
    prisma.usuario.count.mockResolvedValue(1);

    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data[0]).not.toHaveProperty('senha');
    expect(result.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
  });
});
