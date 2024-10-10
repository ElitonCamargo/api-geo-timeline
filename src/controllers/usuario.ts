import { Request, Response } from 'express';
import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const consultar = async (req: Request, res: Response) => {
  try {
    const { nome, email, data_nasc, sexo } = req.query;
    console.log(nome, email, data_nasc);
    const whereConditions: any = {}; // Inicializando um objeto para armazenar as condições

    // Adicionando condições de filtro se os parâmetros forem fornecidos
    if (nome) {
      whereConditions.nome = {
        contains: String(nome), // Usa 'contains' para comportamento like
        mode: 'insensitive' // Busca sem considerar maiúsculas/minúsculas
      };
    }

    if (email) {
      whereConditions.email = {
        equals: String(email), // Busca pelo email exato
        mode: 'insensitive' // Busca sem considerar maiúsculas/minúsculas
      };
    }

    if (data_nasc) {
      whereConditions.data_nasc = {
        equals: new Date(String(data_nasc)), // Converte a data para o formato Date
      };
    }

    // Adicionando condições de filtro se os parâmetros forem fornecidos
    if (sexo) {
      whereConditions.sexo = {
        contains: String(sexo), // Usa 'contains' para comportamento like
        mode: 'insensitive' // Busca sem considerar maiúsculas/minúsculas
      };
    }

    // Realizando a consulta com as condições definidas
    const users = await prisma.usuario.findMany({
      where: whereConditions
    });

    if (users.length > 0) {
      const usuarios = users.map(u=>u.senha = "");
      res.status(200).json({
        result: true,
        data: users,
        "info": "",
      });
    } else {
      res.status(404).json({
        result: false,
        data: [],
        "info": "Nenhum resultado encontrado para esta busca"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

export const consultarPorId = async (req: Request, res: Response)=>{
  try{
    const _id = parseInt(req.params.id);
    const usuario = await prisma.usuario.findUnique(
    {where:{id:_id}}
    );
    res.json(usuario).status(200);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}

export const consultarPorSexo = async (req: Request, res: Response)=>{
  try{
    const {sexo} = req.query;
    const whereConditions: any = {}; 
    if (sexo) {
      whereConditions.sexo = {
        equals: String(sexo), // Busca pelo email exato
        mode: 'insensitive' // Busca sem considerar maiúsculas/minúsculas
      };
    }

    const usuario = await prisma.usuario.findMany(
      {where: whereConditions}
    );
    res.json(usuario).status(200);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}

export const cadastrar = async (req: Request, res: Response)=>{
  try{
    const {nome, email, senha, data_nasc, sexo} = req.body;
      // Validação básica
      if (!nome || !email || !senha || !data_nasc || !sexo) {
        return res.status(400).json({
          result: false,
          data: null,
          info: "Nome, email e senha são obrigatórios"
        });
      }

      // Verificar se o email já está cadastrado
      const usuarioExistente = await prisma.usuario.findUnique({
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
      const salt = await bcrypt.genSalt(5);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      // Cadastrar o novo usuário
      const novoUsuario = await prisma.usuario.create(
        {
          data: {
            nome,
            email,
            data_nasc: new Date(data_nasc),
            senha: senhaCriptografada,  // Salvando a senha criptografada
            sexo
          }
        }
      );

      // Retorna os dados do usuário sem a senha
      novoUsuario.senha = "";
      res.status(201).json({
        result: true,
        info: "Usuário cadastrado com sucesso",
        data: novoUsuario
      });
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      result: false,
      info: "Erro ao cadastrar usuário",
      data: null
    });
  }
}