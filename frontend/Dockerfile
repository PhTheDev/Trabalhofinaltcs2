FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código-fonte
COPY . .

# Expõe a porta do servidor web
EXPOSE 3000

# Executa o Vite com host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
