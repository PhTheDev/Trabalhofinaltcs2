import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TrilhaCursoService } from './trilha-curso.service';
import { CreateTrilhaCursoDto } from './dto/create-trilha-curso.dto';
import { UpdateTrilhaCursoDto } from './dto/update-trilha-curso.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('trilha-curso')
export class TrilhaCursoController {
  constructor(private readonly trilhaCursoService: TrilhaCursoService) {}

  @Post()
  create(@Body() createTrilhaCursoDto: CreateTrilhaCursoDto) {
    return this.trilhaCursoService.create(createTrilhaCursoDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.trilhaCursoService.findAll(query);
  }

  @Get(':idTrilha/:idCurso')
  findOne(
    @Param('idTrilha', ParseIntPipe) idTrilha: number,
    @Param('idCurso', ParseIntPipe) idCurso: number,
  ) {
    return this.trilhaCursoService.findOne(idTrilha, idCurso);
  }

  @Patch(':idTrilha/:idCurso')
  update(
    @Param('idTrilha', ParseIntPipe) idTrilha: number,
    @Param('idCurso', ParseIntPipe) idCurso: number,
    @Body() updateTrilhaCursoDto: UpdateTrilhaCursoDto,
  ) {
    return this.trilhaCursoService.update(idTrilha, idCurso, updateTrilhaCursoDto);
  }

  @Delete(':idTrilha/:idCurso')
  remove(
    @Param('idTrilha', ParseIntPipe) idTrilha: number,
    @Param('idCurso', ParseIntPipe) idCurso: number,
  ) {
    return this.trilhaCursoService.remove(idTrilha, idCurso);
  }
}
