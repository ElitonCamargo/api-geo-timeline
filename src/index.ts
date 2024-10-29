import express from 'express';
import cors from 'cors';
import { verificarConexaoBanco } from './middlewares/verificarConexao';
import rotas_usuario from './routes/usuario';

const app = express();

// Configuração básica do CORS, permitindo acesso de qualquer origem
app.use(cors());

app.use(express.json());

// Middleware para verificar a conexão com o banco antes de todas as rotas
app.use(verificarConexaoBanco);

app.use('/', rotas_usuario); // Usando as rotas de usuário

app.get('/', (req, res) => {
  res.send('API Geo-Timeline funcionando');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} (http://localhost:${PORT})`);
});