import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CertificadosModule } from './certificados/certificados.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { AssinaturasModule } from './assinaturas/assinaturas.module';
import { TrilhaCursoModule } from './trilha-curso/trilha-curso.module';
import { TrilhasModule } from './trilhas/trilhas.module';
import { ProgressoAulaModule } from './progresso-aula/progresso-aula.module';
import { MatriculasModule } from './matriculas/matriculas.module';
import { AulasModule } from './aulas/aulas.module';
import { ModulosModule } from './modulos/modulos.module';
import { CursosModule } from './cursos/cursos.module';
import { PlanosModule } from './planos/planos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriasModule,
    PlanosModule,
    CursosModule,
    ModulosModule,
    AulasModule,
    MatriculasModule,
    ProgressoAulaModule,
    TrilhasModule,
    TrilhaCursoModule,
    AssinaturasModule,
    PagamentosModule,
    CertificadosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
