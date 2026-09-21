import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('modulos')
@ApiBearerAuth()
@Controller('modulos')
export class ModulosController {
  constructor(private readonly modulosService: ModulosService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar um novo módulo para um curso' })
  @ApiResponse({ status: 201, description: 'Módulo criado com sucesso' })
  create(@Body() createModuloDto: CreateModuloDto) {
    return this.modulosService.create(createModuloDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar módulos com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de módulos retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.modulosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um módulo pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do módulo', type: Number })
  @ApiResponse({ status: 200, description: 'Módulo encontrado' })
  @ApiResponse({ status: 404, description: 'Módulo não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modulosService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar um módulo' })
  @ApiParam({ name: 'id', description: 'ID do módulo', type: Number })
  @ApiResponse({ status: 200, description: 'Módulo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Módulo não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateModuloDto: UpdateModuloDto) {
    return this.modulosService.update(id, updateModuloDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover um módulo' })
  @ApiParam({ name: 'id', description: 'ID do módulo', type: Number })
  @ApiResponse({ status: 200, description: 'Módulo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Módulo não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modulosService.remove(id);
  }
}
