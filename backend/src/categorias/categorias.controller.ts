import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('categorias')
@ApiBearerAuth()
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova categoria de cursos' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorias com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de categorias retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.categoriasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da categoria', type: Number })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar uma categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria', type: Number })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover uma categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria', type: Number })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remove(id);
  }
}
