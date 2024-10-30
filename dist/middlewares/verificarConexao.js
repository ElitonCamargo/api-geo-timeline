"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarConexaoBanco = void 0;
const database_1 = __importDefault(require("../config/database")); // Caminho para o cliente Prisma
const verificarConexaoBanco = async (req, res, next) => {
    try {
        await database_1.default.$connect(); // Tenta conectar ao banco
        next(); // Se a conexão for bem-sucedida, continua para a próxima função ou rota
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return res.status(500).json({
            result: false,
            data: null,
            info: 'Não foi possível conectar ao banco de dados. Tente novamente mais tarde.'
        });
    }
};
exports.verificarConexaoBanco = verificarConexaoBanco;
//# sourceMappingURL=verificarConexao.js.map