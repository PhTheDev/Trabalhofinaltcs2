import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticação de usuário por e-mail e senha' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.senha);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Cadastro público de aluno' })
  @ApiResponse({ status: 201, description: 'Aluno cadastrado e autenticado' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna o usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do usuário logado' })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.id);
  }
}
