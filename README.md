# Trabalhofinaltcs2

Monorepo da plataforma de cursos: frontend React, backend NestJS e mobile React Native (Expo).

```
Trabalhofinaltcs2/
  frontend/   # React + Vite + Bootstrap  (porta 3000)
  backend/    # NestJS + Prisma           (porta 8000)
  mobile/     # React Native + Expo
```

## Pré-requisitos

- Node.js
- PostgreSQL na porta `5432` (usuário/senha `postgres`, banco `brincando`)
- Expo Go no celular (Android/iOS) para o app mobile

## Como rodar com Docker (Recomendado)

Para subir todos os serviços de uma vez (PostgreSQL, Backend e Frontend):

```bash
docker compose up --build
```

- **App web:** [http://localhost:3000/trabalhofinaltcs/](http://localhost:3000/trabalhofinaltcs/)
- **Documentação Swagger (OpenAPI):** [http://localhost:8000/api/docs](http://localhost:8000/api/docs) (ou [/docs](http://localhost:8000/docs))
- **OpenAPI Spec (JSON):** [http://localhost:8000/api/docs-json](http://localhost:8000/api/docs-json)
- **API Base:** [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

O container do backend executa automaticamente as migrações do Prisma e o seed de dados demo.

## Como rodar localmente sem Docker (web + API)

Na raiz do monorepo:

```bash
npm install
npm run install:all
npm run dev
```

App web: [http://localhost:3000/trabalhofinaltcs/](http://localhost:3000/trabalhofinaltcs/)  
API: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)  
Documentação Swagger: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

## Como rodar o mobile

Com o backend já no ar:

```bash
npm run dev:mobile
```

Escaneie o QR code no Expo Go. No celular físico, o app usa o IP da máquina (via Expo) e a API na porta 8000. Celular e PC precisam estar na mesma rede Wi-Fi.

Para forçar a URL da API:

```bash
# mobile/.env
EXPO_PUBLIC_API_URL=http://SEU_IP:8000/api/v1
```

## Usuários de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Admin | `admin@plataforma.com` | `0202` |
| Aluno | `aluno@plataforma.com` | `0202` |
