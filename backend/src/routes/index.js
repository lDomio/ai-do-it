import express from 'express';
import auth from './auth.js';
import usuarios from './usuarios.js';
import gigs, { setGigController } from './gigs.js';
import pedidos, { setPedidoController, setMensajeController } from './pedidos.js';
import categorias from './categorias.js';
import paquetes from './paquetes.js';
import opiniones, { setOpinionController } from './opiniones.js';
import mensajes from './mensajes.js';

import { GigService } from '../services/GigService.js';
import { PedidoService } from '../services/PedidoService.js';
import { OpinionService } from '../services/OpinionService.js';
import { GigController } from '../controllers/GigController.js';
import { OpinionController } from '../controllers/OpinionController.js';
import { PedidoController } from '../controllers/PedidoController.js';
import { MensajeController } from '../controllers/MensajeController.js';
import { MensajeService } from '../services/MensajeService.js';
import {
  gigRepository,
  categoriaRepository,
  pedidoRepository,
  opinionRepository,
  mensajeRepository,
} from '../store/index.js';

const router = express.Router();

const pedidoService = new PedidoService(pedidoRepository, gigRepository);
const mensajeService = new MensajeService(mensajeRepository, pedidoService);
const opinionService = new OpinionService(opinionRepository, pedidoService);
const gigService = new GigService(gigRepository, opinionService, categoriaRepository);

setGigController(new GigController(gigService));
setOpinionController(new OpinionController(opinionService));
setPedidoController(new PedidoController(pedidoService, gigService));
setMensajeController(new MensajeController(mensajeService));

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', auth);
router.use('/usuarios', usuarios);
router.use('/gigs', gigs);
router.use('/pedidos', pedidos);
router.use('/categorias', categorias);
router.use('/paquetes', paquetes);
router.use('/opiniones', opiniones);
router.use('/mensajes', mensajes);

export default router;
