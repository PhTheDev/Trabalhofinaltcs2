import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProgressoAulaService } from './progresso-aula.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('progresso-aula')
@ApiBearerAuth()
@Controller('progresso-aula')
export class ProgressoAulaController {
  constructor(private readonly progressoAulaService: ProgressoAulaService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar progresso de um usuário em uma aula' })
  @ApiResponse({ status: 201, description: 'Progresso registrado com sucesso' })
  create(@Body() createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.progressoAulaService.create(createProgressoAulaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros de progresso com paginação' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.progressoAulaService.findAll(query);
  }

  @Get(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Buscar progresso de um usuário em uma aula específica' })
  @ApiParam({ name: 'idUsuario', description: 'ID do usuário', type: Number })
  @ApiParam({ name: 'idAula', description: 'ID da aula', type: Number })
  @ApiResponse({ status: 200, description: 'Progresso encontrado' })
  @ApiResponse({ status: 404, description: 'Progresso não encontrado' })
  findOne(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idAula', ParseIntPipe) idAula: number,
  ) {
    return this.progressoAulaService.findOne(idUsuario, idAula);
  }

  @Patch(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Atualizar progresso de uma aula (ex: concluída, tempo assistido)' })
  @ApiParam({ name: 'idUsuario', description: 'ID do usuário', type: Number })
  @ApiParam({ name: 'idAula', description: 'ID da aula', type: Number })
  @ApiResponse({ status: 200, description: 'Progresso atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Progresso não encontrado' })
  update(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idAula', ParseIntPipe) idAula: number,
    @Body() updateProgressoAulaDto: UpdateProgressoAulaDto,
  ) {
    return this.progressoAulaService.update(idUsuario, idAula, updateProgressoAulaDto);
  }

  @Delete(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Remover registro de progresso de uma aula' })
  @ApiParam({ name: 'idUsuario', description: 'ID do usuário', type: Number })
  @ApiParam({ name: 'idAula', description: 'ID da aula', type: Number })
  @ApiResponse({ status: 200, description: 'Progresso removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Progresso não encontrado' })
  remove(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idAula', ParseIntPipe) idAula: number,
  ) {
    return this.progressoAulaService.remove(idUsuario, idAula);
  }
}
