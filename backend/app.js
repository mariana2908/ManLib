// Importações
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const routes = require('./routes');
const { requestLogger } = require('./services/logService');
// const { errorHandler } = require('./middleware/error');
const jobService = require('./services/jobService');

// Configuração do aplicativo
const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(requestLogger); // Logging detalhado
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', (req, res) => {
    res.send('API está rodando');
});
// Rotas
app.use('/api', routes);

// Configuração do Redis para cache (se disponível)
 let redisClient;
 if (process.env.REDIS_URL) {
     const Redis = require('ioredis');
     redisClient = new Redis(process.env.REDIS_URL);
     redisClient.on('error', (err) => console.error('Erro no Redis:', err));
 }

// Teste de conexão com o banco de dados
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

routes(app);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the Wiki API' });
});

// Inicialização do servidor
 const startServer = async () => {
     try {
         // Testa a conexão com o banco de dados
         await sequelize.authenticate();
         console.log('Conexão com o banco de dados estabelecida com sucesso.');
         // Inicia os jobs agendados
         jobService.initJobs();
         console.log('Jobs agendados iniciados.');

         // Inicia o servidor
         app.listen(port, () => {
             console.log(`Servidor rodando na porta ${port}`);
             if (redisClient) {
                 console.log('Cache Redis conectado');
             }
         });
     } catch (error) {
         console.error('Erro ao iniciar o servidor:', error);
         process.exit(1);
     }
 };

 startServer();