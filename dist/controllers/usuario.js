"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alterar = exports.deletar = exports.consultarPorId = exports.usuarioLogado = exports.consultarPorEmail = exports.consultar = exports.login = exports.cadastrar = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Definir a chave secreta (idealmente deve ser armazenada em uma variável de ambiente)
const chaveSecretaJWT = process.env.JWT_SECRET || 'seu-segredo-seguro';
const cadastrar = async (req, res) => {
    const { nome, email, senha, data_nasc, sexo } = req.body; // Recebe os dados do corpo da requisição
    // Validação básica
    if (!nome || !email || !senha || !data_nasc || !sexo) {
        return res.status(400).json({
            result: false,
            data: null,
            info: "Dados obrigatórios não informados"
        });
    }
    try {
        // Verificar se o email já está cadastrado
        const usuarioExistente = await database_1.default.usuario.findUnique({
            where: { email }
        });
        if (usuarioExistente) {
            return res.status(400).json({
                result: false,
                data: null,
                info: "Email já cadastrado"
            });
        }
        // Criptografar a senha antes de salvar
        const salt = await bcryptjs_1.default.genSalt(10);
        const senhaCriptografada = await bcryptjs_1.default.hash(senha, salt);
        // Cadastrar o novo usuário
        const novoUsuario = await database_1.default.usuario.create({
            data: {
                nome,
                email,
                data_nasc: new Date(data_nasc),
                senha: senhaCriptografada, // Salvando a senha criptografada
                sexo
            }
        });
        // Retorna os dados do usuário sem a senha
        novoUsuario.senha = "";
        return res.status(201).json({
            result: true,
            data: novoUsuario,
            info: "Usuário cadastrado com sucesso",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            data: null,
            info: "Erro ao cadastrar usuário"
        });
    }
};
exports.cadastrar = cadastrar;
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        // Busca o usuário no banco de dados pelo email
        const usuario = await database_1.default.usuario.findUnique({
            where: { email }
        });
        if (usuario) {
            // Valida a senha comparando com o hash no banco de dados
            const senhaValida = await bcryptjs_1.default.compare(senha, usuario.senha);
            if (senhaValida) {
                // Remove a senha do objeto antes de enviar ao cliente
                usuario.senha = "";
                // Gera o token JWT com apenas o ID do usuário
                const valorUtil = { id: usuario.id }; // Incluindo apenas o ID no valorUtil
                // Gera o token JWT e define um tempo de expiração (exemplo: 7 dias)
                const token = jsonwebtoken_1.default.sign(valorUtil, chaveSecretaJWT, { expiresIn: '7d' });
                const dataAtual = new Date();
                const validadeTokenJWT = dataAtual.setDate(dataAtual.getDate() + 7);
                // Retorna a resposta de sucesso com o token e os dados do usuário
                return res.status(200).json({
                    result: true,
                    data: {
                        "token": { token, expiracao: new Date(validadeTokenJWT) },
                        "usuario": usuario
                    },
                    info: "Login efetuado com sucesso"
                });
            }
        }
        // Caso o usuário ou a senha estejam errados
        return res.status(404).json({
            result: false,
            data: null,
            info: "Usuário ou senha inválidos!!"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            data: null,
            info: 'Erro ao realizar o login'
        });
    }
};
exports.login = login;
const consultar = async (req, res) => {
    try {
        const { nome, email, data_nasc, sexo } = req.query;
        const whereCondicao = {}; // Inicializando um objeto para armazenar as condições
        // Adicionando condições de filtro se os parâmetros forem fornecidos
        if (nome) {
            whereCondicao.nome = {
                contains: String(nome), // Usa 'contains' para comportamento like
                mode: 'insensitive' // Busca sem considerar maiúsculas/minúsculas
            };
        }
        if (email) {
            whereCondicao.email = {
                equals: String(email), // Busca pelo email exato
                mode: 'insensitive' // Busca sem considerar maiúsculas/minúsculas
            };
        }
        if (data_nasc) {
            whereCondicao.data_nasc = {
                equals: new Date(String(data_nasc)), // Converte a data para o formato Date
            };
        }
        // Adicionando condições de filtro se os parâmetros forem fornecidos
        if (sexo) {
            whereCondicao.sexo = {
                contains: String(sexo), // Usa 'contains' para comportamento like
                mode: 'insensitive' // Busca sem considerar maiúsculas/minúsculas
            };
        }
        // Realizando a consulta com as condições definidas
        const users = await database_1.default.usuario.findMany({
            where: whereCondicao
        });
        if (users.length > 0) {
            const usuarios = users.map(u => u.senha = "");
            return res.status(200).json({
                result: true,
                data: users,
                info: "",
            });
        }
        else {
            return res.status(404).json({
                result: false,
                data: [],
                info: "Nenhum resultado encontrado para esta busca"
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            data: [],
            info: "Erro ao buscar usuários"
        });
    }
};
exports.consultar = consultar;
const consultarPorEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const usuario = await database_1.default.usuario.findUnique({ where: { email } });
        if (usuario) {
            usuario.senha = "";
            return res.status(200).json({
                result: true,
                data: usuario,
                info: "",
            });
        }
        else {
            return res.status(404).json({
                result: false,
                data: null,
                info: "Usuário não encontrado"
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            data: null,
            info: 'Erro interno de sistema ao buscar usuários'
        });
    }
};
exports.consultarPorEmail = consultarPorEmail;
const usuarioLogado = async (req, res) => {
    try {
        const id = req.body.user_id ?? 0;
        const usuario = await database_1.default.usuario.findUnique({ where: { id } });
        if (usuario) {
            usuario.senha = "";
            return res.status(200).json({
                result: true,
                data: usuario,
                info: "",
            });
        }
        else {
            return res.status(404).json({
                result: false,
                data: null,
                info: "Usuário não encontrado"
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            data: null,
            info: 'Erro interno do servidor ao buscar usuários'
        });
    }
};
exports.usuarioLogado = usuarioLogado;
const consultarPorId = async (req, res) => {
    try {
        const _id = parseInt(req.params.id);
        const usuario = await database_1.default.usuario.findUnique({ where: { id: _id } });
        if (usuario) {
            usuario.senha = "";
            return res.status(200).json({
                result: true,
                data: usuario,
                info: "",
            });
        }
        else {
            return res.status(404).json({
                result: false,
                data: null,
                info: "Usuário não encontrado"
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            data: null,
            info: 'Erro ao buscar usuários'
        });
    }
};
exports.consultarPorId = consultarPorId;
const deletar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const usuario = await database_1.default.usuario.findUnique({ where: { id } });
        if (usuario) {
            const userDeletado = await database_1.default.usuario.delete({ where: { id } });
            return res.status(200).json({
                result: true,
                data: userDeletado,
                info: "Usuário deletado com sucesso!!!",
            });
        }
        else {
            return res.status(404).json({
                result: false,
                data: null,
                info: "Usuário não encontrado"
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            data: null,
            info: 'Erro ao deletar usuários'
        });
    }
};
exports.deletar = deletar;
const alterar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // Extrair os campos do corpo da requisição
        const { nome, email, data_nasc, sexo } = req.body;
        // Criação do objeto alteracoes que vai receber os campos a serem atualizados
        const alteracoes = {};
        // Adicionar os campos somente se estiverem presentes na requisição
        if (nome)
            alteracoes.nome = nome;
        if (email)
            alteracoes.email = email;
        if (data_nasc)
            alteracoes.data_nasc = new Date(data_nasc); // Converter para Date caso data_nasc esteja presente
        if (sexo)
            alteracoes.sexo = sexo;
        // Verificar se o ID é válido
        if (isNaN(id)) {
            throw "ID inválido";
        }
        // Verificar se há alguma alteração a ser feita
        if (Object.keys(alteracoes).length === 0) {
            throw 'Nenhuma alteração fornecida';
        }
        // Atualizar o usuário
        const usuarioAtualizado = await database_1.default.usuario.update({
            where: { id },
            data: alteracoes,
        });
        // Responder com o usuário atualizado
        return res.status(200).json({
            result: true,
            data: usuarioAtualizado,
            info: "Dados alterados com sucesso"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            result: false,
            data: null,
            info: "Erro ao alterar usuário: " + error
        });
    }
};
exports.alterar = alterar;
//# sourceMappingURL=usuario.js.map