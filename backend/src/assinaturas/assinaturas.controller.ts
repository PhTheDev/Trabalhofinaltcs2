import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssinaturasService } from './assinaturas.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('assinaturas')
@ApiBearerAuth()
@Controller('assinaturas')
export class AssinaturasController {
  constructor(private readonly assinaturasService: AssinaturasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova assinatura para um usuário' })
  @ApiResponse({ status: 201, description: 'Assinatura criada com sucesso' })
  create(@Body() createAssinaturaDto: CreateAssinaturaDto) {
    return this.assinaturasService.create(createAssinaturaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar assinaturas com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de assinaturas retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.assinaturasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar assinatura pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da assinatura', type: Number })
  @ApiResponse({ status: 200, description: 'Assinatura encontrada' })
  @ApiResponse({ status: 404, description: 'Assinatura não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assinaturasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma assinatura' })
  @ApiParam({ name: 'id', description: 'ID da assinatura', type: Number })
  @ApiResponse({ status: 200, description: 'Assinatura atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Assinatura não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAssinaturaDto: UpdateAssinaturaDto) {
    return this.assinaturasService.update(id, updateAssinaturaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma assinatura' })
  @ApiParam({ name: 'id', description: 'ID da assinatura', type: Number })
  @ApiResponse({ status: 200, description: 'Assinatura removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Assinatura não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assinaturasService.remove(id);
  }
}
