import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';  // Caminho para o cliente Prisma

export const verificarConexaoBanco = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.$connect();  // Tenta conectar ao banco
    next();  // Se a conexão for bem-sucedida, continua para a próxima função ou rota
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return res.status(500).json({
      result: false,
      data: null,
      info: 'Não foi possível conectar ao banco de dados. Tente novamente mais tarde.'
    });
  }
};
