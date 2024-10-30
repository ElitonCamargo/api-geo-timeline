import { Request, Response } from 'express';
export declare const cadastrar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const consultar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const consultarPorEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const usuarioLogado: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const consultarPorId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deletar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const alterar: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
