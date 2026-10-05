import { SwaggerModule } from '@nestjs/swagger';
import { configureSwagger } from './configure-swagger';

jest.mock('@nestjs/swagger', () => {
  const actual = jest.requireActual('@nestjs/swagger');
  return {
    ...actual,
    SwaggerModule: {
      ...actual.SwaggerModule,
      createDocument: jest.fn(() => ({
        openapi: '3.0.0',
        info: {},
        paths: {},
        components: {},
      })),
      setup: jest.fn(),
    },
  };
});

describe('configureSwagger', () => {
  it('applies bearer auth by default in Swagger UI', () => {
    const app = {} as any;

    configureSwagger(app);

    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      'api/docs',
      app,
      expect.any(Object),
      expect.objectContaining({
        swaggerOptions: expect.objectContaining({
          persistAuthorization: true,
          security: [{ bearer: [] }],
        }),
      }),
    );
  });
});
