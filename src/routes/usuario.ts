import { Router } from 'express';
import * as usuario from '../controllers/usuario';

const rota = Router();

rota.post('/usuario',usuario.cadastrar);
rota.get('/usuario', usuario.consultar);
rota.get('/usuario/:id', usuario.consultarPorId);

export default rota;