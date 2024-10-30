"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticador = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Definir a chave secreta (idealmente deve ser armazenada em uma variável de ambiente)
const chaveSecretaJWT = process.env.JWT_SECRET || 'seu-segredo-seguro';
const autenticador = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(498).json({
            result: false,
            data: null,
            info: 'Token de autenticação não fornecido'
        });
    }
    try {
        // Verifica o token
        const decoded = jsonwebtoken_1.default.verify(token, chaveSecretaJWT);
        // Adiciona o ID do usuário à requisição para que possa ser utilizado nas rotas protegidas
        req.body.user_id = decoded.id;
        next(); // Continua para a próxima função middleware
    }
    catch (error) {
        console.error(error);
        return res.status(498).json({
            result: false,
            data: null,
            info: 'Login não autorizado'
        });
    }
};
exports.autenticador = autenticador;
//# sourceMappingURL=autenticador.js.map