import { Module } from '@nestjs/common';
import { ProgressoAulaService } from './progresso-aula.service';
import { ProgressoAulaController } from './progresso-aula.controller';

@Module({
  controllers: [ProgressoAulaController],
  providers: [ProgressoAulaService],
})
export class ProgressoAulaModule {}
