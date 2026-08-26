import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';

/**
 * Configuração HTTP compartilhada entre bootstrap e e2e.
 * Assim o teste sobe a API do mesmo jeito que o processo real.
 */
export const configureApp = (app: INestApplication): void => {
  app.enableCors({ origin: true });

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
};
