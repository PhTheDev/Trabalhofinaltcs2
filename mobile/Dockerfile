FROM node:20-alpine

WORKDIR /app

# Compatibilidade para bibliotecas com binários pré-compilados
RUN apk add --no-cache libc6-compat

# Copia arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código-fonte
COPY . .

# Expõe a porta padrão do Expo / Metro Bundler / Expo Web
EXPOSE 8081

# Executa o Expo no modo web acessível externamente
CMD ["npx", "expo", "start", "--web", "--port", "8081"]
