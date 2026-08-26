import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProgressoAulaService } from './progresso-aula.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('progresso-aula')
export class ProgressoAulaController {
  constructor(private readonly progressoAulaService: ProgressoAulaService) {}

  @Post()
  create(@Body() createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.progressoAulaService.create(createProgressoAulaDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.progressoAulaService.findAll(query);
  }

  @Get(':idUsuario/:idAula')
  findOne(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idAula', ParseIntPipe) idAula: number,
  ) {
    return this.progressoAulaService.findOne(idUsuario, idAula);
  }

  @Patch(':idUsuario/:idAula')
  update(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idAula', ParseIntPipe) idAula: number,
    @Body() updateProgressoAulaDto: UpdateProgressoAulaDto,
  ) {
    return this.progressoAulaService.update(idUsuario, idAula, updateProgressoAulaDto);
  }

  @Delete(':idUsuario/:idAula')
  remove(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Param('idAula', ParseIntPipe) idAula: number,
  ) {
    return this.progressoAulaService.remove(idUsuario, idAula);
  }
}
