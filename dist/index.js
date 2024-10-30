"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const verificarConexao_1 = require("./middlewares/verificarConexao");
const usuario_1 = __importDefault(require("./routes/usuario"));
const app = (0, express_1.default)();
// Configuração básica do CORS, permitindo acesso de qualquer origem
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Middleware para verificar a conexão com o banco antes de todas as rotas
app.use(verificarConexao_1.verificarConexaoBanco);
app.use('/', usuario_1.default); // Usando as rotas de usuário
app.get('/', (req, res) => {
    res.send('API Geo-Timeline funcionando');
});
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log('Servidor rodando.', `Porta ${PORT} (http://localhost:${PORT})`);
});
