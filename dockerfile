FROM node:18-alpine

WORKDIR /usr/src/app

# Instala dependências do sistema
RUN apk add --no-cache python3 make g++

# Copia APENAS os arquivos necessários para instalar as dependências
COPY backend/package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY backend/ .

# Cria o diretório de configuração se não existir
RUN mkdir -p config

# Remove o postinstall para evitar erros durante o build
RUN npm remove -g sequelize-cli && \
    npm install -g sequelize-cli

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node app.js"]