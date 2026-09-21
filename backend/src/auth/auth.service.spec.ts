import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { Role } from '../generated/prisma/client';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('@nestjs/jwt', () => ({
  JwtService: class JwtService {},
  JwtModule: { register: jest.fn(), registerAsync: jest.fn() },
}));

import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  };
  const jwtService = {
    sign: jest.fn().mockReturnValue('signed.jwt.token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('login returns access_token for valid credentials', async () => {
    const senhaHash = await bcrypt.hash('0202', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'aluno@plataforma.com',
      nome: 'Aluno',
      senha: senhaHash,
      role: Role.ALUNO,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.login('aluno@plataforma.com', '0202');

    expect(result.access_token).toBe('signed.jwt.token');
    expect(result.usuario).not.toHaveProperty('senha');
    expect(result.usuario.email).toBe('aluno@plataforma.com');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'aluno@plataforma.com',
      role: Role.ALUNO,
    });
  });

  it('login throws 401 for invalid password', async () => {
    const senhaHash = await bcrypt.hash('0202', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'aluno@plataforma.com',
      nome: 'Aluno',
      senha: senhaHash,
      role: Role.ALUNO,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      service.login('aluno@plataforma.com', 'wrong'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('login throws 401 when user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login('missing@plataforma.com', '0202'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
