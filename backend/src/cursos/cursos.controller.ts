import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('cursos')
@ApiBearerAuth()
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cadastrar um novo curso' })
  @ApiResponse({ status: 201, description: 'Curso cadastrado com sucesso' })
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cursos cadastrados com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de cursos retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.cursosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um curso pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do curso', type: Number })
  @ApiResponse({ status: 200, description: 'Curso encontrado' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar informações de um curso' })
  @ApiParam({ name: 'id', description: 'ID do curso', type: Number })
  @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover um curso' })
  @ApiParam({ name: 'id', description: 'ID do curso', type: Number })
  @ApiResponse({ status: 200, description: 'Curso removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.remove(id);
  }
}
