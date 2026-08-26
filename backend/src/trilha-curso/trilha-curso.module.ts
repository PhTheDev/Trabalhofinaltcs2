import { Module } from '@nestjs/common';
import { TrilhaCursoService } from './trilha-curso.service';
import { TrilhaCursoController } from './trilha-curso.controller';

@Module({
  controllers: [TrilhaCursoController],
  providers: [TrilhaCursoService],
})
export class TrilhaCursoModule {}
