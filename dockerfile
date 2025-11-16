FROM node:18-alpine

WORKDIR /usr/src/app

# Instala dependências do sistema
RUN apk add --no-cache python3 make g++

# Copia APENAS os arquivos necessários para instalar as dependências
COPY backend/package*.json ./

# Instala as dependências com versões específicas
RUN npm install uuid@9.0.1
RUN npm install sequelize@6.37.7
RUN npm install sequelize-cli@6.6.2
RUN npm install

# Copia o restante dos arquivos
COPY backend/ .

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node app.js"]