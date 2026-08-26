# Trabalhofinaltcs2

Monorepo da plataforma de cursos: frontend React (Vite) e backend NestJS + Prisma + PostgreSQL.

```
Trabalhofinaltcs2/
  frontend/   # React + Vite + Bootstrap  (porta 3000)
  backend/    # NestJS + Prisma           (porta 8000)
```

## Pré-requisitos

- Node.js
- PostgreSQL na porta `5432` (usuário/senha `postgres`, banco `brincando`)

## Como rodar

Na raiz do monorepo:

```bash
npm install
npm run install:all
npm run dev
```

Isso sobe o backend na porta `8000` e o frontend na porta `3000` juntos.

App: [http://localhost:3000/trabalhofinaltcs/](http://localhost:3000/trabalhofinaltcs/)

API: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

## Usuários de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Admin | `admin@plataforma.com` | `0202` |
| Aluno | `aluno@plataforma.com` | `0202` |
