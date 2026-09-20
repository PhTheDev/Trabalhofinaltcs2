import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AulasService } from './aulas.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('aulas')
@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova aula em um módulo' })
  @ApiResponse({ status: 201, description: 'Aula cadastrada com sucesso' })
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulasService.create(createAulaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar aulas com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de aulas retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.aulasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de uma aula pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da aula', type: Number })
  @ApiResponse({ status: 200, description: 'Aula encontrada' })
  @ApiResponse({ status: 404, description: 'Aula não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.aulasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma aula' })
  @ApiParam({ name: 'id', description: 'ID da aula', type: Number })
  @ApiResponse({ status: 200, description: 'Aula atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Aula não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulasService.update(id, updateAulaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma aula' })
  @ApiParam({ name: 'id', description: 'ID da aula', type: Number })
  @ApiResponse({ status: 200, description: 'Aula removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Aula não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aulasService.remove(id);
  }
}
