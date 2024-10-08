import { Request, Response } from 'express';
import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const consultar = async (req: Request, res: Response) => {
  try {
    const users = await prisma.usuario.findMany(); // Buscar muitos
    res.json(users).status(200);
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

export const cadastrar = async (req: Request, res: Response)=>{
  try{
    const {nome, email, senha, data_nasc} = req.body;
      // Validação básica
      if (!nome || !email || !senha || !data_nasc) {
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
            senha: senhaCriptografada  // Salvando a senha criptografada
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