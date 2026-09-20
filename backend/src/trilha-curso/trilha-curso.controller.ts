import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrilhaCursoService } from './trilha-curso.service';
import { CreateTrilhaCursoDto } from './dto/create-trilha-curso.dto';
import { UpdateTrilhaCursoDto } from './dto/update-trilha-curso.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('trilha-curso')
@Controller('trilha-curso')
export class TrilhaCursoController {
  constructor(private readonly trilhaCursoService: TrilhaCursoService) {}

  @Post()
  @ApiOperation({ summary: 'Vincular um curso a uma trilha' })
  @ApiResponse({ status: 201, description: 'Vínculo trilha-curso criado com sucesso' })
  create(@Body() createTrilhaCursoDto: CreateTrilhaCursoDto) {
    return this.trilhaCursoService.create(createTrilhaCursoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar vínculos de trilhas e cursos com paginação' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.trilhaCursoService.findAll(query);
  }

  @Get(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Buscar vínculo específico trilha-curso' })
  @ApiParam({ name: 'idTrilha', description: 'ID da trilha', type: Number })
  @ApiParam({ name: 'idCurso', description: 'ID do curso', type: Number })
  @ApiResponse({ status: 200, description: 'Vínculo encontrado' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  findOne(
    @Param('idTrilha', ParseIntPipe) idTrilha: number,
    @Param('idCurso', ParseIntPipe) idCurso: number,
  ) {
    return this.trilhaCursoService.findOne(idTrilha, idCurso);
  }

  @Patch(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Atualizar dados de um vínculo trilha-curso' })
  @ApiParam({ name: 'idTrilha', description: 'ID da trilha', type: Number })
  @ApiParam({ name: 'idCurso', description: 'ID do curso', type: Number })
  @ApiResponse({ status: 200, description: 'Vínculo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  update(
    @Param('idTrilha', ParseIntPipe) idTrilha: number,
    @Param('idCurso', ParseIntPipe) idCurso: number,
    @Body() updateTrilhaCursoDto: UpdateTrilhaCursoDto,
  ) {
    return this.trilhaCursoService.update(idTrilha, idCurso, updateTrilhaCursoDto);
  }

  @Delete(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Remover vínculo entre trilha e curso' })
  @ApiParam({ name: 'idTrilha', description: 'ID da trilha', type: Number })
  @ApiParam({ name: 'idCurso', description: 'ID do curso', type: Number })
  @ApiResponse({ status: 200, description: 'Vínculo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Vínculo não encontrado' })
  remove(
    @Param('idTrilha', ParseIntPipe) idTrilha: number,
    @Param('idCurso', ParseIntPipe) idCurso: number,
  ) {
    return this.trilhaCursoService.remove(idTrilha, idCurso);
  }
}
