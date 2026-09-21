import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagamentosService } from './pagamentos.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('pagamentos')
@ApiBearerAuth()
@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar um novo pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento registrado com sucesso' })
  create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.pagamentosService.create(createPagamentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagamentos com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.pagamentosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento', type: Number })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados/status de um pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento', type: Number })
  @ApiResponse({ status: 200, description: 'Pagamento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePagamentoDto: UpdatePagamentoDto) {
    return this.pagamentosService.update(id, updatePagamentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover registro de pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento', type: Number })
  @ApiResponse({ status: 200, description: 'Pagamento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentosService.remove(id);
  }
}
