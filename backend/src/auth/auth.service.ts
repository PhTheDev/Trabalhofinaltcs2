import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '../generated/prisma/client';
import { SafeUsuario, UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

export type AuthUsuario = {
  id: number;
  email: string;
  nome: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResponse = {
  access_token: string;
  usuario: AuthUsuario;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, senha: string): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    return this.buildAuthResponse(user);
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create({
      email: dto.email,
      nome: dto.nome,
      senha: dto.senha,
      role: Role.ALUNO,
    });
    return this.buildAuthResponse(user);
  }

  async me(userId: number): Promise<AuthUsuario> {
    const user = await this.usersService.findOne(userId);
    return this.toAuthUsuario(user);
  }

  private buildAuthResponse(
    user: SafeUsuario & { senha?: string },
  ): AuthResponse {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: this.toAuthUsuario(user),
    };
  }

  private toAuthUsuario(user: SafeUsuario): AuthUsuario {
    return {
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
