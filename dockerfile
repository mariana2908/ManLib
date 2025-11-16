# Use a imagem oficial do Node.js 18
FROM node:18-alpine

# Cria o diretório da aplicação
WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY backend/package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY backend/ .

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]