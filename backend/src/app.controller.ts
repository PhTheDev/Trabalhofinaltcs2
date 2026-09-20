import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Healthcheck e mensagem de boas-vindas da API' })
  @ApiResponse({ status: 200, description: 'Serviço operacional' })
  getHello(): string {
    return this.appService.getHello();
  }
}
