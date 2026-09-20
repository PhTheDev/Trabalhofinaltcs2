import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('planos')
@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo plano de assinatura' })
  @ApiResponse({ status: 201, description: 'Plano criado com sucesso' })
  create(@Body() createPlanoDto: CreatePlanoDto) {
    return this.planosService.create(createPlanoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar planos de assinatura com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de planos retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.planosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar plano pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do plano', type: Number })
  @ApiResponse({ status: 200, description: 'Plano encontrado' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar informações de um plano' })
  @ApiParam({ name: 'id', description: 'ID do plano', type: Number })
  @ApiResponse({ status: 200, description: 'Plano atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlanoDto: UpdatePlanoDto) {
    return this.planosService.update(id, updatePlanoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um plano' })
  @ApiParam({ name: 'id', description: 'ID do plano', type: Number })
  @ApiResponse({ status: 200, description: 'Plano removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planosService.remove(id);
  }
}
