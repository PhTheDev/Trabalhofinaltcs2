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

Na raiz:

```bash
npm run install:all
```

Backend:

```bash
cp backend/.env.example backend/.env
cd backend
npx prisma migrate deploy
node prisma/seed-demo.js
npm run start:dev
```

Frontend (outro terminal):

```bash
cp frontend/.env.example frontend/.env
npm run dev:frontend
```

App: [http://localhost:3000/trabalhofinaltcs/](http://localhost:3000/trabalhofinaltcs/)

API: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

## Usuários de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Admin | `admin@plataforma.com` | `0202` |
| Aluno | `aluno@plataforma.com` | `0202` |
