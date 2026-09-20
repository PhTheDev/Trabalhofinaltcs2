FROM node:22-alpine

WORKDIR /app

# Instala dependências de sistema necessárias para o Prisma no Alpine
RUN apk add --no-cache openssl

# Copia manifestos de dependências e arquivos de schema do Prisma
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# Instala todas as dependências (já executa prisma generate via script postinstall)
RUN npm install

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
