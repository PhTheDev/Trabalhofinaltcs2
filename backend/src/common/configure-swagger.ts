import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configuração da documentação OpenAPI / Swagger da aplicação.
 * Disponibiliza a interface gráfica em /api/docs e a especificação JSON em /api/docs-json.
 */
export const configureSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Plataforma de Cursos API')
    .setDescription(
      'Documentação interativa da API REST da Plataforma de Cursos (TCS).\n\n' +
        'Aqui você encontra todos os endpoints para autenticação, catálogo de cursos, ' +
        'gestão de aulas, matrículas, assinaturas, pagamentos e certificados.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e sessão de usuários')
    .addTag('users', 'Gerenciamento e listagem de usuários')
    .addTag('cursos', 'Catálogo e administração de cursos')
    .addTag('modulos', 'Módulos pedagógicos pertencentes a cursos')
    .addTag('aulas', 'Aulas, vídeos e materiais didáticos')
    .addTag('categorias', 'Classificação e agrupamento de cursos')
    .addTag('trilhas', 'Trilhas de conhecimento')
    .addTag('trilha-curso', 'Vínculos entre trilhas e cursos')
    .addTag('matriculas', 'Matrículas de usuários em cursos')
    .addTag('progresso-aula', 'Acompanhamento do progresso das aulas por usuário')
    .addTag('planos', 'Planos de assinatura disponíveis')
    .addTag('assinaturas', 'Contratos de assinatura de usuários')
    .addTag('pagamentos', 'Registros financeiros e transações de pagamento')
    .addTag('certificados', 'Emissão e verificação de certificados de conclusão')
    .addTag('health', 'Status e saúde da API')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Swagger - Plataforma de Cursos API',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Também expõe em /docs para conveniência
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Swagger - Plataforma de Cursos API',
  });
};
