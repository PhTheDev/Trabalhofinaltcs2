import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';
import { TrilhasService } from './trilhas.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('trilhas')
@ApiBearerAuth()
@Controller('trilhas')
export class TrilhasController {
  constructor(private readonly trilhasService: TrilhasService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova trilha de aprendizado' })
  @ApiResponse({ status: 201, description: 'Trilha criada com sucesso' })
  create(@Body() createTrilhaDto: CreateTrilhaDto) {
    return this.trilhasService.create(createTrilhaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar trilhas de aprendizado com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de trilhas retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.trilhasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de uma trilha pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da trilha', type: Number })
  @ApiResponse({ status: 200, description: 'Trilha encontrada' })
  @ApiResponse({ status: 404, description: 'Trilha não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar dados de uma trilha' })
  @ApiParam({ name: 'id', description: 'ID da trilha', type: Number })
  @ApiResponse({ status: 200, description: 'Trilha atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Trilha não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTrilhaDto: UpdateTrilhaDto) {
    return this.trilhasService.update(id, updateTrilhaDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover uma trilha' })
  @ApiParam({ name: 'id', description: 'ID da trilha', type: Number })
  @ApiResponse({ status: 200, description: 'Trilha removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Trilha não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.remove(id);
  }
}
