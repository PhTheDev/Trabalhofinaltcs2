import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CertificadosService } from './certificados.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('certificados')
@ApiBearerAuth()
@Controller('certificados')
export class CertificadosController {
  constructor(private readonly certificadosService: CertificadosService) {}

  @Post()
  @ApiOperation({ summary: 'Emitir um novo certificado de conclusão' })
  @ApiResponse({ status: 201, description: 'Certificado emitido com sucesso' })
  create(@Body() createCertificadoDto: CreateCertificadoDto) {
    return this.certificadosService.create(createCertificadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar certificados emitidos com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de certificados retornada com sucesso' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.certificadosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um certificado pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do certificado', type: Number })
  @ApiResponse({ status: 200, description: 'Certificado encontrado' })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.certificadosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um certificado' })
  @ApiParam({ name: 'id', description: 'ID do certificado', type: Number })
  @ApiResponse({ status: 200, description: 'Certificado atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCertificadoDto: UpdateCertificadoDto) {
    return this.certificadosService.update(id, updateCertificadoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revogar/Remover um certificado' })
  @ApiParam({ name: 'id', description: 'ID do certificado', type: Number })
  @ApiResponse({ status: 200, description: 'Certificado removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.certificadosService.remove(id);
  }
}
