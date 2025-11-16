FROM node:16-alpine 

WORKDIR /usr/src/app

# Instala dependências do sistema
RUN apk add --no-cache python3 make g++

# Copia APENAS os arquivos necessários para instalar as dependências
COPY backend/package*.json ./

# Instala as dependências com versões específicas
RUN npm install sequelize@6.37.7 sequelize-cli@6.6.2 pg@8.11.3 pg-hstore@2.3.4 uuid@8.3.2
RUN npm install

# Copia o restante dos arquivos
COPY backend/ .

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["sh", "-c", "node -e \"const { exec } = require('child_process'); exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => { console.log(stdout); console.error(stderr); if (error) { console.error(`Erro nas migrações: ${error}`); } });\"" , "node", "app.js"]