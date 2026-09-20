import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('matriculas')
@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  @Post()
  @ApiOperation({ summary: 'Realizar matrícula de um aluno em um curso' })
  @ApiResponse({ status: 201, description: 'Matrícula realizada com sucesso' })
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculasService.create(createMatriculaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar matrículas com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de matrículas retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.matriculasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar matrícula pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da matrícula', type: Number })
  @ApiResponse({ status: 200, description: 'Matrícula encontrada' })
  @ApiResponse({ status: 404, description: 'Matrícula não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matriculasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma matrícula' })
  @ApiParam({ name: 'id', description: 'ID da matrícula', type: Number })
  @ApiResponse({ status: 200, description: 'Matrícula atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Matrícula não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMatriculaDto: UpdateMatriculaDto) {
    return this.matriculasService.update(id, updateMatriculaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar/Remover uma matrícula' })
  @ApiParam({ name: 'id', description: 'ID da matrícula', type: Number })
  @ApiResponse({ status: 200, description: 'Matrícula removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Matrícula não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matriculasService.remove(id);
  }
}
