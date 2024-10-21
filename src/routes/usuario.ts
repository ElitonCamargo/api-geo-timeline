import { Router } from 'express';
import * as usuario from '../controllers/usuario';

const rota = Router();

rota.get('/usuario', usuario.consultar);
rota.get('/usuario/:id', usuario.consultarPorId);
rota.get('/usuario/email/:email', usuario.consultarPorEmail);
rota.post('/usuario', usuario.cadastrar);
rota.post('/usuario/login', usuario.login);
rota.delete('/usuario/:id', usuario.deletar);
rota.put('/usuario/:id', usuario.alterar);

export default rota;