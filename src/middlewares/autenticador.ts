import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definir a chave secreta (idealmente deve ser armazenada em uma variável de ambiente)
const chaveSecretaJWT = process.env.JWT_SECRET || 'seu-segredo-seguro';

export const autenticador = (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, chaveSecretaJWT) as { id: number};
    // Adiciona o ID do usuário à requisição para que possa ser utilizado nas rotas protegidas
    req.body.user_id = decoded.id;
    next();  // Continua para a próxima função middleware
  } catch (error) {
    console.error(error);
    return res.status(498).json({
      result: false,
      data: null,
      info: 'Login não autorizado'
    });
  }
};
