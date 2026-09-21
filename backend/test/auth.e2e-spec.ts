import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/common/configure-app';
import { AppModule } from './../src/app.module';
import { AuthService } from './../src/auth/auth.service';
import { Role } from './../src/generated/prisma/client';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  const authService = {
    login: jest.fn(),
    register: jest.fn(),
    me: jest.fn(),
  };

  const prisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.JWT_SECRET =
      process.env.JWT_SECRET ?? 'test-jwt-secret-for-e2e';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET / remains public', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('GET /api/v1/users without token returns 401', () => {
    return request(app.getHttpServer()).get('/api/v1/users').expect(401);
  });

  it('POST /api/v1/auth/login returns token payload', async () => {
    authService.login.mockResolvedValue({
      access_token: 'token',
      usuario: {
        id: 1,
        email: 'aluno@plataforma.com',
        nome: 'Aluno',
        role: Role.ALUNO,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'aluno@plataforma.com', senha: '0202' })
      .expect(200);

    expect(res.body.access_token).toBe('token');
    expect(authService.login).toHaveBeenCalledWith(
      'aluno@plataforma.com',
      '0202',
    );
  });
});
