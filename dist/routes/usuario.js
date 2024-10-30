"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario = __importStar(require("../controllers/usuario"));
const autenticador_1 = require("../middlewares/autenticador");
const rota = (0, express_1.Router)();
// Rotas publicas -> Não é necessário estar logado no sistema para acessar
rota.post('/usuario', usuario.cadastrar);
rota.post('/usuario/login', usuario.login);
//Rotas privadas -> É necessário estar logado para acessar
rota.get('/usuario', autenticador_1.autenticador, usuario.consultar);
rota.get('/usuario/logado', autenticador_1.autenticador, usuario.usuarioLogado);
rota.get('/usuario/:id', autenticador_1.autenticador, usuario.consultarPorId);
rota.get('/usuario/email/:email', autenticador_1.autenticador, usuario.consultarPorEmail);
rota.delete('/usuario/:id', autenticador_1.autenticador, usuario.deletar);
rota.put('/usuario/:id', autenticador_1.autenticador, usuario.alterar);
exports.default = rota;
//# sourceMappingURL=usuario.js.map