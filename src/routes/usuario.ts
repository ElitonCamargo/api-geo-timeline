import { Router } from 'express';
import * as usuario from '../controllers/usuario';
import { autenticador } from '../middlewares/autenticador';

const rota = Router();
// Rotas publicas -> Não é necessário estar logado no sistema para acessar
rota.post('/usuario', usuario.cadastrar);
rota.post('/usuario/login', usuario.login);

//Rotas privadas -> É necessário estar logado para acessar
rota.get('/usuario',              autenticador, usuario.consultar);
rota.get('/usuario/logado',       autenticador, usuario.usuarioLogado);
rota.get('/usuario/:id',          autenticador, usuario.consultarPorId);
rota.get('/usuario/email/:email', autenticador, usuario.consultarPorEmail);
rota.delete('/usuario/:id',       autenticador, usuario.deletar);
rota.put('/usuario/:id',          autenticador, usuario.alterar);

export default rota;