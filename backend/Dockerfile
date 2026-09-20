FROM node:20-alpine

WORKDIR /app

# Instala dependências de sistema necessárias para o Prisma no Alpine
RUN apk add --no-cache openssl

# Copia manifestos de dependências
COPY package*.json ./

# Instala todas as dependências
RUN npm install

# Copia arquivos do Prisma
COPY prisma ./prisma
COPY prisma.config.ts ./

# Gera os artefatos do Prisma Client
RUN npx prisma generate

# Copia arquivos de configuração e código-fonte
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Compila o projeto NestJS
RUN npm run build

# Expõe a porta da API
EXPOSE 8000

# Executa migrações, semente demo e inicializa a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed-demo.js && node dist/main.js"]
