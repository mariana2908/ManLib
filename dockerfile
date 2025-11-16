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

# Cria o diretório de configuração e copia o arquivo de configuração
RUN mkdir -p config && \
    if [ -f config/config.json ]; then \
        cp config/config.json config/config.json; \
    else \
        echo '{"development":{},"test":{},"production":{}}' > config/config.json; \
    fi

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["sh", "-c", "npm run db:migrate && npm start"]