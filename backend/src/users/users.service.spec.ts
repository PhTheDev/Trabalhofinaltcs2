import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

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

  it('creates a user', async () => {
    const dto = { email: 'a@b.com', nome: 'Ada', senha: 'Str0ng!Pass' };
    prisma.usuario.create.mockResolvedValue({ id: 1, ...dto });

    await expect(service.create(dto)).resolves.toEqual({ id: 1, ...dto });
    expect(prisma.usuario.create).toHaveBeenCalledWith({ data: dto });
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

  it('returns paginated users', async () => {
    const users = [{ id: 1, email: 'a@b.com', nome: 'Ada' }];
    prisma.usuario.findMany.mockResolvedValue(users);
    prisma.usuario.count.mockResolvedValue(1);

    await expect(
      service.findAll({ page: 1, limit: 10 }),
    ).resolves.toEqual({
      data: users,
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  });
});
